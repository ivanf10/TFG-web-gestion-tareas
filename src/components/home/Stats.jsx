export default function Stats({ stats }) {
  return (
    <div>
      <h3>Estadísticas</h3>

      <div className="row">
        {stats.map((s, i) => (
          <div key={i} className="col">
            <div className="p-3 rounded">
              <h2>{s.value}</h2>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}