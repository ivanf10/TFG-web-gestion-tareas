export default function Calendar({
  currentMonth,
  weekDays,
  calendarDays,
  selectedDate,
  setSelectedDate,
}) {
  return (
    <div className="card rounded-2xl border-0" style={{ maxWidth: "580px" }}>
      <div className="card-body">

        <div className="d-flex justify-content-between mb-4">
          <button className="btn btn-sm">{"<"}</button>
          <h3>{currentMonth}</h3>
          <button className="btn btn-sm">{">"}</button>
        </div>

        <div className="d-grid" style={{ gridTemplateColumns: "repeat(7,1fr)" }}>
          {weekDays.map((d, i) => (
            <div key={i} className="text-center">{d}</div>
          ))}
        </div>

        <div className="d-grid" style={{ gridTemplateColumns: "repeat(7,1fr)" }}>
          {calendarDays.map((item, i) => (
            <button
              key={i}
              onClick={() => setSelectedDate(item.date)}
              style={{
                background:
                  selectedDate === item.date ? "#3f63eb" : "transparent",
                color: selectedDate === item.date ? "white" : "#4b5563",
              }}
            >
              {item.date}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}