import { useState, useMemo, useCallback, useRef, useEffect } from "react";

export default function TaskList({ tasks, filter, sort, dispatch }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Exploración");
  const inputRef = useRef(null);

  const processedTasks = useMemo(() => {
    const visible = tasks.filter((task) => {
      if (filter === "active") return !task.done;
      if (filter === "completed") return task.done;
      return true;
    });

    return [...visible].sort((a, b) => {
      const result = a.title.localeCompare(b.title, "es");
      return sort === "asc" ? result : -result;
    });
  }, [tasks, filter, sort]);

  const handleRemove = useCallback(
    (id) => {
      dispatch({ type: "REMOVE", id });
    },
    [dispatch],
  );

  const handleToggle = useCallback(
    (id) => {
      dispatch({ type: "TOGGLE", id });
    },
    [dispatch],
  );

  const handleFilter = useCallback(
    (nextFilter) => {
      dispatch({ type: "FILTER", filter: nextFilter });
    },
    [dispatch],
  );

  const handleSort = useCallback(() => {
    dispatch({ type: "SORT" });
  }, [dispatch]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (!title.trim()) {
        inputRef.current?.focus();
        return;
      }

      const xpByCategory = {
        Exploración: 120,
        Combate: 180,
        Alquimia: 80,
        Recolección: 100,
      };

      dispatch({
        type: "ADD",
        task: {
          id: globalThis.crypto?.randomUUID?.() ?? `quest-${Date.now()}`,
          title: title.trim(),
          category,
          done: false,
          xp: xpByCategory[category] ?? 100,
        },
      });

      setTitle("");
    },
    [title, category, dispatch],
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, [tasks.length]);

  useEffect(() => {
    const handleShortcut = (event) => {
      if (
        event.key === "/" &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
      ) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  return (
    <section className="task-panel">
      <h2>Misiones del gremio</h2>

      <form onSubmit={handleSubmit} className="task-form">
        <input
          ref={inputRef}
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
        <button onClick={() => handleFilter("all")}>Todas</button>
        <button onClick={() => handleFilter("active")}>Pendientes</button>
        <button onClick={() => handleFilter("completed")}>Completadas</button>
        <button onClick={handleSort}>
          Orden: {sort === "asc" ? "A–Z" : "Z–A"}
        </button>
      </div>

      <p>Misiones encontradas: {processedTasks.length}</p>

      <ul className="task-list">
        {processedTasks.map((task) => (
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
              <button onClick={() => handleToggle(task.id)}>
                {task.done ? "Reabrir" : "Completar"}
              </button>
              <button onClick={() => handleRemove(task.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
