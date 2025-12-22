import { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  db,
  addDoc,
  auth,
} from "@/config/firebase";
import CarPlateInput from "./CarPlateInput";

export default function NotifyOwner() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSendNotification = async (plateNumber: string) => {
    setStatus("idle");
    setStatusMessage("");

    try {
      // 1. Validate current user
      if (!auth.currentUser) {
        throw new Error("يجب تسجيل الدخول أولاً");
      }

      // 2. Search for the user with this plate
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("carPlateNumber", "==", plateNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("لم يتم العثور على مالك لهذه السيارة");
      }

      const targetUser = querySnapshot.docs[0];

      // 3. Check if user is trying to send notification to themselves
      if (targetUser.id === auth.currentUser.uid) {
        throw new Error("لا يمكنك إرسال تنبيه لنفسك");
      }

      // 4. Create notification document
      const notificationsRef = collection(db, "notifications");
      await addDoc(notificationsRef, {
        toUserId: targetUser.id,
        fromUserId: auth.currentUser.uid,
        message: "يرجى تحريك سيارتك",
        createdAt: new Date(),
        plateNumber: plateNumber,
        status: "pending", // Will be updated by Cloud Function
      });

      // 5. Success feedback
      setStatus("success");
      setStatusMessage("✅ تم إرسال التنبيه بنجاح!");

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
      }, 5000);
    } catch (error) {
      // 6. Error handling with user feedback
      console.error("Error sending notification:", error);

      const errorMessage =
        error instanceof Error ? error.message : "حدث خطأ أثناء إرسال التنبيه";

      setStatus("error");
      setStatusMessage(errorMessage);

      // Auto-hide error message after 7 seconds
      setTimeout(() => {
        setStatus("idle");
        setStatusMessage("");
      }, 7000);

      throw error; // Re-throw to trigger CarPlateInput error handling
    }
  };

  return (
    <div className="max-w-md mx-auto m-4">
      <h2 className="text-right text-xl font-bold mb-4">تنبيه مالك سيارة</h2>

      <div className="bg-yellow-50 p-3 mb-4 rounded text-right text-sm text-yellow-800">
        أدخل رقم السيارة لإرسال تنبيه للمالك فوراً
      </div>

      {/* Status Message */}
      {status !== "idle" && (
        <div
          className={`p-3 mb-4 rounded text-right text-sm ${
            status === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
          role="alert"
        >
          {statusMessage}
        </div>
      )}

      <CarPlateInput
        label="رقم السيارة المراد تنبيهها"
        submitBtnText="إرسال تنبيه"
        loadingText="جاري البحث والإرسال..."
        onSubmit={handleSendNotification}
      />

      {/* Help Text */}
      <div className="mt-4 text-xs text-gray-500 text-right">
        <p>💡 ملاحظات:</p>
        <ul className="list-disc list-inside mr-4 mt-2 space-y-1">
          <li>سيتم إرسال إشعار فوري لمالك السيارة</li>
          <li>تأكد من كتابة رقم اللوحة بشكل صحيح</li>
          <li>يمكنك إرسال تنبيه كل 5 دقائق فقط لنفس السيارة</li>
        </ul>
      </div>
    </div>
  );
}
