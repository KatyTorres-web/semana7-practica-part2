import { useState } from "react";

export default function TaskList({ tasks, filter, sort, dispatch }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Exploración");

  const visibleTasks = tasks
    .filter((task) => {
      if (filter === "active") return !task.done;
      if (filter === "completed") return task.done;
      return true;
    })
    .slice()
    .sort((a, b) => {
      const result = a.title.localeCompare(b.title, "es");
      return sort === "asc" ? result : -result;
    });

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) return;

    const xpByCategory = {
      Exploración: 120,
      Combate: 180,
      Alquimia: 80,
      Recolección: 100,
    };

    dispatch({
      type: "ADD",
      task: {
        id: crypto.randomUUID(),
        title: title.trim(),
        category,
        done: false,
        xp: xpByCategory[category],
      },
    });

    setTitle("");
  }

  return (
    <section className="task-panel">
      <h2>Misiones del gremio</h2>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Escribe una misión..."
          aria-label="Nombre de la misión"
        />

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Categoría"
        >
          <option>Exploración</option>
          <option>Combate</option>
          <option>Alquimia</option>
          <option>Recolección</option>
        </select>

        <button type="submit">+ Forjar misión</button>
      </form>

      <div className="task-controls">
        <button
          onClick={() =>
            dispatch({
              type: "FILTER",
              filter: "all",
            })
          }
        >
          Todas
        </button>

        <button
          onClick={() =>
            dispatch({
              type: "FILTER",
              filter: "active",
            })
          }
        >
          Pendientes
        </button>

        <button
          onClick={() =>
            dispatch({
              type: "FILTER",
              filter: "completed",
            })
          }
        >
          Completadas
        </button>

        <button onClick={() => dispatch({ type: "SORT" })}>
          Orden: {sort === "asc" ? "A–Z" : "Z–A"}
        </button>
      </div>

      <p>Misiones encontradas: {visibleTasks.length}</p>

      <ul className="task-list">
        {visibleTasks.map((task) => (
          <li key={task.id} className="task-item">
            <div>
              <strong>{task.title}</strong>
              <small>
                {task.category} · {task.xp} XP
              </small>
              <span className={task.done ? "completed" : "pending"}>
                {task.done ? "Completada" : "Pendiente"}
              </span>
            </div>

            <div className="task-actions">
              <button
                onClick={() =>
                  dispatch({
                    type: "TOGGLE",
                    id: task.id,
                  })
                }
              >
                {task.done ? "Reabrir" : "Completar"}
              </button>

              <button
                onClick={() =>
                  dispatch({
                    type: "REMOVE",
                    id: task.id,
                  })
                }
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}

        {visibleTasks.length === 0 && (
          <li>No hay misiones en esta categoría.</li>
        )}
      </ul>
    </section>
  );
}
