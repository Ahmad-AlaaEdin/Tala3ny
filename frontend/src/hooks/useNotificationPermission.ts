import { useState, useEffect } from "react";

export function useNotificationPermission() {
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    async function checkPermission() {
      if (!("permissions" in navigator)) {
        return;
      }

      try {
        const status = await navigator.permissions.query({
          name: "notifications",
        });

        status.onchange = () => {
          console.log(status);
          setPermission(status.state);
        };

        setPermission(status.state);
      } catch (error) {
        console.error("Error checking notification permission:", error);

        setPermission(Notification.permission);
      }
    }

    checkPermission();
  }, []);

  return permission;
}
