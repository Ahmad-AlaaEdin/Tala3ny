import { useState, useEffect } from "react";
import { auth } from "../config/firebase";
import { useFCMToken } from "../hooks/useFCMToken";
import NotifyOwner from "@/components/NotifyOwner";

const ScanPage = () => {
  const [permission, setPermission] = useState<NotificationPermission>(
    Notification.permission
  );
  const [loading, setLoading] = useState(false);

  // Use the new FCM token hook
  const { tokenRegistered, refreshToken } = useFCMToken(auth.currentUser);

  async function askForNotificationPermission() {
    if (!("Notification" in window)) {
      alert("متصفحك لا يدعم الإشعارات");
      return;
    }

    setLoading(true);

    try {
      // Request permission
      const result = await Notification.requestPermission();

      // Update local state immediately
      setPermission(result);

      if (result === "granted") {
        console.log("Permission granted!");
        // Trigger token registration
        await refreshToken();
      } else if (result === "denied") {
        console.log("Permission denied by user.");
        alert("يرجى تفعيل الإشعارات من إعدادات المتصفح لتلقي التنبيهات.");
      }
    } catch (error) {
      console.error("Error asking for permission: ", error);
      alert("حدث خطأ أثناء طلب إذن الإشعارات");
    } finally {
      setLoading(false);
    }
  }

  // Check permission on mount and when page becomes visible
  useEffect(() => {
    const updatePermission = () => {
      const currentPermission = Notification.permission;
      if (currentPermission !== permission) {
        console.log("Permission changed:", currentPermission);
        setPermission(currentPermission);

        // If permission was granted externally, refresh token
        if (currentPermission === "granted" && !tokenRegistered) {
          refreshToken();
        }
      }
    };

    // Check immediately
    updatePermission();

    // Re-check when page becomes visible (user might have changed settings)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updatePermission();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Also check periodically every 30 seconds
    const interval = setInterval(updatePermission, 30000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, [permission, tokenRegistered, refreshToken]);

  return (
    <>
      {permission !== "granted" && (
        <div className="w-full flex flex-col items-center gap-2 p-4 bg-amber-50 border-b border-amber-200">
          <div className="text-center text-sm text-amber-800">
            <p className="font-semibold mb-1">🔔 لتلقي التنبيهات</p>
            <p className="text-xs">يجب تفعيل الإشعارات أولاً</p>
          </div>
          <button
            onClick={askForNotificationPermission}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white px-6 py-2 rounded-2xl transition-colors"
          >
            {loading ? "جاري التحميل..." : "تفعيل التنبيهات"}
          </button>
        </div>
      )}

      {permission === "granted" && tokenRegistered && (
        <div className="w-full p-2 bg-green-50 text-green-800 text-center text-sm border-b border-green-200">
          ✓ التنبيهات مفعلة
        </div>
      )}

      {permission === "granted" && !tokenRegistered && (
        <div className="w-full p-2 bg-yellow-50 text-yellow-800 text-center text-sm border-b border-yellow-200">
          ⏳ جاري تفعيل التنبيهات...
        </div>
      )}

      <NotifyOwner />
    </>
  );
};

export default ScanPage;
