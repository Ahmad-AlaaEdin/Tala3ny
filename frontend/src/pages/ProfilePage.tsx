import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  User,
  Star,
  Car,
  Ellipsis,
  Plus,
  Bell,
  Lock,
  LogOut,
} from "lucide-react";

// A reusable Switch Toggle component for the settings
const SwitchToggle = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) => {
  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 shrink cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
        enabled ? "bg-blue-600" : "bg-gray-300"
      }`}
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "-translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

const ProfilePage = () => {
  const { user, logout } = useAuth();

  // State to manage car (simulating a single car as requested)
  // We'll start with a car to match the UI. Set to `null` to see the "Add Car" button.
  const [car, setCar] = useState<string | null>(null);

  // State for settings toggles
  const [parkingNotifications, setParkingNotifications] = useState(true);
  const [hideNumber, setHideNumber] = useState(false);

  // Function to simulate adding a car
  const handleAddCar = () => {
    // In a real app, this would open a modal/form
    // For now, we just set a car plate
    setCar("أ ج ه ٦٧٨٩");
  };

  // Function to simulate the kebab menu
  const handleCarMenuClick = () => {
    // In a real app, this would open options like "Edit" or "Delete"
    // Deleting would call setCar(null)
    console.log("Car menu clicked");
  };

  return (
    // Page container to center the card
    <div className="flex min-h-screen w-full items-start justify-center bg-gray-100 p-4 pt-10 font-sans">
      <div
        dir="rtl"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
      >
        {/* === Header Section === */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              أهلاً يا {user?.displayName || "زائر"}
            </h1>
            <p className="text-sm text-gray-500">مرحباً بك في ملفك الشخصي</p>
          </div>
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
              {/* You can replace this with an <img> tag if user.photoURL exists */}
              <User className="h-10 w-10 text-orange-400" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-yellow-400">
              <Star className="h-4 w-4 text-white" fill="white" />
            </span>
          </div>
        </header>

        <hr className="my-6" />

        {/* === Cars Section === */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">
            سياراتي المسجلة
          </h2>

          {/* Conditional logic based on "user can add one car" */}
          {car ? (
            // If car exists, show it
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-2">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-lg font-medium text-gray-800 tracking-widest">
                  {car}
                </span>
              </div>
              <button
                onClick={handleCarMenuClick}
                className="text-gray-500 hover:text-gray-800"
              >
                <Ellipsis className="h-6 w-6" />
              </button>
            </div>
          ) : (
            // If no car, show "Add Car" button
            <button
              onClick={handleAddCar}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-50 py-3 px-4 font-medium text-blue-600 transition-colors hover:bg-blue-100"
            >
              <Plus className="h-5 w-5" />
              <span>إضافة سيارة</span>
            </button>
          )}
          {/* Note: The UI shows another car, but we follow the "one car" rule.
              If you needed multiple cars, you would map over an array of cars here. */}
        </section>

        {/* === Settings Section === */}
        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">الإعدادات</h2>

          {/* Setting 1: Parking Notifications */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-100 p-2">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-gray-700">استقبال إشعارات الركن</span>
            </div>
            <SwitchToggle
              enabled={parkingNotifications}
              onChange={setParkingNotifications}
            />
          </div>

          {/* Setting 2: Hide Number */}
          <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-yellow-100 p-2">
                <Lock className="h-6 w-6 text-yellow-600" />
              </div>
              <span className="text-gray-700">إخفاء الرقم الشخصي</span>
            </div>
            <SwitchToggle enabled={hideNumber} onChange={setHideNumber} />
          </div>
        </section>

        {/* === Logout Button === */}
        <footer className="mt-8">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-red-500 py-3 px-4 font-bold text-white transition-colors hover:bg-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>تسجيل خروج</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ProfilePage;
