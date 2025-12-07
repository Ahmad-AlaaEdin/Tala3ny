import React, { useEffect, useState } from "react";

interface CarPlateInputProps {
  initialValue?: string; // Optional: e.g., "A-B-C-1-2-3"
  onSubmit: (formattedPlate: string) => Promise<void>; // Parent handles the logic
  label?: string;
  submitBtnText?: string;
  loadingText?: string;
  placeholder?: string;
}

export default function CarPlateInput({
  initialValue = "",
  onSubmit,
  label = "رقم اللوحة",
  submitBtnText = "تأكيد",
  loadingText = "جاري المعالجة...",
  placeholder = "م ص ر 1 2 3",
}: CarPlateInputProps) {
  const [plateValue, setPlateValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  // Sync internal state if initialValue changes (e.g. after data fetch)
  useEffect(() => {
    if (initialValue) {
      const spaced = initialValue.replace(/-/g, " ");
      setPlateValue(spaced);
    }
  }, [initialValue]);

  // Helper: Allow Arabic, English, Numbers only
  const sanitizeInput = (text: string) => {
    return text.replace(/[^\u0600-\u06FFa-zA-Z0-9]/g, "").toUpperCase();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(null);
    const raw = e.target.value.replace(/\s+/g, "");
    const clean = sanitizeInput(raw);
    const spaced = clean.split("").join(" ");
    setPlateValue(spaced);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    const clean = sanitizeInput(text);
    const spaced = clean.split("").join(" ");
    setPlateValue(spaced);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!plateValue.trim()) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      // Prepare format for DB/API (e.g., "A-B-C-1-2-3")
      const formattedForParent = plateValue.replace(/\s+/g, "-");

      // Call the parent function
      await onSubmit(formattedForParent);

      setStatus({ type: "success", msg: "تمت العملية بنجاح" });

      // Optional: Clear input if it's not an edit form
      if (!initialValue) setPlateValue("");
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", msg: "حدث خطأ. يرجى المحاولة مرة أخرى." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="shadow-lg rounded-xl p-6 bg-white border border-gray-100 w-full">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600 text-right font-bold">
            {label}
          </label>
          <input
            type="text"
            dir="ltr"
            value={plateValue}
            onChange={handleChange}
            onPaste={handlePaste}
            placeholder={placeholder}
            maxLength={15}
            disabled={isSubmitting}
            className="p-3 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-xl font-mono tracking-wider uppercase disabled:bg-gray-100 disabled:text-gray-400"
          />
        </div>

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
          disabled={isSubmitting || !plateValue}
          className={`rounded-full p-3 font-medium text-white transition-colors flex justify-center items-center
            ${
              isSubmitting || !plateValue
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-md"
            }`}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span className="text-sm">{loadingText}</span>
            </div>
          ) : (
            <span>{submitBtnText}</span>
          )}
        </button>
      </form>
    </div>
  );
}
