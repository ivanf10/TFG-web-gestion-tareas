import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

import Home from "../../pages/Home";
import Tasks from "../../pages/Tasks";
import Departments from "../../pages/Departments";
import Notes from "../../pages/Notes";
import Users from "../../pages/Users";
import Account from "../../pages/Account";

import { useTasks } from "../../hooks/useTasks";
import { useDepartments } from "../../hooks/useDepartments";
import { useNotes } from "../../hooks/useNotes";
import { useUsers } from "../../hooks/useUsers";

export default function Layout() {
  const [activeView, setActiveView] = useState("inicio");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // TASKS
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
    fetchDepartments,
  } = useDepartments();

  // TASK UI
  const [selectedTask, setSelectedTask] = useState(null);
  const todayString = new Date().toDateString();

  const [notificationReadIds, setNotificationReadIds] =
    useState(() => {
      const savedDate =
        localStorage.getItem(
          "notificationResetDate"
        );

      const savedRead =
        localStorage.getItem(
          "notificationReadIds"
        );

      if (savedDate !== todayString) {
        localStorage.setItem(
          "notificationResetDate",
          todayString
        );

        localStorage.setItem(
          "notificationReadIds",
          JSON.stringify([])
        );

        return [];
      }

      return savedRead
        ? JSON.parse(savedRead)
        : [];
    });

  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const markNotificationAsRead = (taskId) => {
    setNotificationReadIds((prev) =>
      prev.includes(taskId)
        ? prev
        : [...prev, taskId]
    );
  };

  const markNotificationAsUnread = (taskId) => {
    setNotificationReadIds((prev) =>
      prev.filter((id) => id !== taskId)
    );
  };

  const markAllNotifications = (
    notifications,
    markAsRead
  ) => {
    if (markAsRead) {
      setNotificationReadIds(
        notifications.map((task) => task.id)
      );
    } else {
      setNotificationReadIds([]);
    }
  };

  useEffect(() => {
    localStorage.setItem(
      "notificationReadIds",
      JSON.stringify(notificationReadIds)
    );
  }, [notificationReadIds]);

  const [editFormData, setEditFormData] = useState({
    titulo: "",
    descripcion: "",
    departamentos: "",
    fechaLimite: "",
    estado: "",
    asignarA: "",
  });

  // NOTES
  const {
    allNotes,
    addNote,
    updateNote,
    deleteNote,
  } = useNotes();

  // UI NOTES
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const [selectedNoteForDetail, setSelectedNoteForDetail] = useState(null);
  const [showNoteDetailModal, setShowNoteDetailModal] = useState(false);

  const [editNoteFormData, setEditNoteFormData] = useState({
    titulo: "",
    contenido: "",
    audioUrl: "",
    imageUrl: "",
  });

  const {
    allUsers,
    addUser,
    updateUser,
    deleteUser,
    fetchUsers,
  } = useUsers();

  // UI USERS
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectedUserForDetail, setSelectedUserForDetail] =useState(null);
  const [showUserDetailModal, setShowUserDetailModal] = useState(false);

  const [editUserFormData, setEditUserFormData] =
    useState({
      nombre: "",
      apellido: "",
      email: "",
      departamentos: "",
      rol: "",
    });

  // RENDER
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

            toggleTaskStatus={toggleTaskStatus}

            notificationReadIds={notificationReadIds}

            markNotificationAsRead={
              markNotificationAsRead
            }

            markNotificationAsUnread={
              markNotificationAsUnread
            }

            markAllNotifications={
              markAllNotifications
            }

            setActiveView={setActiveView}
            setSelectedTask={setSelectedTask}
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

            allDepartments={allDepartments}
            allUsers={allUsers}

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
            allUsers={allUsers}
            addDepartment={addDepartment}
            updateDepartment={updateDepartment}
            deleteDepartment={deleteDepartment}
            fetchUsers={fetchUsers}
            fetchDepartments={fetchDepartments}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        )}

        {/* NOTES */}
        {activeView === "notas" && (
          <Notes
            allNotes={allNotes}

            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}

            showAddNoteModal={showAddNoteModal}
            setShowAddNoteModal={setShowAddNoteModal}

            editingNote={editingNote}
            setEditingNote={setEditingNote}

            showEditNoteModal={showEditNoteModal}
            setShowEditNoteModal={setShowEditNoteModal}

            selectedNoteForDetail={selectedNoteForDetail}
            setSelectedNoteForDetail={setSelectedNoteForDetail}

            showNoteDetailModal={showNoteDetailModal}
            setShowNoteDetailModal={setShowNoteDetailModal}

            editNoteFormData={editNoteFormData}
            setEditNoteFormData={setEditNoteFormData}

            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        )}

        {/* USERS */}
        {activeView === "usuarios" && (
          <Users
            allUsers={allUsers}

            addUser={addUser}
            updateUser={updateUser}
            deleteUser={deleteUser}

            allDepartments={allDepartments}

            showAddUserModal={showAddUserModal}
            setShowAddUserModal={setShowAddUserModal}

            editingUser={editingUser}
            setEditingUser={setEditingUser}

            showEditUserModal={showEditUserModal}
            setShowEditUserModal={setShowEditUserModal}

            selectedUserForDetail={selectedUserForDetail}
            setSelectedUserForDetail={setSelectedUserForDetail}

            showUserDetailModal={showUserDetailModal}
            setShowUserDetailModal={setShowUserDetailModal}

            editUserFormData={editUserFormData}
            setEditUserFormData={setEditUserFormData}

            fetchDepartments={fetchDepartments}

            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        )}

        {/* ACCOUNT */}
        {activeView === "cuenta" && (
          <Account
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            allDepartments={allDepartments}
          />
        )}
      </main>
    </div>
  );
}