import { Bell } from "lucide-react";
import { useAppState } from "../hooks/useAppState";
import Header from "../components/layout/Header";

export default function Home() {
  const {
    selectedDate,
    setSelectedDate,
    currentMonth,
    calendarDays,
    weekDays,
    tasks,
    stats,
    prevMonth,
    nextMonth,
  } = useAppState();

  return (
  <main
    className="flex-grow-1 w-100"
    style={{ overflowY: "auto", backgroundColor: "#f9fafb" }}
  >
    <div className="p-3 p-md-5">

      {/* HEADER COMPONENT */}
      <Header
        toggleMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        activeView="inicio"
        user={{ name: "Ivan" }}
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
                  {calendarDays.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(item.date)}
                      style={{
                        width: "100%",
                        aspectRatio: "1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        backgroundColor:
                          selectedDate === item.date
                            ? "#3f63eb"
                            : "transparent",
                        color:
                          selectedDate === item.date ? "white" : "#4b5563",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        if (selectedDate !== item.date) {
                          e.currentTarget.style.backgroundColor = "#f3f4f6";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedDate !== item.date) {
                          e.currentTarget.style.backgroundColor =
                            "transparent";
                        }
                      }}
                    >
                      {item.date}
                    </button>
                  ))}
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
                  Tareas del {selectedDate} de {currentMonth}
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    flex: 1,
                  }}
                >
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="d-flex align-items-start gap-3 p-2"
                      style={{
                        borderRadius: "8px",
                        transition: "background-color 0.2s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#f9fafb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor =
                          "transparent")
                      }
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        style={{
                          marginTop: "4px",
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          border: "1px solid #d1d5db",
                          accentColor: "#3f63eb",
                          cursor: "pointer",
                        }}
                        readOnly
                      />
                      <div className="flex-grow-1">
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            marginBottom: "4px",
                            color: task.completed ? "#9ca3af" : "#111827",
                            textDecoration: task.completed
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {task.title}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#6b7280",
                            marginBottom: "0",
                          }}
                        >
                          {task.category}
                        </p>
                      </div>
                      <img
                        src={task.avatar}
                        alt=""
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                        }}
                      />
                    </div>
                  ))}
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
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-2xl"
                style={{
                  padding: "clamp(16px, 4vw, 28px) clamp(16px, 5vw, 24px)",
                  backgroundColor:
                    stat.type === "total"
                      ? "#f3e8ff"
                      : stat.type === "pending"
                      ? "#fefce8"
                      : stat.type === "completed"
                      ? "#f0fdf4"
                      : "#fef2f2",
                  display: "flex",
                  alignItems: "center",
                  gap: "clamp(12px, 3vw, 16px)",
                  flexWrap: "nowrap",
                  whiteSpace: "nowrap",
                }}
              >
                <div
                  style={{
                    width: "clamp(48px, 10vw, 56px)",
                    height: "clamp(48px, 10vw, 56px)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    backgroundColor:
                      stat.type === "total"
                        ? "#e9d5ff"
                        : stat.type === "pending"
                        ? "#fee2cb"
                        : stat.type === "completed"
                        ? "#dcfce7"
                        : "#fee2e2",
                  }}
                >
                  {stat.type === "total" && (
                    <svg width="24" height="24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="2" stroke="#6366F1" strokeWidth="2" />
                      <path d="M8 12h8M8 8h8M8 16h5" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}

                  {stat.type === "pending" && (
                    <svg width="24" height="24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#F59E0B" strokeWidth="2" />
                      <path d="M12 7v5l3 3" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}

                  {stat.type === "completed" && (
                    <svg width="24" height="24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#10B981" strokeWidth="2" />
                      <path d="M8 12l2 2 4-4" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}

                  {stat.type === "late" && (
                    <svg width="24" height="24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="2" />
                      <path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>

                <div
                  style={{
                    fontSize: "clamp(24px, 6vw, 28px)",
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  {stat.value}
                </div>

                <div
                  style={{
                    fontSize: "clamp(12px, 3vw, 15px)",
                    color: "#6b7280",
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
    
  );
}