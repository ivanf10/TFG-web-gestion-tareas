import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { ClipboardList } from "lucide-react";

export default function Tasks({
  allTasks,
  setIsMobileMenuOpen,
  selectedTask,
  setSelectedTask,
  toggleTaskStatus,
  editingTask,
  setEditingTask,
  editFormData,
  setEditFormData,
  setShowEditModal,
  showEditModal,
  allDepartments,
  allUsers,
  addTask,
  updateTask,
  deleteTask
}) {

  const { currentUser } = useAuth();

  const formatDate = (date) => {
    if (!date) return "Sin fecha";

    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const visibleTasks =
    currentUser?.rol === "Admin"
      ? allTasks
      : allTasks.filter(
          (task) =>
            task.assignedTo?.id === currentUser.id
        );

  // Buscador y filtros
  const [taskSearchQuery, setTaskSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Formulario de nueva tarea
  const [newTask, setNewTask] = useState({
    titulo: "",
    descripcion: "",
    departamento: "",
    fechaLimite: "",
    recordatorio: false,
    estado: "Pendiente",
    asignarA: "",
  });

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Fecha actual sin horas
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Estado real de la tarea
  const getTaskStatus = (task) => {
    if (task.completed) return "Completada";

    if (task.fechaLimite) {
      const taskDate = new Date(task.fechaLimite);
      taskDate.setHours(0, 0, 0, 0);

      if (taskDate < today) return "Atrasada";
    }

    return "Pendiente";
  };

  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  // Filtrado dinámico
  let filtered = visibleTasks.filter((task) => {
    const realStatus = getTaskStatus(task);

    const matchesSearch = (task.titulo || "")
      .toLowerCase()
      .includes(taskSearchQuery.toLowerCase());

    const matchesStatus =
      !statusFilter || realStatus === statusFilter;

    const matchesDepartment =
      !departmentFilter ||
      task.departamento?.nombre === departmentFilter;

    const matchesUser =
      !userFilter || task.assignedTo?.id === userFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDepartment &&
      matchesUser
    );
  });

  // ORDEN FECHA
  if (dateFilter === "recent") {
    filtered = [...filtered].sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt),
    );
  }

  if (dateFilter === "oldest") {
    filtered = [...filtered].sort(
      (a, b) =>
        new Date(a.createdAt) -
        new Date(b.createdAt),
    );
  }

  const filteredTasks = filtered;

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask =
    indexOfLastTask - tasksPerPage;

  const currentTasks = filteredTasks.slice(
    indexOfFirstTask,
    indexOfLastTask,
  );

  // 4. RESET AL FILTRAR
  useEffect(() => {
    setCurrentPage(1);
  }, [taskSearchQuery, statusFilter, departmentFilter, userFilter]);

  // 5. AJUSTE AL BORRAR (IMPORTANTE)
  useEffect(() => {
    if (currentPage > 1 && indexOfFirstTask >= filteredTasks.length) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [filteredTasks, currentPage, indexOfFirstTask]);

  const getUserDepartments = (userId) => {
    const user = allUsers.find((u) => u.id === userId);

    return user?.departamentos || [];
  };

  const selectedDepartments = getUserDepartments(
    currentUser?.rol === "Admin"
      ? newTask.asignarA
      : currentUser.id
  );

  useEffect(() => {
    if (!showAddTaskModal) return;

    if (
      selectedDepartments.length === 1 &&
      newTask.departamento !== selectedDepartments[0].id
    ) {
      setNewTask((prev) => ({
        ...prev,
        departamento: selectedDepartments[0].id,
      }));
    }

    if (
      selectedDepartments.length === 0 &&
      newTask.departamento !== ""
    ) {
      setNewTask((prev) => ({
        ...prev,
        departamento: "",
      }));
    }

    if (selectedDepartments.length > 1) {
      if (
        !selectedDepartments.some(
          (dept) => dept.id === newTask.departamento
        )
      ) {
        setNewTask((prev) => ({
          ...prev,
          departamento: "",
        }));
      }
    }
  }, [
    selectedDepartments.length,
    newTask.asignarA,
    newTask.departamento,
    showAddTaskModal,
  ]);

  const editSelectedDepartments =
    getUserDepartments(
      currentUser?.rol === "Admin"
        ? editFormData.asignarA
        : currentUser.id
    );

  useEffect(() => {
    if (!showEditModal) return;

    if (editSelectedDepartments.length === 1) {
      setEditFormData((prev) => ({
        ...prev,
        departamento: editSelectedDepartments[0].id,
      }));
    }

    if (editSelectedDepartments.length === 0) {
      setEditFormData((prev) => ({
        ...prev,
        departamento: "",
      }));
    }

    if (editSelectedDepartments.length > 1) {
      if (
        !editSelectedDepartments.some(
          (dept) => dept.id === editFormData.departamento
        )
      ) {
        setEditFormData((prev) => ({
          ...prev,
          departamento: "",
        }));
      }
    }
  }, [
    editSelectedDepartments.length,
    editFormData.asignarA,
    editFormData.departamento,
    showEditModal,
  ]);

  return (
    <div className="p-3 p-md-5">
      <div className="d-flex align-items-center justify-content-between mb-3 mb-md-5">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn d-md-none"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            style={{
              padding: "8px",
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Menú"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                color="#6b7280"
              />
            </svg>
          </button>

          <h2
            style={{
              fontSize: "clamp(18px, 5vw, 24px)",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "0",
            }}
          >
            Tareas
          </h2>
        </div>

        <button
          onClick={() => setShowAddTaskModal(true)}
          className="btn btn-primary"
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          + Añadir Nueva Tarea
        </button>
      </div>

      <div
        className="card rounded-2xl border-0 mb-4"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
      >
        <div className="card-body p-3 p-md-4">
          {visibleTasks.length === 0 ? (
            <div
              style={{
                minHeight: "420px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6b7280",
                  }}
                >
                  <ClipboardList size={30} strokeWidth={1.8} />
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: "6px",
                    }}
                  >
                    No hay tareas registradas
                  </h3>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: 0,
                    }}
                  >
                    Crea una nueva tarea para comenzar.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="d-flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Buscar por título de tarea"
                  className="form-control"
                  style={{
                    borderRadius: "6px",
                    borderColor: "#e5e7eb",
                    fontSize: "14px",
                  }}
                  value={taskSearchQuery}
                  onChange={(e) => setTaskSearchQuery(e.target.value)}
                />

                <select
                  className="form-select"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  style={{
                    borderRadius: "6px",
                    borderColor: "#e5e7eb",
                    fontSize: "14px",
                    maxWidth: "150px",
                  }}
                >
                  <option value="">Fecha</option>
                  <option value="recent">Recientes</option>
                  <option value="oldest">Antiguas</option>
                </select>

                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    borderRadius: "6px",
                    borderColor: "#e5e7eb",
                    fontSize: "14px",
                    maxWidth: "150px",
                  }}
                >
                  <option value="">Estado</option>
                  <option>Pendiente</option>
                  <option>Completada</option>
                  <option>Atrasada</option>
                </select>

                <select
                  className="form-select"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  style={{
                    borderRadius: "6px",
                    borderColor: "#e5e7eb",
                    fontSize: "14px",
                    maxWidth: "150px",
                  }}
                >
                  <option value="">Departamento</option>

                  {allDepartments.map((dept) => (
                    <option key={dept.id} value={dept.nombre}>
                      {dept.nombre}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select"
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  style={{
                    borderRadius: "6px",
                    borderColor: "#e5e7eb",
                    fontSize: "14px",
                    maxWidth: "150px",
                  }}
                >
                  <option value="">Usuario</option>

                  {allUsers.map((user) => {
                    const fullName = `${user.nombre} ${user.apellido}`;

                    return (
                      <option key={user.id} value={user.id}>
                        {fullName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div
                className="table-responsive"
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                <table className="table table-hover mb-0">
                  <thead>
                    <tr style={{ borderBottomColor: "#e5e7eb" }}>
                      <th
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#4b5563",
                        }}
                      >
                        Título de la Tarea
                      </th>

                      <th
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#4b5563",
                        }}
                      >
                        Departamento
                      </th>

                      <th
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#4b5563",
                        }}
                      >
                        Asignado a
                      </th>

                      <th
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#4b5563",
                        }}
                      >
                        Fecha Límite
                      </th>

                      <th
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#4b5563",
                        }}
                      >
                        Estado
                      </th>

                      <th
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#4b5563",
                        }}
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {currentTasks.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          style={{
                            padding: "60px 20px",
                            textAlign: "center",
                            borderBottom: "none",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <div
                              style={{
                                width: "56px",
                                height: "56px",
                                borderRadius: "50%",
                                backgroundColor: "#f3f4f6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#6b7280",
                              }}
                            >
                              <ClipboardList size={26} strokeWidth={1.8} />
                            </div>

                            <div>
                              <h3
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "600",
                                  color: "#111827",
                                  marginBottom: "4px",
                                }}
                              >
                                No se encontraron resultados
                              </h3>

                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#6b7280",
                                  marginBottom: 0,
                                }}
                              >
                                Prueba cambiando los filtros o el texto de búsqueda.
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentTasks.map((task) => {
                      const status = getTaskStatus(task);

                      return (
                        <tr
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          style={{
                            borderBottomColor: "#e5e7eb",
                            height: "60px",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f9fafb")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "transparent")
                          }
                        >
                          <td
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              color: "#111827",
                            }}
                          >
                            {task.titulo}
                          </td>

                          <td style={{ fontSize: "14px", color: "#4b5563" }}>
                            {task.departamento?.nombre || "Sin asignar"}
                          </td>

                          <td style={{ fontSize: "14px", color: "#4b5563" }}>
                            {task.assignedTo
                              ? `${task.assignedTo.nombre} ${task.assignedTo.apellido}`
                              : "Sin asignar"}
                          </td>

                          <td style={{ fontSize: "14px", color: "#4b5563" }}>
                            {formatDate(task.fechaLimite)}
                          </td>

                          <td style={{ fontSize: "14px" }}>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "500",
                                backgroundColor:
                                  status === "Pendiente"
                                    ? "#fef3c7"
                                    : status === "Completada"
                                    ? "#dcfce7"
                                    : "#fee2e2",
                                color:
                                  status === "Pendiente"
                                    ? "#ca8a04"
                                    : status === "Completada"
                                    ? "#15803d"
                                    : "#dc2626",
                              }}
                            >
                              ● {status}
                            </span>
                          </td>

                          <td
                            style={{
                              fontSize: "14px",
                              borderColor: "#e5e7eb",
                            }}
                          >
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTask(task);
                                setEditFormData({
                                  titulo: task.titulo,
                                  descripcion: task.descripcion,
                                  departamento: task.departamento?.id || "",
                                  fechaLimite: task.fechaLimite
                                    ? task.fechaLimite.split("T")[0]
                                    : "",

                                  asignarA: task.assignedTo?.id || "",

                                  recordatorio: task.enviarRecordatorio,
                                });
                                setShowEditModal(true);
                              }}
                              className="btn btn-sm"
                              style={{
                                padding: "4px",
                                backgroundColor: "transparent",
                                border: "none",
                                color: "#4b5563",
                              }}
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M2 17.5h4l11.5-11.5a2 2 0 00-2.828-2.828L3.172 14.672v4zM17.5 2.5l2-2"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();

                                if (
                                  window.confirm(
                                    "¿Seguro que quieres eliminar esta tarea?"
                                  )
                                ) {
                                  deleteTask(task.id);
                                }
                              }}
                              className="btn btn-sm"
                              style={{
                                padding: "4px",
                                backgroundColor: "transparent",
                                border: "none",
                                color: "#dc2626",
                              }}
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M3 6h14M8 10v4M12 10v4M4 6l1.5 10.5a2 2 0 002 1.5h5a2 2 0 002-1.5L16 6M7 6V4a1 1 0 011-1h4a1 1 0 011 1v2"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                  </tbody>
                </table>
              </div>

              <div
                className="d-flex align-items-center justify-content-between mt-3"
                style={{ fontSize: "14px", color: "#6b7280" }}
              >
                <p style={{ marginBottom: "0" }}>
                  Mostrando {indexOfFirstTask + 1} a{" "}
                  {Math.min(indexOfLastTask, filteredTasks.length)} de{" "}
                  {filteredTasks.length} resultados
                </p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "transparent",
                      border: "1px solid #e5e7eb",
                      color: currentPage === 1 ? "#d1d5db" : "#4b5563",
                      borderRadius: "6px",
                    }}
                  >
                    &lsaquo;
                  </button>

                  <button
                    className="btn btn-sm"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        indexOfLastTask < filteredTasks.length
                          ? prev + 1
                          : prev
                      )
                    }
                    disabled={indexOfLastTask >= filteredTasks.length}
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "transparent",
                      border: "1px solid #e5e7eb",
                      color:
                        indexOfLastTask >= filteredTasks.length
                          ? "#d1d5db"
                          : "#4b5563",
                      borderRadius: "6px",
                    }}
                  >
                    &rsaquo;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
        {showAddTaskModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
            onClick={() => setShowAddTaskModal(false)}
          >
            <div
              className="card rounded-3"
              style={{
                width: "90%",
                maxWidth: "600px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h2
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        marginBottom: "4px",
                        color: "#111827",
                      }}
                    >
                      Añadir Nueva Tarea
                    </h2>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        marginBottom: 0,
                      }}
                    >
                      Complete los detalles para crear una nueva asignación.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddTaskModal(false)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "24px",
                      cursor: "pointer",
                      color: "#6b7280",
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </div>

                <form>
                  <div className="mb-3">
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#111827",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Título de la tarea{" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Revisar reporte trimestral de finanzas"
                      className="form-control"
                      style={{
                        borderRadius: "6px",
                        borderColor: "#e5e7eb",
                        fontSize: "14px",
                        padding: "10px 12px",
                      }}
                      value={newTask.titulo}
                      onChange={(e) =>
                        setNewTask({ ...newTask, titulo: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#111827",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Descripción
                    </label>
                    <textarea
                      placeholder="Añade detalles, objetivos y cualquier contexto necesario..."
                      className="form-control"
                      style={{
                        borderRadius: "6px",
                        borderColor: "#e5e7eb",
                        fontSize: "14px",
                        padding: "10px 12px",
                        minHeight: "100px",
                        resize: "vertical",
                      }}
                      value={newTask.descripcion}
                      onChange={(e) =>
                        setNewTask({ ...newTask, descripcion: e.target.value })
                      }
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#111827",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        Departamento
                      </label>
                      <select
                        className="form-select"
                        style={{
                          borderRadius: "6px",
                          borderColor: "#e5e7eb",
                          fontSize: "14px",
                          padding: "10px 12px",
                        }}
                        value={newTask.departamento}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            departamento: e.target.value,
                          })
                        }
                      >
                        {selectedDepartments.length > 1 && (
                          <option value="" disabled>
                            Seleccione
                          </option>
                        )}

                        {selectedDepartments.length === 0 && (
                          <option value="">
                            Sin asignar
                          </option>
                        )}

                        {selectedDepartments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.nombre}
                          </option>
                        ))}
                      </select>

                      {currentUser?.rol === "Admin" && !newTask.asignarA && (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            marginTop: "6px",
                            marginBottom: 0,
                          }}
                        >*
                          Selecciona primero un usuario.
                        </p>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#111827",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        Fecha Límite
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        style={{
                          borderRadius: "6px",
                          borderColor: "#e5e7eb",
                          fontSize: "14px",
                          padding: "10px 12px",
                        }}
                        value={newTask.fechaLimite}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            fechaLimite: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#111827",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        Estado
                      </label>
                      <select
                        className="form-select"
                        style={{
                          borderRadius: "6px",
                          borderColor: "#e5e7eb",
                          fontSize: "14px",
                          padding: "10px 12px",
                        }}
                        value={newTask.estado}
                        onChange={(e) =>
                          setNewTask({ ...newTask, estado: e.target.value })
                        }
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Completada">Completada</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#111827",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        Asignar a
                      </label>

                      <select
                        className="form-select"
                        disabled={currentUser?.rol !== "Admin"}
                        style={{
                          borderRadius: "6px",
                          borderColor: "#e5e7eb",
                          fontSize: "14px",
                          padding: "10px 12px",
                          backgroundColor:
                            currentUser?.rol !== "Admin"
                              ? "#f3f4f6"
                              : "white",
                          cursor:
                            currentUser?.rol !== "Admin"
                              ? "not-allowed"
                              : "pointer",
                        }}
                        value={
                          currentUser?.rol === "Admin"
                            ? newTask.asignarA
                            : currentUser.id
                        }
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            asignarA: e.target.value,
                          })
                        }
                      >
                        <option value="">Seleccionar usuario...</option>

                        {allUsers.map((user) => {
                          const fullName = `${user.nombre} ${user.apellido}`;

                          return (
                            <option key={user.id} value={user.id}>
                              {fullName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px",
                        backgroundColor: "#f9fafb",
                        borderRadius: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        id="recordatorio"
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                          accentColor: "#3f63eb",
                        }}
                        checked={newTask.recordatorio}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            recordatorio: e.target.checked,
                          })
                        }
                      />
                      <label
                        htmlFor="recordatorio"
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#111827",
                          cursor: "pointer",
                          marginBottom: 0,
                        }}
                      >
                        Enviar recordatorio
                      </label>
                    </div>
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <button
                      type="button"
                      onClick={() => setShowAddTaskModal(false)}
                      className="btn"
                      style={{
                        padding: "10px 24px",
                        fontSize: "14px",
                        fontWeight: "500",
                        backgroundColor: "#f3f4f6",
                        color: "#111827",
                        border: "none",
                        borderRadius: "6px",
                      }}
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!newTask.titulo) return;

                        if (
                          selectedDepartments.length > 1 &&
                          !newTask.departamento
                        ) {
                          return;
                        }

                        addTask({
                          titulo: newTask.titulo,

                          descripcion: newTask.descripcion,

                          estado: newTask.estado,

                          fechaLimite: newTask.fechaLimite,

                          enviarRecordatorio: newTask.recordatorio,

                          recordatorioActivo: newTask.recordatorio,

                          completed: newTask.estado === "Completada",

                          departamentoId: newTask.departamento || null,

                          assignedToId:
                            currentUser?.rol === "Admin"
                              ? String(newTask.asignarA)
                              : String(currentUser.id),

                          createdById: String(currentUser.id),
                        });

                        setShowAddTaskModal(false);

                        setNewTask({
                          titulo: "",
                          descripcion: "",
                          departamento: "",
                          fechaLimite: "",
                          recordatorio: false,
                          estado: "Pendiente",
                          asignarA: "",
                        });
                      }}
                      className="btn btn-primary"
                      style={{
                        padding: "10px 24px",
                        fontSize: "14px",
                        fontWeight: "500",
                      }}
                    >
                      Registrar Tarea
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {/* Task Detail Modal */}
          {selectedTask && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
              }}
              onClick={() => setSelectedTask(null)}
            >
              <div
                className="card rounded-3"
                style={{
                  width: "90%",
                  maxWidth: "650px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="card-body p-4">
                  {/* HEADER */}
                  <div className="d-flex align-items-start justify-content-between mb-4">
                    <div style={{ flex: 1 }}>
                      <h2
                        style={{
                          fontSize: "22px",
                          fontWeight: "700",
                          marginBottom: "4px",
                          color: "#111827",
                        }}
                      >
                        {selectedTask.titulo}
                      </h2>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                          marginBottom: 0,
                        }}
                      >
                        ID: {String(selectedTask.id).padStart(4, "0")} ·{" "}
                        <span style={{ color: "#3f63eb" }}>
                          Detalles de la tarea
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedTask(null)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "24px",
                        cursor: "pointer",
                        color: "#6b7280",
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>

                  {/* STATUS + DEPARTAMENTO */}
                  <div
                    className="mb-4"
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    {(() => {
                      const status = getTaskStatus(selectedTask);

                      const bg =
                        status === "Pendiente"
                          ? "#fef3c7"
                          : status === "Completada"
                          ? "#dcfce7"
                          : "#fee2e2";

                      const color =
                        status === "Pendiente"
                          ? "#ca8a04"
                          : status === "Completada"
                          ? "#15803d"
                          : "#dc2626";

                      return (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor: bg,
                            color: color,
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>●</span>
                          {status}
                        </span>
                      );
                    })()}

                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "500",
                        backgroundColor: "#e0e7ff",
                        color: "#4f46e5",
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>●</span>
                      {selectedTask.departamento?.nombre || "Sin asignar"}
                    </span>
                  </div>

                  {/* DESCRIPCIÓN */}
                  <div className="mb-4">
                    <h3
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#4b5563",
                        textTransform: "uppercase",
                        marginBottom: "12px",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Descripción Detallada
                    </h3>

                    <div
                      style={{
                        backgroundColor: "#f9fafb",
                        padding: "16px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        color: "#4b5563",
                        lineHeight: "1.6",
                      }}
                    >
                      <p style={{ marginBottom: "12px" }}>
                        {selectedTask.descripcion || "Sin descripción"}
                      </p>
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <h3
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#4b5563",
                          textTransform: "uppercase",
                          marginBottom: "12px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Asignado a
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#e5e7eb",
                            color: "#4b5563",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            fontWeight: "700",
                            flexShrink: 0,
                          }}
                        >
                          {selectedTask.assignedTo?.nombre?.charAt(0)?.toUpperCase()}
                        </div>

                        <div>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#111827",
                              marginBottom: "2px",
                            }}
                          >
                            {selectedTask.assignedTo
                              ? `${selectedTask.assignedTo.nombre} ${selectedTask.assignedTo.apellido}`
                              : "Sin asignar"}
                          </p>

                          <p
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                              marginBottom: 0,
                            }}
                          >
                            {selectedTask.assignedTo?.rol || "Usuario"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="col-6">
                      <h3
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#4b5563",
                          textTransform: "uppercase",
                          marginBottom: "12px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Creado por
                      </h3>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: "#e5e7eb",
                            color: "#4b5563",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                            fontWeight: "700",
                            flexShrink: 0,
                          }}
                        >
                          {(selectedTask.createdBy?.nombre || "S")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#111827",
                              marginBottom: "2px",
                            }}
                          >
                            {selectedTask.createdBy
                              ? `${selectedTask.createdBy.nombre} ${selectedTask.createdBy.apellido}`
                              : "Sin especificar"}
                          </p>

                          <p
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                              marginBottom: 0,
                            }}
                          >
                            {selectedTask.createdBy?.rol || "Usuario"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FECHAS */}
                  <div className="row g-3 mb-4">
                    <div className="col-6">
                      <h3
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#4b5563",
                          textTransform: "uppercase",
                          marginBottom: "8px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Fecha Límite
                      </h3>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#111827",
                          marginBottom: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>📅</span>
                        {formatDate(selectedTask.fechaLimite)}
                      </p>
                    </div>

                    <div className="col-6">
                      <h3
                        style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: "#4b5563",
                          textTransform: "uppercase",
                          marginBottom: "8px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        Fecha Creación
                      </h3>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#111827",
                          marginBottom: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>🕒</span>
                        {formatDateTime(selectedTask.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  {/* RECORDATORIO */}
                  <div className="mb-4">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "12px",
                        backgroundColor: "#f9fafb",
                        borderRadius: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        id="recordatorio_detalle"
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "not-allowed",
                          accentColor: "#3f63eb",
                        }}
                        checked={selectedTask.enviarRecordatorio || false}
                        disabled
                      />
                      <label
                        htmlFor="recordatorio_detalle"
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#111827",
                          marginBottom: 0,
                        }}
                      >
                        Enviar recordatorio
                      </label>
                    </div>
                  </div>

                  {/* ACCIONES */}
                  <div
                    style={{
                      borderTop: "1px solid #e5e7eb",
                      paddingTop: "16px",
                      display: "flex",
                      gap: "12px",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        if (window.confirm("¿Seguro que quieres eliminar esta tarea?")) {
                          deleteTask(selectedTask.id);
                          setSelectedTask(null); 
                        }
                      }}
                      style={{
                        padding: "10px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        backgroundColor: "transparent",
                        color: "#dc2626",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 6h14M8 10v4M12 10v4M4 6l1.5 10.5a2 2 0 002 1.5h5a2 2 0 002-1.5L16 6M7 6V4a1 1 0 011-1h4a1 1 0 011 1v2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Eliminar
                    </button>

                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        onClick={() => {
                          setEditingTask(selectedTask);
                          setEditFormData({
                            titulo: selectedTask.titulo,

                            descripcion: selectedTask.descripcion,

                            departamento:
                              selectedTask.departamento?.id || "",

                            fechaLimite:
                              selectedTask.fechaLimite
                                ? selectedTask.fechaLimite.split("T")[0]
                                : "",

                            estado:
                              selectedTask.completed
                                ? "Completada"
                                : "Pendiente",

                            asignarA:
                              selectedTask.assignedTo?.id || "",

                            recordatorio:
                              selectedTask.enviarRecordatorio,
                          });
                          setShowEditModal(true);
                          setSelectedTask(null);
                        }}
                        style={{
                          padding: "10px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          backgroundColor: "#f3f4f6",
                          color: "#4b5563",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                         <svg
                          width="18"
                          height="18"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 17.5h4l11.5-11.5a2 2 0 00-2.828-2.828L3.172 14.672v4zM17.5 2.5l2-2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Editar
                      </button>

                      <button
                        onClick={() => {
                          toggleTaskStatus(selectedTask);
                          setSelectedTask(null);
                        }}
                         style={{
                          padding: "10px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          backgroundColor: "#2563eb",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                         <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6 10l2.5 2.5 5-5"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {selectedTask.completed
                          ? "Marcar Pendiente"
                          : "Marcar Completada"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Edit Task Modal */}
          {showEditModal && editingTask && (
            <div
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
              }}
              onClick={() => setShowEditModal(false)}
            >
              <div
                className="card rounded-3"
                style={{
                  width: "90%",
                  maxWidth: "600px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="card-body p-4">
                  {/* HEADER */}
                  <div className="d-flex align-items-start justify-content-between mb-4">
                    <div style={{ flex: 1 }}>
                      <h2
                        style={{
                          fontSize: "22px",
                          fontWeight: "700",
                          marginBottom: "4px",
                          color: "#111827",
                        }}
                      >
                        {editingTask.titulo}
                      </h2>
                      <p
                        style={{
                          fontSize: "13px",
                          color: "#6b7280",
                          marginBottom: 0,
                        }}
                      >
                        ID: {String(editingTask.id).padStart(4, "0")} ·{" "}
                        <span style={{ color: "#3f63eb" }}>Editar Tarea</span>
                      </p>
                    </div>

                    <button
                      onClick={() => setShowEditModal(false)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "24px",
                        cursor: "pointer",
                        color: "#6b7280",
                        padding: 0,
                      }}
                    >
                      ×
                    </button>
                  </div>

                  <form>
                    {/* TITULO */}
                    <div className="mb-3">
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#111827",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        Título de la tarea <span style={{ color: "#ef4444" }}>*</span>
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        style={{
                          borderRadius: "6px",
                          borderColor: "#e5e7eb",
                          fontSize: "14px",
                          padding: "10px 12px",
                        }}
                        value={editFormData.titulo}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            titulo: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* DESCRIPCION */}
                    <div className="mb-3">
                      <label
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#111827",
                          display: "block",
                          marginBottom: "8px",
                        }}
                      >
                        Descripción
                      </label>

                      <textarea
                        className="form-control"
                        style={{
                          borderRadius: "6px",
                          borderColor: "#e5e7eb",
                          fontSize: "14px",
                          padding: "10px 12px",
                          minHeight: "100px",
                          resize: "vertical",
                        }}
                        value={editFormData.descripcion}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            descripcion: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* ROW 1 */}
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                          Departamento
                        </label>

                        <select
                          className="form-select"
                          style={{
                            borderRadius: "6px",
                            borderColor: "#e5e7eb",
                            fontSize: "14px",
                            padding: "10px 12px",
                          }}
                          value={editFormData.departamento}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              departamento: e.target.value,
                            })
                          }
                        >
                          {editSelectedDepartments.length > 1 && (
                            <option value="" disabled>
                              Seleccione
                            </option>
                          )}

                          {editSelectedDepartments.length === 0 && (
                            <option value="">
                              Sin asignar
                            </option>
                          )}

                          {allDepartments
                            .filter((dept) =>
                              editSelectedDepartments.some((selectedDept) => selectedDept.id === dept.id)
                            )
                            .map((dept) => (
                              <option key={dept.id} value={dept.id}>
                                {dept.nombre}
                              </option>
                          ))}
                        </select>

                        {currentUser?.rol === "Admin" && !editFormData.asignarA && (
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#6b7280",
                              marginTop: "6px",
                              marginBottom: 0,
                            }}
                          >*
                            Selecciona primero un usuario.
                          </p>
                        )}
                      </div>

                      <div className="col-md-6">
                        <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                          Fecha Límite
                        </label>

                        <input
                          type="date"
                          className="form-control"
                          style={{
                            borderRadius: "6px",
                            borderColor: "#e5e7eb",
                            fontSize: "14px",
                            padding: "10px 12px",
                          }}
                          value={editFormData.fechaLimite}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              fechaLimite: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* ROW 2 */}
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                          Estado
                        </label>

                        <select
                          className="form-select"
                          style={{
                            borderRadius: "6px",
                            borderColor: "#e5e7eb",
                            fontSize: "14px",
                            padding: "10px 12px",
                          }}
                          value={editFormData.estado}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              estado: e.target.value,
                            })
                          }
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Completada">Completada</option>
                        </select>
                        </div>

                        <div className="col-md-6">
                          <label
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              marginBottom: "8px",
                            }}
                          >
                            Asignar a
                          </label>

                          <select
                            className="form-select"
                            disabled={currentUser?.rol !== "Admin"}
                            style={{
                              borderRadius: "6px",
                              borderColor: "#e5e7eb",
                              fontSize: "14px",
                              padding: "10px 12px",
                              backgroundColor:
                                currentUser?.rol !== "Admin"
                                  ? "#f3f4f6"
                                  : "white",
                              cursor:
                                currentUser?.rol !== "Admin"
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                            value={
                              currentUser?.rol === "Admin"
                                ? editFormData.asignarA
                                : currentUser.id
                            }
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                asignarA: e.target.value,
                              })
                            }
                          >
                            <option value="">Seleccionar usuario...</option>

                            {allUsers.map((user) => {
                              const fullName = `${user.nombre} ${user.apellido}`;

                              return (
                                <option key={user.id} value={user.id}>
                                  {fullName}
                                </option>
                              );
                            })}
                          </select>
                      </div>
                    </div>

                    {/* RECORDATORIO */}
                    <div className="mb-4">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          padding: "12px",
                          backgroundColor: "#f9fafb",
                          borderRadius: "6px",
                        }}
                      >
                        <input
                          type="checkbox"
                          id="recordatorio_edit"
                          style={{
                            width: "18px",
                            height: "18px",
                            cursor: "pointer",
                            accentColor: "#3f63eb",
                          }}
                          checked={editFormData.recordatorio || false}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              recordatorio: e.target.checked,
                            })
                          }
                        />
                        <label
                          htmlFor="recordatorio_edit"
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#111827",
                            cursor: "pointer",
                            marginBottom: 0,
                          }}
                        >
                          Enviar recordatorio
                        </label>
                      </div>
                    </div>

                    {/* BOTONES */}
                    <div
                      style={{
                        borderTop: "1px solid #e5e7eb",
                        paddingTop: "16px",
                        display: "flex",
                        gap: "12px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => setShowEditModal(false)}
                        style={{
                          padding: "10px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          backgroundColor: "#f3f4f6",
                          color: "#4b5563",
                          border: "none",
                          borderRadius: "6px",
                        }}
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (
                            editSelectedDepartments.length > 1 &&
                            !editFormData.departamento
                          ) {
                            return;
                          }
                          updateTask({
                            id: editingTask.id,

                            titulo: editFormData.titulo,

                            descripcion: editFormData.descripcion,

                            estado: editFormData.estado,

                            fechaLimite: editFormData.fechaLimite,

                            enviarRecordatorio:
                              editFormData.recordatorio,

                            recordatorioActivo:
                              editFormData.recordatorio,  

                            completed:
                              editFormData.estado === "Completada",

                            departamentoId:
                              editFormData.departamento || null,

                            assignedToId:
                              currentUser?.rol === "Admin"
                                ? String(editFormData.asignarA)
                                : String(currentUser.id),
                          });

                          setShowEditModal(false);
                          setSelectedTask(null);
                          setEditingTask(null);
                        }}
                        style={{
                          padding: "10px 16px",
                          fontSize: "14px",
                          fontWeight: "500",
                          backgroundColor: "#2563eb",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                        }}
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
    </div>
  );
}