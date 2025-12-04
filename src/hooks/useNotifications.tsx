import { useState, useEffect, useCallback } from "react";

export function useNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>("default");

    useEffect(() => {
        if ("Notification" in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications");
            return false;
        }

        const result = await Notification.requestPermission();
        setPermission(result);
        return result === "granted";
    }, []);

    const sendNotification = useCallback(
        (title: string, options?: NotificationOptions) => {
            if (!("Notification" in window)) {
                console.log("This browser does not support notifications");
                return;
            }

            if (permission !== "granted") {
                console.log("Notification permission not granted");
                return;
            }

            try {
                const notification = new Notification(title, {
                    icon: "/favicon.ico",
                    badge: "/favicon.ico",
                    ...options,
                });

                notification.onclick = () => {
                    window.focus();
                    notification.close();
                };

                // Auto close after 5 seconds
                setTimeout(() => notification.close(), 5000);
            } catch (error) {
                console.error("Error sending notification:", error);
            }
        },
        [permission]
    );

    return {
        permission,
        requestPermission,
        sendNotification,
        isSupported: "Notification" in window,
    };
}
