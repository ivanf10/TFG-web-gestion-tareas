export default function SidebarContent({
  activeView,
  onClick,
  closeMobile,
}) {
  const menuItems = [
    { key: "inicio", label: "Inicio" },
    { key: "tareas", label: "Tareas" },
    { key: "notas", label: "Notas" },
    { key: "departamentos", label: "Departamentos" },
  ];

  return (
    <div
      className="bg-white border-end d-flex flex-column"
      style={{
        width: "300px",
        minWidth: "300px",
        height: "100vh",
        borderColor: "#e5e7eb",
      }}
    >
      {/* HEADER */}
      <div className="p-3">
        <div className="d-flex align-items-center justify-content-center gap-2">
          <img
            src="/logo.png"
            alt="OPTI TASK Logo"
            style={{ width: "80px", height: "80px" }}
            className="rounded-full"
          />
          <div>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: "700",
                marginBottom: "2px",
                fontFamily: "Dela Gothic One",
                whiteSpace: "nowrap",
              }}
            >
              OPTI TASK
            </h1>
            <p
              style={{
                fontSize: "18px",
                color: "#6b7280",
                marginBottom: "0",
                textAlign: "center",
              }}
            >
              Gestión de Tareas
            </p>
          </div>
        </div>
      </div>

      {/* MENU */}
      <nav className="px-3">
        <button
          onClick={() => {
            onClick("inicio");
            closeMobile?.();
          }}
          className="w-100 btn text-start d-flex align-items-center gap-2 mb-2"
          style={{
            backgroundColor:
              activeView === "inicio" ? "#eff6ff" : "transparent",
            color: activeView === "inicio" ? "#2563eb" : "#4b5563",
            fontWeight: "500",
            fontSize: "15px",
            padding: "10px 12px",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 7L10 3L17 7M3 7L10 11M3 7V13L10 17M17 7L10 11M17 7V13L10 17M10 11V17"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Inicio
        </button>

        <button
          onClick={() => {
            onClick("tareas");
            closeMobile?.();
          }}
          className="w-100 btn text-start d-flex align-items-center gap-2 mb-2"
          style={{
            color: activeView === "tareas" ? "#2563eb" : "#4b5563",
            fontWeight: "500",
            fontSize: "15px",
            backgroundColor:
              activeView === "tareas" ? "#eff6ff" : "transparent",
            border: "none",
            padding: "10px 12px",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <rect
              x="3"
              y="3"
              width="14"
              height="14"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M7 10h6M7 7h6M7 13h4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Tareas
        </button>

        <button
          onClick={() => {
            onClick("notas");
            closeMobile?.();
          }}
          className="w-100 btn text-start d-flex align-items-center gap-2 mb-2"
          style={{
            color: activeView === "notas" ? "#2563eb" : "#4b5563",
            fontWeight: "500",
            fontSize: "15px",
            backgroundColor:
              activeView === "notas" ? "#eff6ff" : "transparent",
            border: "none",
            padding: "10px 12px",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 6h12M4 10h12M4 14h12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Notas
        </button>

        <button
          onClick={() => {
            onClick("departamentos");
            closeMobile?.();
          }}
          className="w-100 btn text-start d-flex align-items-center gap-2 mb-2"
          style={{
            color: activeView === "departamentos" ? "#2563eb" : "#4b5563",
            fontWeight: "500",
            fontSize: "15px",
            backgroundColor:
              activeView === "departamentos" ? "#eff6ff" : "transparent",
            border: "none",
            padding: "10px 12px",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <rect
              x="3"
              y="5"
              width="14"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M7 3v4M13 3v4M3 9h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Departamentos
        </button>
      </nav>

      <div
        className="px-3 mt-auto border-top border-1"
        style={{ borderColor: "#e5e7eb" }}
      >
        <button
          className="w-100 btn text-start d-flex align-items-center gap-2"
          style={{
            color: "#4b5563",
            fontWeight: "500",
            fontSize: "15px",
            backgroundColor: "transparent",
            border: "none",
            padding: "10px 12px",
            margin: "16px 0",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M4 17c0-2.5 2.5-5 6-5s6 2.5 6 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Cuenta
        </button>
      </div>
    </div>
  );
}