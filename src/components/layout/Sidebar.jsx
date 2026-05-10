import React from "react";
import SidebarContent from "./SidebarContent";
import { useAuth } from "../../hooks/useAuth";

export default function Sidebar({
  activeView,
  setActiveView,
  isMobileOpen,
  setIsMobileOpen,
}) {

  const { currentUser } = useAuth();

  const menuItems = [
    { key: "inicio", label: "Inicio" },
    { key: "tareas", label: "Tareas" },
    { key: "notas", label: "Notas" },
    { key: "departamentos", label: "Departamentos" },
    { key: "usuarios", label: "Usuarios" },
    { key: "cuenta", label: "Mi Cuenta" },
  ];

  const handleClick = (view) => {
    setActiveView(view);
    setIsMobileOpen(false); // cerrar en móvil
  };

  return (
    <>
      {/* Sidebar Desktop */}
      <aside
        className="bg-white border-end d-none d-md-flex flex-column"
        style={{ width: "300px", height: "100vh" }}
      >
        <SidebarContent
          activeView={activeView}
          onClick={handleClick}
        />
      </aside>

      {/* Sidebar Mobile */}
      <aside
        className="bg-white d-md-none position-fixed"
        style={{
          width: "300px",
          height: "100vh",
          left: 0,
          top: 0,
          zIndex: 1000,
          transform: isMobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "0.3s",
        }}
      >
        <SidebarContent
          activeView={activeView}
          onClick={handleClick}
          closeMobile={() => setIsMobileOpen(false)}
        />
      </aside>
    </>
  );
}