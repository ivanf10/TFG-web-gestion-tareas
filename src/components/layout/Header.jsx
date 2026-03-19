import { Bell } from "lucide-react";

export default function Header({ toggleMenu }) {
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

        <h2
          style={{
            fontSize: "clamp(18px, 5vw, 24px)",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "0",
          }}
        >
          Buenos días, Ivan
        </h2>
      </div>

      <button className="btn" style={{ background: "transparent" }}>
        <Bell style={{ width: "20px", height: "20px", color: "#6b7280" }} />
      </button>
    </div>
  );
}