import { Bell, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function Header({
  toggleMenu,
  user,
  activeView,

  notifications = [],
  unreadCount = 0,

  toggleTaskStatus,
  markNotificationAsRead,
  markNotificationAsUnread,
  markAllNotifications,

  setActiveView,
  setSelectedTask,
}) {
  const isHome = activeView === "inicio";

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const allNotificationsRead = notifications.length > 0 && notifications.every((n) => n.read);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

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

        {/* SOLO EN HOME */}
        {isHome && (
          <h2
            style={{
              fontSize: "clamp(18px, 5vw, 24px)",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "0",
            }}
          >
            Buenos días, {user?.name || "Usuario"}
          </h2>
        )}
      </div>

      {/* NOTIFICACIONES */}
      {isHome && (
        <div
          ref={notificationRef}
          style={{ position: "relative" }}
        >
          <button
            className="btn"
            onClick={() =>
              setShowNotifications((prev) => !prev)
            }
            style={{
              background: "transparent",
              border: "none",
              position: "relative",
            }}
          >
            <Bell
              style={{
                width: "20px",
                height: "20px",
                color: "#6b7280",
              }}
            />

            {/* BADGE */}
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-2px",
                  right: "-2px",
                  minWidth: "18px",
                  height: "18px",
                  borderRadius: "999px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 5px",
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* PANEL */}
          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "48px",
                right: 0,
                width: "360px",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.12)",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
                zIndex: 9999,
              }}
            >
              {/* HEADER */}
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "15px",
                    color: "#111827",
                  }}
                >
                  Notificaciones
                </div>

                {notifications.length > 0 && (
                  <button
                    onClick={() =>
                      markAllNotifications(
                        notifications,
                        !allNotificationsRead
                      )
                    }
                    style={{
                      border: "none",
                      background: "transparent",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#2563eb",
                      cursor: "pointer",
                    }}
                  >
                    {allNotificationsRead
                      ? "Desmarcar todas"
                      : "Marcar todas"}
                  </button>
                )}
              </div>

              {/* LISTA */}
              <div
                style={{
                  maxHeight: "420px",
                  overflowY: "auto",
                }}
              >
                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: "30px 20px",
                      textAlign: "center",
                      fontSize: "14px",
                      color: "#9ca3af",
                    }}
                  >
                    No hay notificaciones
                  </div>
                ) : (
                  notifications.map((task) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    const dueDate = new Date(task.dueDate);
                    dueDate.setHours(0, 0, 0, 0);

                    const isLate = dueDate < today;

                    return (
                      <div
                        key={task.id}
                        style={{
                          padding: "14px",
                          borderBottom: "1px solid #f3f4f6",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        {/* TITULO */}
                        <div
                          className="d-flex align-items-start gap-2"
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => {
                              toggleTaskStatus(task.id);

                              if (!task.completed) {
                                markNotificationAsRead(task.id);
                              } else {
                                markNotificationAsUnread(task.id);
                              }
                            }}
                            style={{
                              marginTop: "4px",
                              accentColor: "#2563eb",
                              cursor: "pointer",
                            }}
                          />

                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                marginBottom: "4px",
                              }}
                            >
                              {!task.read && (
                                <span
                                  style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "999px",
                                    backgroundColor: "#ef4444",
                                    flexShrink: 0,
                                  }}
                                />
                              )}

                              <p
                                style={{
                                  marginBottom: "0",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  color: task.completed
                                    ? "#9ca3af"
                                    : "#111827",
                                  textDecoration:
                                    task.completed
                                      ? "line-through"
                                      : "none",
                                }}
                              >
                                {task.title}
                              </p>
                            </div>

                            <p
                              style={{
                                marginBottom: "8px",
                                fontSize: "12px",
                                fontWeight: "600",
                                color: task.completed
                                  ? "#10B981"
                                  : isLate
                                  ? "#dc2626"
                                  : "#ca8a04",
                              }}
                            >
                              {task.completed
                                ? "Completada"
                                : isLate
                                ? "Tarea atrasada"
                                : "Pendiente para hoy"}
                            </p>

                            {/* BOTONES */}
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                flexWrap: "wrap",
                              }}
                            >
                              <button
                                onClick={() => {
                                  if (task.read) {
                                    markNotificationAsUnread(task.id);
                                  } else {
                                    markNotificationAsRead(task.id);
                                  }
                                }}
                                style={{
                                  border: "none",
                                  backgroundColor:
                                    "#f3f4f6",
                                  padding: "6px 10px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  cursor: "pointer",
                                }}
                              >
                                {task.read
                                  ? "Desmarcar como leído"
                                  : "Marcar como leído"}
                              </button>

                              <button
                                onClick={() => {
                                  setActiveView(
                                    "tareas"
                                  );

                                  setSelectedTask(
                                    task
                                  );

                                  setShowNotifications(
                                    false
                                  );
                                }}
                                style={{
                                  border: "none",
                                  backgroundColor:
                                    "#2563eb",
                                  color: "white",
                                  padding: "6px 10px",
                                  borderRadius: "6px",
                                  fontSize: "12px",
                                  cursor: "pointer",
                                }}
                              >
                                Ver tarea
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}