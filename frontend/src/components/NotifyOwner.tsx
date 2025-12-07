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
  const handleSendNotification = async (plateNumber: string) => {
    // 1. Logic: Search for the user with this plate
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("carPlateNumber", "==", plateNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("لم يتم العثور على مالك لهذه السيارة");
    }

    // 2. Logic: Send notification (Example logic)
    const targetUser = querySnapshot.docs[0];
    const notificationsRef = collection(db, "notifications");

    await addDoc(notificationsRef, {
      toUserId: targetUser.id,
      fromUserId: auth.currentUser?.uid || "anonymous",
      message: "يرجى تحريك سيارتك",
      createdAt: new Date(),
      plateNumber: plateNumber,
    });
  };

  return (
    <div className="max-w-md mx-auto m-4">
      <h2 className="text-right text-xl font-bold mb-4">تنبيه مالك سيارة</h2>
      <div className="bg-yellow-50 p-3 mb-4 rounded text-right text-sm text-yellow-800">
        أدخل رقم السيارة لإرسال تنبيه للمالك فوراً
      </div>

      <CarPlateInput
        label="رقم السيارة المراد تنبيهها"
        submitBtnText="إرسال تنبيه"
        loadingText="جاري البحث والإرسال..."
        onSubmit={handleSendNotification} // Pass the notify function
      />
    </div>
  );
}
