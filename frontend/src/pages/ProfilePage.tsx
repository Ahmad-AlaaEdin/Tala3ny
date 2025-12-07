import { doc, db, auth, getDoc, setDoc } from "@/config/firebase";
import { useEffect, useState } from "react";
import CarPlateInput from "../components/CarPlateInput"; // Import the reusable component

export default function ProfilePlate() {
  const [currentUserPlate, setCurrentUserPlate] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (auth.currentUser) {
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (snap.exists() && snap.data().carPlateNumber) {
          setCurrentUserPlate(snap.data().carPlateNumber);
        }
      }
      setLoading(false);
    };
    loadUserData();
  }, []);

  const handleSaveProfile = async (plateNumber: string) => {
    if (!auth.currentUser) throw new Error("No user");
    const userRef = doc(db, "users", auth.currentUser.uid);
    // Logic: Save to Firestore
    await setDoc(userRef, { carPlateNumber: plateNumber }, { merge: true });
  };

  if (loading) return <p className="text-center p-4">جاري تحميل البيانات...</p>;

  return (
    <div className="max-w-md mx-auto m-4">
      <h2 className="text-right text-xl font-bold mb-4">ملفي الشخصي</h2>
      <CarPlateInput
        label="بيانات سيارتي"
        submitBtnText="حفظ التعديلات"
        initialValue={currentUserPlate} // Pass existing data
        onSubmit={handleSaveProfile} // Pass the save function
      />
    </div>
  );
}
