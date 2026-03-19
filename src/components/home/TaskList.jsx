export default function TaskList({ tasks, selectedDate }) {
  return (
    <div className="card p-3">
      <h3>Tareas del {selectedDate}</h3>

      {tasks.map((task) => (
        <div key={task.id} className="d-flex gap-3 mb-2">
          <input type="checkbox" checked={task.completed} readOnly />

          <div>
            <p
              style={{
                textDecoration: task.completed ? "line-through" : "none",
              }}
            >
              {task.title}
            </p>
            <small>{task.category}</small>
          </div>

          <img src={task.avatar} width="32" />
        </div>
      ))}
    </div>
  );
}