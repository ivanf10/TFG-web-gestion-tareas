import { useState } from "react";
import Sidebar from "./Sidebar";

import Home from "../../pages/Home";
// (más adelante añadiré Tasks, Notes, etc)

export default function Layout() {
  const [activeView, setActiveView] = useState("inicio");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="d-flex">

      {/* SIDEBAR */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isMobileOpen={isMobileMenuOpen}
        setIsMobileOpen={setIsMobileMenuOpen}
      />

      {/* CONTENIDO */}
      <main
        className="flex-grow-1 w-100"
        style={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
        }}
      >
        {activeView === "inicio" && <Home />}
        
        {/* FUTURO */}
        {/* {activeView === "tareas" && <Tasks />} */}
        {/* {activeView === "notas" && <Notes />} */}
        {/* {activeView === "departamentos" && <Departments />} */}
      </main>

    </div>
  );
}