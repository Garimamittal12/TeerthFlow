import argparse
import cv2
import numpy as np
import torch
import torch.nn as nn
import time
import sys
import json
import requests
from collections import deque
from flask import Flask, jsonify
import threading


# -------------------------
# HARD-CODED Mailjet KEYS
# -------------------------
MAILJET_API_KEY = "d2123680c92ed30b0755c07efb832660"
MAILJET_SECRET_KEY = "6d7ab600e1f43f17251fd88ac6856e43"
MAIL_FROM = "industriesstark80@gmail.com"
MAIL_FROM_NAME = "Temple"
MAIL_TO = "nitin.sikarwar939@gmail.com"
MAIL_TO_NAME = "Authority"


class TinyRiskModel(nn.Module):
    def __init__(self, feat_dim=5, hidden=16):
        super().__init__()
        self.gru = nn.GRU(input_size=feat_dim, hidden_size=hidden, batch_first=True)
        self.fc = nn.Linear(hidden, 1)

    def forward(self, x):
        """
        x: [B, T, D]
        returns: [B, 1] risk in [0,1]
        """
        _, h = self.gru(x)   # h: [1,B,H]
        h = h.squeeze(0)
        logit = self.fc(h)
        return torch.sigmoid(logit)


# ==========================
# 2. YuNet-based head/face detection
# ==========================

def load_yunet(model_path):
    """
    Load YuNet face/head detector via OpenCV's FaceDetectorYN.
    """
    detector = cv2.FaceDetectorYN.create(
        model=model_path,
        config="",
        input_size=(320, 320),  # will be overwritten by setInputSize per frame
        score_threshold=0.2,    # lowered to catch more heads on low-quality video
        nms_threshold=0.3,
        top_k=5000
    )
    return detector


def detect_heads_yunet(detector, frame):
    """
    Detect heads/faces using YuNet on the *processed* frame (may be resized).

    Returns:
        boxes: list of [x1, y1, x2, y2] in frame coordinates
        centers: list of [cx, cy]
    """
    h, w = frame.shape[:2]

    # Tell YuNet the current frame size
    detector.setInputSize((w, h))

    # detector.detect returns: (num_faces, faces)
    # faces: Nx15 -> [x, y, w, h, score, lmk1_x, lmk1_y, ...]
    retval, faces = detector.detect(frame)

    boxes = []
    centers = []

    if faces is None or len(faces) == 0:
        return boxes, centers

    faces = faces.reshape(-1, 15)

    for f in faces:
        x, y, w_box, h_box, score = f[:5]
        if score < 0.2:   # match score_threshold
            continue

        x1 = int(max(0, x))
        y1 = int(max(0, y))
        x2 = int(min(w - 1, x + w_box))
        y2 = int(min(h - 1, y + h_box))

        boxes.append([x1, y1, x2, y2])
        centers.append([(x1 + x2) / 2.0, (y1 + y2) / 2.0])

    return boxes, centers


# ==========================
# 3. Feature extraction
# ==========================

def compute_frame_features(centers, prev_centers, frame_width, frame_height):
    """
    Features per frame:
      [num_people, mean_dist, min_dist, area, avg_speed]
    All normalized by frame size.
    """
    if len(centers) == 0:
        return np.array([0, 0, 0, 0, 0], dtype=np.float32)

    pts = np.array(centers, dtype=np.float32)
    N = pts.shape[0]

    norm_x = pts[:, 0] / float(frame_width)
    norm_y = pts[:, 1] / float(frame_height)
    norm_pts = np.stack([norm_x, norm_y], axis=1)

    # pairwise distances
    if N > 1:
        diff = norm_pts[None, :, :] - norm_pts[:, None, :]
        dists = np.linalg.norm(diff, axis=-1)
        i, j = np.triu_indices(N, 1)
        dists = dists[i, j]
        mean_dist = float(dists.mean())
        min_dist = float(dists.min())
    else:
        mean_dist = 0.0
        min_dist = 0.0

    # area covered by all heads (normalized)
    xs, ys = norm_pts[:, 0], norm_pts[:, 1]
    area = float((xs.max() - xs.min()) * (ys.max() - ys.min()))

    # average speed vs previous frame
    if prev_centers is not None and len(prev_centers) == N:
        prev = np.array(prev_centers, dtype=np.float32)
        prev_norm = np.stack([
            prev[:, 0] / float(frame_width),
            prev[:, 1] / float(frame_height)
        ], axis=1)
        speed = float(np.linalg.norm(norm_pts - prev_norm, axis=1).mean())
    else:
        speed = 0.0

    feat = np.array([N, mean_dist, min_dist, area, speed], dtype=np.float32)
    return feat


# ==========================
# 4. Flask API (binary stampede status)
# ==========================

app = Flask(__name__)

# 0 = no stampede, 1 = stampede
STAMPede_STATUS = 0  # global updated in main loop


@app.route("/stampede", methods=["GET"])
def stampede_api():
    """
    Returns:
      { "status": 0 }  or  { "status": 1 }
    """
    return jsonify({"status": int(STAMPede_STATUS)})


def run_api(api_host, api_port):
    # run Flask in a separate thread
    app.run(host=api_host, port=api_port, debug=False, use_reloader=False)


# ==========================
# 5. Mailjet alert helper
# ==========================

def send_mailjet_alert(api_key, secret_key, from_email, from_name, to_email, to_name, subject, html_body, text_body=None):
    """
    Sends an email via Mailjet API. Returns (status_code, text).
    """
    url = "https://api.mailjet.com/v3.1/send"
    data = {
        "Messages": [
            {
                "From": {"Email": from_email, "Name": from_name},
                "To": [{"Email": to_email, "Name": to_name}],
                "Subject": subject,
                "TextPart": text_body or "Potential stampede detected.",
                "HTMLPart": html_body,
            }
        ]
    }
    try:
        resp = requests.post(url, auth=(api_key, secret_key), json=data, timeout=10)
        return resp.status_code, resp.text
    except Exception as e:
        return None, str(e)


# ==========================
# 6. Utility: parse source (int index or string URL)
# ==========================

def parse_source(src_str):
    """
    Convert numeric strings like '0' to int 0 so cv2.VideoCapture opens webcam.
    Otherwise return original string (URL or file path).
    """
    if src_str is None:
        return 0
    try:
        # allow e.g. '0' or '1' -> int
        idx = int(src_str)
        return idx
    except Exception:
        return src_str


# ==========================
# 7. Main loop
# ==========================

def main():
    global STAMPede_STATUS

    parser = argparse.ArgumentParser(description="YuNet stampede detector (supports file, webcam or URL stream)")
    parser.add_argument("source", nargs="?", default=None,
                        help="Video source: integer for webcam (e.g. 0), local file path, or URL like http://10.0.0.1:8000/video")
    parser.add_argument("--yunet", default="face_detection_yunet_2023mar.onnx", help="YuNet model path")
    parser.add_argument("--weights", default="tiny_risk_model.pth", help="Risk model weights")
    parser.add_argument("--window-t", type=int, default=16, help="Temporal window for GRU")
    parser.add_argument("--frame-skip", type=int, default=10, help="Process every N frames")
    parser.add_argument("--max-capacity", type=int, default=200)
    parser.add_argument("--api-host", default="0.0.0.0")
    parser.add_argument("--api-port", type=int, default=8000)
    parser.add_argument("--alert-cooldown", type=int, default=300, help="Seconds to wait between alerts (kept for compatibility but not used in one-shot mode)")

    args = parser.parse_args()

    YUNET_MODEL = args.yunet
    RISK_MODEL_WEIGHTS = args.weights
    USE_CUDA = False
    WINDOW_T = args.window_t
    RISK_THRESHOLD = 0.7
    MAX_CAPACITY = args.max_capacity
    SCALE_FACTOR = 1.0
    FRAME_SKIP = max(1, args.frame_skip)
    HEAD_SMOOTH_WINDOW = 5
    PRINT_FOR_BACKEND = True

    alert_cooldown = args.alert_cooldown

    # ---- start API in background thread ----
    api_thread = threading.Thread(target=run_api, args=(args.api_host, args.api_port), daemon=True)
    api_thread.start()

    # ---- load YuNet ----
    print("[INFO] Loading YuNet head/face detector...")
    detector = load_yunet(YUNET_MODEL)

    # ---- risk model ----
    device = torch.device("cpu")
    risk_model = TinyRiskModel(feat_dim=5, hidden=16).to(device)
    try:
        state = torch.load(RISK_MODEL_WEIGHTS, map_location=device)
        risk_model.load_state_dict(state)
        print("[INFO] Loaded trained risk model from", RISK_MODEL_WEIGHTS)
    except Exception as e:
        print("[WARN] Could not load risk model weights:", e)
        print("       Using untrained TinyRiskModel (risk will be random-ish).")
    risk_model.eval()

    # ---- video source (webcam, file or URL) ----
    source_arg = parse_source(args.source)

    cap = cv2.VideoCapture(source_arg)

    # If opening failed and source was a string URL, retry a couple of times (some HTTP streams take a moment)
    if not cap.isOpened() and isinstance(source_arg, str):
        print(f"[WARN] Couldn't open stream '{source_arg}' immediately. Retrying for 10 seconds...")
        start_wait = time.time()
        while time.time() - start_wait < 10:
            time.sleep(0.5)
            cap = cv2.VideoCapture(source_arg)
            if cap.isOpened():
                break

    if not cap.isOpened():
        print("[ERROR] Could not open video source:", source_arg)
        return

    feat_buffer = deque(maxlen=WINDOW_T)
    prev_centers = None
    last_time = time.time()
    frame_idx = 0

    head_history = deque(maxlen=HEAD_SMOOTH_WINDOW)

    last_boxes = []
    last_heads_raw = 0
    model_risk = 0.0

    # consecutive stampede counter & one-shot alert flag
    stampede_counter = 0
    alert_sent = False

    while True:
        ret, frame_full = cap.read()
        if not ret:
            # Some network streams return False intermittently; try to reopen once
            print("[INFO] Frame read failed. Attempting to reopen stream/file once...")
            cap.release()
            time.sleep(0.5)
            cap = cv2.VideoCapture(source_arg)
            time.sleep(0.5)
            ret, frame_full = cap.read()
            if not ret:
                print("[INFO] End of stream / can't read frame.")
                break

        # Downscale for processing to save CPU
        if SCALE_FACTOR != 1.0:
            frame = cv2.resize(
                frame_full,
                None,
                fx=SCALE_FACTOR,
                fy=SCALE_FACTOR,
                interpolation=cv2.INTER_LINEAR
            )
        else:
            frame = frame_full

        H, W = frame.shape[:2]

        run_heavy = (frame_idx % FRAME_SKIP == 0) or (frame_idx == 0)

        if run_heavy:
            boxes, centers = detect_heads_yunet(detector, frame)
            heads_raw = len(centers)

            feat = compute_frame_features(centers, prev_centers, W, H)
            prev_centers = centers if heads_raw > 0 else None
            feat_buffer.append(feat)

            if len(feat_buffer) == WINDOW_T:
                x = torch.tensor(np.array(feat_buffer), dtype=torch.float32).unsqueeze(0)
                with torch.no_grad():
                    model_risk = float(risk_model(x.to(device)).item())
            else:
                model_risk = 0.0

            last_boxes = boxes
            last_heads_raw = heads_raw

        else:
            boxes = last_boxes
            heads_raw = last_heads_raw

        head_history.append(heads_raw)
        if len(head_history) > 0:
            heads = int(round(sum(head_history) / len(head_history)))
        else:
            heads = heads_raw

        if MAX_CAPACITY > 0:
            occupancy_ratio = heads / float(MAX_CAPACITY)
            occupancy_ratio = max(0.0, min(occupancy_ratio, 1.0))
        else:
            occupancy_ratio = 0.0

        numeric_risk = max(model_risk, occupancy_ratio)
        numeric_risk = max(0.0, min(1.0, numeric_risk))

        if numeric_risk >= RISK_THRESHOLD:
            STAMPede_STATUS = 1
        else:
            STAMPede_STATUS = 0

        # --- consecutive counter logic ---
        if STAMPede_STATUS == 1:
            stampede_counter += 1
        else:
            stampede_counter = 0

        # one-shot alert: send only once ever when we first observe 3 consecutive stampede frames
        if (not alert_sent) and stampede_counter >= 3:
            subject = "POTENTIAL STAMPEDE RISK"
            # HTMLPart: bold red heading
                # build a safe multi-line HTML body using a triple-quoted f-string
            html_body = f"""<h3 style="color:red;font-weight:bold;">Potential Stampede Risk</h3>
            <p>Detected at frame <b>{frame_idx}</b> — heads (smoothed): <b>{heads}</b>, occupancy: <b>{occupancy_ratio:.2f}</b></p>
            <p>Numeric risk: <b>{numeric_risk:.2f}</b></p>
            <p>Consecutive stampede count: <b>{stampede_counter}</b></p>
            <p>Timestamp: <b>{time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))}</b></p>
            """


            status_code, resp_text = send_mailjet_alert(
                MAILJET_API_KEY, MAILJET_SECRET_KEY,
                MAIL_FROM, MAIL_FROM_NAME,
                MAIL_TO, MAIL_TO_NAME,
                subject, html_body
            )
            alert_sent = True
            print(f"[ALERT] One-shot Mailjet send status: {status_code}{resp_text}")

        if STAMPede_STATUS == 1:
            color = (0, 0, 255)
            risk_str = "STAMPede"
        else:
            color = (0, 255, 0)
            risk_str = "NO STAMPEDE"

        if PRINT_FOR_BACKEND:
            record = {
                "frame": frame_idx,
                "heads": heads,
                "max_capacity": MAX_CAPACITY,
                "occupancy_ratio": round(occupancy_ratio, 3),
                "stampede": int(STAMPede_STATUS)
            }
            print(json.dumps(record), flush=True)

        for (x1, y1, x2, y2) in boxes:
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)

        cv2.putText(frame, f"Heads: {heads}", (10, 30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.putText(frame, risk_str, (10, 60),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)

        now = time.time()
        fps = 1.0 / (now - last_time) if now != last_time else 0.0
        last_time = now
        cv2.putText(frame, f"FPS: {fps:.1f}", (10, 90),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (200, 200, 200), 1)

        frame_idx += 1

        cv2.imshow("YuNet Head Detector - Stampede Risk (Binary)", frame)
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
