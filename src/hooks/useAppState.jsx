import { useState } from "react";

export function useAppState() {
  // 📅 Fecha actual (mes dinámico)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().getDate()
  );

  // 🗓️ Nombre del mes dinámico
  const currentMonth = currentDate.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  // 📅 Días del mes dinámicos
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => ({
    date: i + 1,
  }));

  const weekDays = ["D", "L", "M", "M", "J", "V", "S"];

  // 🔥 Simulación de BD (ya preparada para backend)
  const allTasks = [
    {
      id: 1,
      title: "Revisar diseño de la nueva landing page",
      category: "Marketing",
      completed: false,
      date: 5,
    },
    {
      id: 2,
      title: "Desarrollar endpoint para la API de usuarios",
      category: "Desarrollo",
      completed: false,
      date: 6,
    },
    {
      id: 3,
      title: "Preparar presentación de resultados trimestrales",
      category: "Dirección",
      completed: true,
      date: 5,
    },
    {
      id: 4,
      title: "Reunión equipo",
      category: "Marketing",
      completed: true,
      date: 7,
    },
  ];

  // 📌 Tareas del día seleccionado
  const tasks = allTasks.filter((t) => t.date === selectedDate);

  //Estadísticas
  const stats = [
    {
      value: allTasks.length,
      type: "total",
      label: "Tareas Totales",
    },
    {
      value: allTasks.filter((t) => !t.completed).length,
      type: "pending",
      label: "Pendientes",
    },
    {
      value: allTasks.filter((t) => t.completed).length,
      type: "completed",
      label: "Completadas",
    },
    {
      value: allTasks.filter(
        (t) => !t.completed && t.date < selectedDate
      ).length,
      type: "late",
      label: "Atrasadas",
    },
  ];

  // ⬅️➡️ Cambiar mes
  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDate(1);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDate(1);
  };

  return {
    selectedDate,
    setSelectedDate,
    currentMonth,
    calendarDays,
    weekDays,
    tasks,
    stats,
    prevMonth,
    nextMonth,
  };
}