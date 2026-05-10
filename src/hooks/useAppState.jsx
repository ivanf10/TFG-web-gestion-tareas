import { useState } from "react";

export function useAppState() {
  // Fecha actual (mes dinámico)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );

  // Datos del mes
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Nombre del mes
  const currentMonth = currentDate.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  // Día en el que empieza el mes (0 = domingo)
  const firstDay = new Date(year, month, 1).getDay();

  // Total de días del mes
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Construcción del calendario real (con huecos)
  const calendarDays = [];

  // Huecos antes del día 1
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push({ empty: true });
  }

  // Días reales
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      date: new Date(year, month, d),
    });
  }

  // Días de la semana
  const weekDays = ["D", "L", "M", "M", "J", "V", "S"];

  // Cambiar mes
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(1);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(1);
  };

  return {
    // calendario
    selectedDate,
    setSelectedDate,
    currentMonth,
    calendarDays,
    weekDays,

    // navegación
    prevMonth,
    nextMonth,
  };
}