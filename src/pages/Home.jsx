import { useAppState } from "../hooks/useAppState";
import Header from "../components/layout/Header";
import { useAuth } from "../hooks/useAuth";

export default function Home({
  allTasks = [],
  setIsMobileMenuOpen,
  toggleTaskStatus,

  notificationReadIds,
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotifications,

  setActiveView,
  setSelectedTask,
}) {
  const {
    selectedDate,
    setSelectedDate,
    currentMonth,
    calendarDays,
    weekDays,
    prevMonth,
    nextMonth,
  } = useAppState();

  const { currentUser } = useAuth();

  const visibleTasks =
  currentUser?.rol === "Admin"
    ? allTasks
    : allTasks.filter(
        (task) =>
          task.assignedTo?.id === currentUser.id
      );

  // Tareas del día seleccionado
  const tasks = visibleTasks.filter((task) => {
    if (!task.fechaLimite) return false;

    const taskDate = new Date(task.fechaLimite);

    return (
      taskDate.toDateString() ===
      selectedDate.toDateString()
    );
  });

  // Fecha de hoy (sin horas)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Tareas atrasadas (lógica correcta)
  const lateTasksCount = visibleTasks.filter((t) => {
    if (t.completed) return false;

    if (!t.fechaLimite) return false;

    const taskDate = new Date(t.fechaLimite);
    taskDate.setHours(0, 0, 0, 0);

    return taskDate < today;
  }).length;

  // Notificaciones: tareas con recordatorio para hoy o fechas pasadas
  const reminderTasks = visibleTasks.filter((task) => {

    if (!task.enviarRecordatorio) return false;

    // Compatibilidad con tareas antiguas
    const reminderEnabled =
      task.recordatorioActivo ?? true;

    if (!reminderEnabled) return false;

    if (task.completed) return false;

    if (!task.fechaLimite) return false;

    const dueDate = new Date(task.fechaLimite);

    dueDate.setHours(0, 0, 0, 0);

    return dueDate <= today;
  });

  const unreadNotifications = reminderTasks.filter(
    (task) => !notificationReadIds.includes(String(task.id))
  );

  // Estadísticas (solo números dinámicos)
  const stats = [
    {
      value: visibleTasks.length,
      type: "total",
      label: "Tareas Totales",
    },
    {
      value: visibleTasks.filter((t) => !t.completed).length,
      type: "pending",
      label: "Pendientes",
    },
    {
      value: visibleTasks.filter((t) => t.completed).length,
      type: "completed",
      label: "Completadas",
    },
    {
      value: lateTasksCount,
      type: "late",
      label: "Atrasadas",
    },
  ];

  return (
  <main
    className="flex-grow-1 w-100"
    style={{ overflowY: "auto", backgroundColor: "#f9fafb" }}
  >
    <div className="p-3 p-md-5">

      {/* HEADER COMPONENT */}
      <Header
        toggleMenu={() =>
          setIsMobileMenuOpen(!isMobileMenuOpen)
        }
        activeView="inicio"
        user={{
          name: currentUser?.nombre || "Usuario",
        }}

        notifications={reminderTasks.map((task) => ({
          ...task,
          read: notificationReadIds.includes(String(task.id)),
        }))}

        unreadCount={
          reminderTasks.filter(
            (task) =>
              !notificationReadIds.includes(String(task.id))
          ).length
        }

        toggleTaskStatus={toggleTaskStatus}
        markNotificationAsRead={markNotificationAsRead}
        markNotificationAsUnread={markNotificationAsUnread}
        markAllNotifications={markAllNotifications}

        setActiveView={setActiveView}
        setSelectedTask={setSelectedTask}
      />

      <div className="row g-3 g-md-5 mb-3 mb-md-5 align-items-stretch">
        <div className="col-12 col-lg-auto">
          {/* Calendar */}
            <div
              className="card rounded-2xl border-0 h-100"
              style={{
                maxWidth: "580px",
                width: "100%",
                minHeight: "380px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div className="card-body p-3 p-md-4">
                <div className="d-flex align-items-center justify-content-between mb-3 mb-md-4">
                  <button
                    onClick={prevMonth}
                    className="btn btn-sm"
                    style={{
                      padding: "4px",
                      backgroundColor: "transparent",
                      border: "none",
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
                        d="M12 14l-4-4 4-4"
                        stroke="#6b7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    </button>
                  <h3
                    style={{
                      fontSize: "clamp(14px, 4vw, 16px)",
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: "0",
                    }}
                  >
                    {currentMonth}
                  </h3>
                  <button
                    className="btn btn-sm"
                    onClick={nextMonth}
                    style={{
                      padding: "4px",
                      backgroundColor: "transparent",
                      border: "none",
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
                        d="M8 14l4-4-4-4"
                        stroke="#6b7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  {weekDays.map((day, idx) => (
                    <div
                      key={idx}
                      style={{
                        textAlign: "center",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "#6b7280",
                        padding: "8px 0",
                      }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gap: "8px",
                  }}
                >
                  {calendarDays.map((item, idx) => {
                    if (item.empty) {
                      return (
                        <div
                          key={idx}
                          style={{
                            minHeight: "40px",
                            minWidth: "40px",
                          }}
                        />
                      );
                    }

                    const dayTasks = visibleTasks.filter((task) => {
                      if (!task.fechaLimite) return false;

                      const taskDate = new Date(task.fechaLimite);

                      return (
                        taskDate.toDateString() ===
                        item.date.toDateString()
                      );
                    });

                    const hasTasks = dayTasks.length > 0;

                    const hasPendingOrLate = dayTasks.some(
                      (task) => !task.completed
                    );

                    const dotColor = hasPendingOrLate
                      ? "#ca8a04"
                      : "#16a34a";

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDate(item.date)}
                        style={{
                          minHeight: "40px",
                          minWidth: "40px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: "500",
                          backgroundColor:
                            selectedDate.toDateString() === item.date.toDateString()
                              ? "#3f63eb"
                              : "transparent",
                          color:
                            selectedDate.toDateString() === item.date.toDateString()
                              ? "white"
                              : "#4b5563",
                          border: "none",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (selectedDate.toDateString() !== item.date.toDateString()) {
                            e.currentTarget.style.backgroundColor = "#f3f4f6";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedDate.toDateString() !== item.date.toDateString()) {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }
                        }}
                      >
                        <span>
                          {item.date.getDate()}
                        </span>

                        {hasTasks && (
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              backgroundColor: dotColor,
                              marginTop: "3px",
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-auto">
            {/* Tasks Section */}
            <div
              className="card rounded-2xl border-0 h-100"
              style={{
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                minWidth: "470px",
                maxWidth: "500px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="card-body p-3 p-md-4"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  overflowY: "auto",
                }}
              >
                <h3
                  style={{
                    fontSize: "clamp(16px, 4vw, 18px)",
                    fontWeight: "600",
                    color: "#111827",
                    marginBottom: "16px",
                  }}
                >
                  Tareas del {selectedDate.getDate()} de {currentMonth}
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    flex: 1,
                  }}
                >
                  {/* SIN TAREAS */}
                  {tasks.length === 0 && (
                    <div
                      style={{
                        textAlign: "center",
                        color: "#9ca3af",
                        fontSize: "14px",
                        marginTop: "20px",
                      }}
                    >
                      No hay tareas para este día
                    </div>
                  )}

                  {/* LISTADO */}
                  {tasks.map((task) => {
                    const fullName = task.assignedTo
                      ? `${task.assignedTo.nombre} ${task.assignedTo.apellido}`
                      : "Sin asignar";

                    const initials = task.assignedTo
                      ? `${task.assignedTo.nombre?.charAt(0) || ""}${
                          task.assignedTo.apellido?.charAt(0) || ""
                        }`.toUpperCase()
                      : "?";

                    const taskDate = new Date(task.fechaLimite);
                    taskDate.setHours(0, 0, 0, 0);

                    const isLate =
                      !task.completed && taskDate < today;

                    const statusLabel = task.completed
                      ? "Completada"
                      : isLate
                      ? "Atrasada"
                      : "Pendiente";

                    const statusStyles = task.completed
                      ? {
                          backgroundColor: "#dcfce7",
                          color: "#166534",
                        }
                      : isLate
                      ? {
                          backgroundColor: "#fee2e2",
                          color: "#dc2626",
                        }
                      : {
                          backgroundColor: "#fef3c7",
                          color: "#ca8a04",
                        };  

                    return (
                      <div
                        key={task.id}
                        className="d-flex align-items-start justify-content-between p-3"
                        onClick={() => {
                          setActiveView("tareas");
                          setSelectedTask(task);
                        }}
                        style={{
                          borderRadius: "12px",
                          transition: "all 0.2s",
                          cursor: "pointer",
                          border: "1px solid #f1f5f9",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f9fafb";
                          e.currentTarget.style.borderColor = "#e5e7eb";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.borderColor = "#f1f5f9";
                        }}
                      >
                        <div
                          className="d-flex align-items-start gap-3"
                          style={{ flex: 1 }}
                        >
                          {/* CHECK */}
                          <input
                            type="checkbox"
                            checked={task.completed || false}
                            onChange={() => toggleTaskStatus(task)}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              marginTop: "4px",
                              width: "16px",
                              height: "16px",
                              borderRadius: "50%",
                              border: "1px solid #d1d5db",
                              accentColor: "#3f63eb",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          />

                          {/* CONTENIDO */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                marginBottom: "10px",
                                color: task.completed ? "#9ca3af" : "#111827",
                                textDecoration: task.completed
                                  ? "line-through"
                                  : "none",
                              }}
                            >
                              {task.titulo || "Sin título"}
                            </p>

                            {/* BADGES */}
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              {/* USUARIO */}
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  padding: "5px 10px",
                                  borderRadius: "999px",
                                  backgroundColor: "#eef2ff",
                                  color: "#4338ca",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                }}
                              >
                                {fullName}
                              </span>

                              {/* DEPARTAMENTO */}
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  padding: "5px 10px",
                                  borderRadius: "999px",
                                  backgroundColor: "#f3f4f6",
                                  color: "#4b5563",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                }}
                              >
                                {task.departamento?.nombre ||
                                  "Sin departamento"}
                              </span>

                              {/* ESTADO */}
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  padding: "5px 10px",
                                  borderRadius: "999px",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  ...statusStyles,
                                }}
                              >
                                {statusLabel}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* AVATAR */}
                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            minWidth: "42px",
                            borderRadius: "50%",
                            backgroundColor: "#dbeafe",
                            color: "#1d4ed8",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "14px",
                            fontWeight: "700",
                            marginLeft: "12px",
                          }}
                        >
                          {initials}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div>
          <h3
            style={{
              fontSize: "clamp(16px, 4vw, 18px)",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "16px",
            }}
          >
            Estadísticas
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px",
            }}
          >
            {/* TOTAL */}
            <div
              className="rounded-2xl"
              style={{
                padding: "clamp(16px, 4vw, 28px) clamp(16px, 5vw, 24px)",
                backgroundColor: "#f3e8ff",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#e9d5ff",
                }}
              >
                <svg width="24" height="24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="#6366F1" strokeWidth="2" />
                  <path d="M8 12h8M8 8h8M8 16h5" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <div style={{ fontSize: "28px", fontWeight: "700" }}>
                {visibleTasks.length}
              </div>

              <div style={{ color: "#6b7280" }}>
                Tareas Totales
              </div>
            </div>

            {/* PENDIENTES */}
            <div
              className="rounded-2xl"
              style={{
                padding: "clamp(16px, 4vw, 28px) clamp(16px, 5vw, 24px)",
                backgroundColor: "#fefce8",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fee2cb",
                }}
              >
                <svg width="24" height="24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="2" />
                  <path d="M12 7v5l3 3" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <div style={{ fontSize: "28px", fontWeight: "700" }}>
                {visibleTasks.filter(t => !t.completed).length}
              </div>

              <div style={{ color: "#6b7280" }}>
                Pendientes
              </div>
            </div>

            {/* COMPLETADAS */}
            <div
              className="rounded-2xl"
              style={{
                padding: "clamp(16px, 4vw, 28px) clamp(16px, 5vw, 24px)",
                backgroundColor: "#f0fdf4",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#dcfce7",
                }}
              >
                <svg width="24" height="24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="2" />
                  <path d="M8 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div style={{ fontSize: "28px", fontWeight: "700" }}>
                {visibleTasks.filter(t => t.completed).length}
              </div>

              <div style={{ color: "#6b7280" }}>
                Completadas
              </div>
            </div>

            {/* ATRASADAS */}
            <div
              className="rounded-2xl"
              style={{
                padding: "clamp(16px, 4vw, 28px) clamp(16px, 5vw, 24px)",
                backgroundColor: "#fef2f2",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fee2e2",
                }}
              >
                <svg width="24" height="24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="2" />
                  <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              <div style={{ fontSize: "28px", fontWeight: "700" }}>
                {lateTasksCount}
              </div>

              <div style={{ color: "#6b7280" }}>
                Atrasadas
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
  );
}