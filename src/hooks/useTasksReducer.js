export const initialTasksState = {
  items: [
    {
      id: "q-101",
      title: "Explorar las ruinas antiguas",
      category: "Exploración",
      done: false,
      xp: 120,
    },
    {
      id: "q-102",
      title: "Preparar una poción de energía",
      category: "Alquimia",
      done: true,
      xp: 80,
    },
    {
      id: "q-103",
      title: "Derrotar al guardián del bosque",
      category: "Combate",
      done: false,
      xp: 180,
    },
  ],
  filter: "all",
  sort: "asc",
};

export default function tasksReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        items: [action.task, ...state.items],
      };

    case "REMOVE":
      return {
        ...state,
        items: state.items.filter((task) => task.id !== action.id),
      };

    case "TOGGLE":
      return {
        ...state,
        items: state.items.map((task) =>
          task.id === action.id ? { ...task, done: !task.done } : task,
        ),
      };

    case "FILTER":
      return {
        ...state,
        filter: action.filter,
      };

    case "SORT":
      return {
        ...state,
        sort: state.sort === "asc" ? "desc" : "asc",
      };

    default:
      return state;
  }
}
