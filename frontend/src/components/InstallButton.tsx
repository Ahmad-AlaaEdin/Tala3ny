import { usePWAInstall } from "../hooks/usePWAInstall";

export default function InstallButton() {
  const { canInstall, installApp, isInstalled } = usePWAInstall();

  if (isInstalled) return <p>✅ Installed!</p>;

  return (
    canInstall && (
      <button
        onClick={installApp}
        style={{
          backgroundColor: "#007BFF",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        🚗 Install "طلّعني"
      </button>
    )
  );
}
