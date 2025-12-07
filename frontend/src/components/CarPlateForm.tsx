import { doc, db, auth, setDoc, getDoc } from "@/config/firebase";
import React, { useEffect, useState } from "react";

// interface for type safety
interface UserData {
  carPlateNumber?: string;
}

export default function CarPlateForm() {
  const [plateValue, setPlateValue] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Distinction between adding new vs editing
  const [isLoading, setIsLoading] = useState(true); // Initial fetch loading
  const [isSaving, setIsSaving] = useState(false); // Submit loading
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        if (!auth.currentUser) {
          setIsLoading(false);
          return;
        }

        const userRef = doc(db, "users", auth.currentUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists() && isMounted) {
          const data = snap.data() as UserData;
          if (data.carPlateNumber) {
            // Convert database format (A-B-C) to display format (A B C)
            const spaced = data.carPlateNumber.replace(/-/g, " ");
            setPlateValue(spaced);
            setIsEditing(true);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (isMounted) setStatus({ type: "error", msg: "فشل تحميل البيانات" });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to clean input: Allow Arabic, English, Numbers only
  const sanitizeInput = (text: string) => {
    // Regex: Removes anything that is NOT Arabic, English, or Number
    return text.replace(/[^\u0600-\u06FFa-zA-Z0-9]/g, "").toUpperCase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(null); // Clear errors when typing
    const raw = e.target.value.replace(/\s+/g, ""); // Remove existing spaces
    const clean = sanitizeInput(raw);
    const spaced = clean.split("").join(" "); // Add space between every char
    setPlateValue(spaced);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const clean = sanitizeInput(text);
    const spaced = clean.split("").join(" ");
    setPlateValue(spaced);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!plateValue.trim()) return;

    setIsSaving(true);
    setStatus(null);

    try {
      if (!auth.currentUser) throw new Error("User not authenticated");

      // Save as A-B-C format to DB
      const dbFormat = plateValue.replace(/\s+/g, "-");
      const userRef = doc(db, "users", auth.currentUser.uid);

      await setDoc(userRef, { carPlateNumber: dbFormat }, { merge: true });

      setStatus({ type: "success", msg: "تم حفظ رقم اللوحة بنجاح" });
      setIsEditing(true);
    } catch (error) {
      console.error("Error saving plate:", error);
      setStatus({ type: "error", msg: "حدث خطأ أثناء الحفظ. حاول مرة أخرى" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center text-gray-500">جاري التحميل...</div>;
  }

  return (
    <div className="shadow-lg rounded-xl p-6 m-4 bg-white border border-gray-100 max-w-md mx-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-4 text-right">
        بيانات السيارة
      </h3>

      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-1">
          <label htmlFor="plate" className="text-sm text-gray-600 text-right">
            رقم اللوحة
          </label>
          <input
            id="plate"
            type="text"
            dir="ltr"
            value={plateValue}
            onChange={handleChange}
            onPaste={handlePaste}
            placeholder="م ص ر 1 2 3"
            maxLength={15} // Limit length to prevent spam
            className="p-3 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-xl font-mono tracking-wider uppercase transition-all"
          />
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`text-sm text-center p-2 rounded ${
              status.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {status.msg}
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving || !plateValue}
          className={`rounded-full p-3 font-medium text-white transition-colors flex justify-center items-center
            ${
              isSaving || !plateValue
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-md hover:shadow-lg"
            }`}
        >
          {isSaving ? (
            // Simple CSS Spinner
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <span>{isEditing ? "تعديل البيانات" : "إضافة اللوحة"}</span>
          )}
        </button>
      </form>
    </div>
  );
}
