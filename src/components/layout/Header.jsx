import { Bell } from "lucide-react";

export default function Header({ toggleMenu, user, activeView }) {
  const isHome = activeView === "inicio";

  return (
    <div className="d-flex align-items-center justify-content-between mb-3 mb-md-5">
      
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn d-md-none"
          onClick={toggleMenu}
          style={{
            padding: "8px",
            backgroundColor: "transparent",
            border: "none",
          }}
        >
          ☰
        </button>

        {/* SOLO EN HOME */}
        {isHome && (
          <h2
            style={{
              fontSize: "clamp(18px, 5vw, 24px)",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "0",
            }}
          >
            Buenos días, {user?.name || "Usuario"}
          </h2>
        )}
      </div>

      {/* SOLO EN HOME */}
      {isHome && (
        <button className="btn" style={{ background: "transparent" }}>
          <Bell style={{ width: "20px", height: "20px", color: "#6b7280" }} />
        </button>
      )}
      
    </div>
  );
}