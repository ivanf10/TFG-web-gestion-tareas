import { useState } from "react";

export function useAppState() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const currentMonth = currentDate.toLocaleString("es-ES", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push({ empty: true });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      date: new Date(year, month, d),
    });
  }

  const weekDays = ["D", "L", "M", "M", "J", "V", "S"];

  const prevMonth = () => {
    const newDate = new Date(year, month - 1, 1);

    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(year, month + 1, 1);

    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  return {
    selectedDate,
    setSelectedDate,
    currentMonth,
    calendarDays,
    weekDays,

    prevMonth,
    nextMonth,
  };
}