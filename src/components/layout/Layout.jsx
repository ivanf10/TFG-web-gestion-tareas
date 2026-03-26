import { useState } from "react";
import Sidebar from "./Sidebar";

import Home from "../../pages/Home";
import Tasks from "../../pages/Tasks";

import { useTasks } from "../../hooks/useTasks";

export default function Layout() {
  const [activeView, setActiveView] = useState("inicio");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hook global de tareas
  const {
    allTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  } = useTasks();

  // Estados UI (modales y selección)
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [editFormData, setEditFormData] = useState({
    titulo: "",
    descripcion: "",
    departamento: "",
    fechaLimite: "",
    estado: "",
    asignarA: "",
  });

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
        {/* HOME */}
        {activeView === "inicio" && (
          <Home
            allTasks={allTasks || []}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        )}

        {/* TASKS */}
        {activeView === "tareas" && (
          <Tasks
            allTasks={allTasks || []}
            setIsMobileMenuOpen={setIsMobileMenuOpen}

            selectedTask={selectedTask} 
            setSelectedTask={setSelectedTask}

            setShowAddTaskModal={setShowAddTaskModal}
            setEditingTask={setEditingTask}
            setEditFormData={setEditFormData}
            setShowEditModal={setShowEditModal}

            // acciones
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            toggleTaskStatus={toggleTaskStatus}
          />
        )}

        {/* FUTURO */}
        {/* {activeView === "notas" && <Notes />} */}
        {/* {activeView === "departamentos" && <Departments />} */}
      </main>
    </div>
  );
}