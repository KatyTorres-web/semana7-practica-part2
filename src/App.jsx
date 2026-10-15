import { useReducer } from "react";
import tasksReducer, { initialTasksState } from "./hooks/useTasksReducer";
import { useTheme } from "./hooks/useTheme";
import { ThemeProvider } from "./contexts/ThemeContext";
import TaskList from "./components/TaskList";
import "./App.css";

function Dashboard() {
  const [state, dispatch] = useReducer(tasksReducer, initialTasksState);

  const { theme, toggleTheme } = useTheme();

  const completed = state.items.filter((task) => task.done).length;

  const totalXP = state.items
    .filter((task) => task.done)
    .reduce((total, task) => total + task.xp, 0);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="header-top">
          <p className="eyebrow">ADVENTURER'S GUILD</p>

          <button type="button" onClick={toggleTheme} aria-label="Cambiar tema">
            {theme === "dark" ? "☀️ Tema claro" : "🌙 Tema oscuro"}
          </button>
        </div>

        <h1>⚔ QuestForge</h1>
        <p>Forja tu propia leyenda.</p>
      </header>

      <section className="summary">
        <article>
          <span>Misiones totales</span>
          <strong>{state.items.length}</strong>
        </article>

        <article>
          <span>Completadas</span>
          <strong>{completed}</strong>
        </article>

        <article>
          <span>Experiencia obtenida</span>
          <strong>{totalXP} XP</strong>
        </article>
      </section>

      <TaskList
        tasks={state.items}
        filter={state.filter}
        sort={state.sort}
        dispatch={dispatch}
      />
    </main>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
}
