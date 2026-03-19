import { Bell } from "lucide-react";
import { useAppState } from "../hooks/useAppState";

export default function Home() {
  const {
    selectedDate,
    setSelectedDate,
    currentMonth,
    calendarDays,
    weekDays,
    tasks,
    stats,
  } = useAppState();

  return (
    <main
      className="flex-grow-1 w-100"
      style={{ overflowY: "auto", backgroundColor: "#f9fafb" }}
    >
      <div className="p-3 p-md-5">

        {/* HEADER */}
        <div className="d-flex align-items-center justify-content-between mb-3 mb-md-5">
          <h2
            style={{
              fontSize: "clamp(18px, 5vw, 24px)",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "0",
            }}
          >
            Buenos días, Ivan
          </h2>

          <button className="btn" style={{ border: "none" }}>
            <Bell style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        {/* GRID PRINCIPAL */}
        <div className="row g-3 g-md-5 mb-3 mb-md-5">

          {/* CALENDARIO */}
          <div className="col-12 col-lg-auto">
            <div
              className="card rounded-2xl border-0"
              style={{
                maxWidth: "580px",
                width: "100%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <div className="card-body p-3 p-md-4">

                {/* Header calendario */}
                <div className="d-flex align-items-center justify-content-between mb-3 mb-md-4">
                  <button className="btn btn-sm" style={{ border: "none" }}>
                    {"<"}
                  </button>

                  <h3
                    style={{
                      fontSize: "clamp(14px, 4vw, 16px)",
                      fontWeight: "600",
                      marginBottom: 0,
                    }}
                  >
                    {currentMonth}
                  </h3>

                  <button className="btn btn-sm" style={{ border: "none" }}>
                    {">"}
                  </button>
                </div>

                {/* Días semana */}
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

                {/* Días calendario */}
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
                          selectedDate === item.date ? "#3f63eb" : "transparent",
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
                          e.currentTarget.style.backgroundColor = "transparent";
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

          {/* TAREAS */}
          <div className="col-12 col-lg-auto">
            <div className="card border-0">
              <div className="card-body">

                <h3>Tareas del día</h3>

                {tasks.map((t) => (
                  <div key={t.id} className="d-flex gap-2 mb-2">
                    <input type="checkbox" checked={t.completed} readOnly />
                    <div>
                      <div>{t.title}</div>
                      <small>{t.category}</small>
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </div>

        </div>

        {/* STATS */}
        <div>
          <h3>Estadísticas</h3>

          <div className="row">
            {stats.map((s, i) => (
              <div key={i} className="col-md-3">
                <div className="p-3 border rounded">
                  <h4>{s.value}</h4>
                  <p>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}