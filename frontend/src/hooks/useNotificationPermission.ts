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

        // Map 'prompt' from PermissionState to React state value "default"
        function mapPermissionState(
          state: PermissionState
        ): "default" | "denied" | "granted" {
          if (state === "prompt") return "default";
          return state; // "granted" or "denied"
        }

        status.onchange = () => {
          console.log(status);
          setPermission(mapPermissionState(status.state));
        };

        setPermission(mapPermissionState(status.state));

        setPermission(Notification.permission);
      } catch (e) {
        console.log(e);
      }
    }

    checkPermission();
  }, []);

  return permission;
}
