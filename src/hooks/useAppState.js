import { useState } from "react";

export function useAppState() {
  const [selectedDate, setSelectedDate] = useState(5);
  const [currentMonth] = useState("Octubre 2024");
  const [activeView, setActiveView] = useState("inicio");

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const [tasks] = useState([
    {
      id: 1,
      title: "Revisar diseño de la nueva landing page",
      category: "Marketing",
      completed: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    },
    {
      id: 2,
      title: "Desarrollar endpoint para la API de usuarios",
      category: "Desarrollo",
      completed: false,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    },
    {
      id: 3,
      title: "Preparar presentación de resultados trimestrales",
      category: "Dirección",
      completed: true,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    },
  ]);

  const calendarDays = [
    { day: 1, date: 1 },
    { day: 2, date: 2 },
    { day: 3, date: 3 },
    { day: 4, date: 4 },
    { day: 5, date: 5 },
    { day: 6, date: 6 },
    { day: 0, date: 7 },
    // ... puedes dejarlo igual
  ];

  const weekDays = ["D", "L", "M", "M", "J", "V", "S"];

  const stats = [
    { value: "32", label: "Tareas Totales" },
    { value: "14", label: "Pendientes" },
    { value: "18", label: "Completadas" },
    { value: "2", label: "Atrasadas" },
  ];

  return {
    selectedDate,
    setSelectedDate,
    currentMonth,
    activeView,
    setActiveView,
    tasks,
    calendarDays,
    weekDays,
    stats,
    showAddTaskModal,
    setShowAddTaskModal,
  };
}