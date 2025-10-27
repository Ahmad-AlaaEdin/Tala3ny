import { useState, useRef, useEffect } from "react";

interface Section {
  type: "letter" | "number";
  length?: number; // optional max length for the section
}

interface CarPlateInputProps {
  sections: Section[]; // e.g., [{type:'letter'}, {type:'number', length:4}]
  onComplete?: (plate: string) => void;
}

const CarPlateInput = ({ sections, onComplete }: CarPlateInputProps) => {
  const [values, setValues] = useState<string[]>(sections.map(() => ""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    const section = sections[index];
    let regex = section.type === "letter" ? /^[A-Za-z]*$/ : /^[0-9]*$/;

    if (!regex.test(value)) return;
    if (section.length && value.length > section.length) return;

    const newValues = [...values];
    newValues[index] = value.toUpperCase();
    setValues(newValues);

    if (!newValues.includes("") && onComplete) {
      onComplete(newValues.join("-")); // join sections with dash
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-center items-center">
      {sections.map((section, i) => (
        <div key={i} className="flex items-center gap-1">
          <input
            ref={(el) => (inputs.current[i] = el)}
            type="text"
            value={values[i]}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            maxLength={section.length}
            className="w-20 h-14 text-center text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
          />
          {i < sections.length - 1 && (
            <span className="text-xl font-bold">-</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CarPlateInput;
