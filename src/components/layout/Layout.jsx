import { useState } from "react";
import Sidebar from "./Sidebar";

import Home from "../../pages/Home";
import Tasks from "../../pages/Tasks";
import Departments from "../../pages/Departments";

import { useTasks } from "../../hooks/useTasks";
import { useDepartments } from "../../hooks/useDepartments";

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

  // Hook global de departamentos
  const {
    allDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartments();

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

            editingTask={editingTask}
            showEditModal={showEditModal}

            editFormData={editFormData}
            setEditFormData={setEditFormData}

            setEditingTask={setEditingTask}
            setShowEditModal={setShowEditModal}

            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            toggleTaskStatus={toggleTaskStatus}
          />
        )}

        {/* DEPARTMENTS */}
        {activeView === "departamentos" && (
        <Departments
          allDepartments={allDepartments}
          addDepartment={addDepartment}
          updateDepartment={updateDepartment}
          deleteDepartment={deleteDepartment}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      )}
      </main>
    </div>
  );
}