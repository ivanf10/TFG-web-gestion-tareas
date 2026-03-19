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
    <div className="d-flex flex-column h-100">

      {/* HEADER */}
      <div className="p-3 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F6d96..."
            width="60"
            className="rounded-circle"
          />
          <div>
            <h1 style={{ fontSize: "18px", margin: 0 }}>OPTI TASK</h1>
            <small>Gestión</small>
          </div>
        </div>

        {closeMobile && (
          <button onClick={closeMobile}>✕</button>
        )}
      </div>

      {/* MENU */}
      <nav className="px-3">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onClick(item.key)}
            className="w-100 btn text-start mb-2"
            style={{
              background:
                activeView === item.key ? "#eff6ff" : "transparent",
              color:
                activeView === item.key ? "#2563eb" : "#4b5563",
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto p-3 border-top">
        <button className="btn w-100 text-start">
          Cuenta
        </button>
      </div>
    </div>
  );
}