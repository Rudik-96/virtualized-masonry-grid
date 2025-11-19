import { useState, useEffect } from "react";

const styles = {
  container: {
    position: "fixed" as const,
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#ff6b6b",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "14px",
    fontWeight: 500,
    zIndex: 2000,
    animation: "slideUp 0.3s ease-out",
  },
  icon: {
    fontSize: "20px",
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
  @media (max-width: 768px) {
    .offline-indicator-responsive {
      bottom: 10px !important;
      left: 10px !important;
      right: 10px !important;
      transform: none !important;
    }
  }
`;
if (!document.querySelector("#offline-indicator-styles")) {
  styleSheet.id = "offline-indicator-styles";
  document.head.appendChild(styleSheet);
}

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      className="offline-indicator-responsive"
      style={styles.container}
      role="alert"
      aria-live="polite"
    >
      <span style={styles.icon}>📡</span>
      <span>You're offline. Some features may be limited.</span>
    </div>
  );
}