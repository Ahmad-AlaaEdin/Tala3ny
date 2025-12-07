import { useState, useEffect } from "react";

export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermission>(
    Notification.permission
  );

  useEffect(() => {
    // Update state initially
    setPermission(Notification.permission);

    // Try to listen for changes via Permissions API
    if ("permissions" in navigator) {
      navigator.permissions
        .query({ name: "notifications" as PermissionName })
        .then((status) => {
          status.onchange = () => {
            setPermission(Notification.permission);
          };
        })
        .catch((error) => {
          console.log("Permissions API not supported for notifications:", error);
        });
    }
  }, []);

  return permission;
}
