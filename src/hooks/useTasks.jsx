import { useState } from "react";
import { useAuth } from "./useAuth";

export function useTasks() {
  const [allTasks, setTasks] = useState([]);

  const { currentUser } = useAuth();

  const addTask = (newTask) => {
    const today = new Date();

    const task = {
      id: Date.now(),
      title: newTask.title || "",
      description: newTask.description || "",
      department: newTask.department || "",
      assignedTo: newTask.assignedTo || "",
      dueDate: newTask.dueDate || "",
      completed: newTask.completed ?? false,
      recordatorio: newTask.recordatorio ?? false,

      creationDate: today.toISOString().split("T")[0],

      createdBy: currentUser
        ? `${currentUser.nombre} ${currentUser.apellido}`
        : "Usuario",
    };

    setTasks((prev) => [...prev, task]);
  };

  // Editar tarea
  const updateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === updatedTask.id
          ? {
              ...task,

              // campos editables
              title: updatedTask.title,
              description: updatedTask.description,
              department: updatedTask.department,
              assignedTo: updatedTask.assignedTo,
              dueDate: updatedTask.dueDate,
              completed: updatedTask.completed,

              recordatorio:
                updatedTask.recordatorio ?? task.recordatorio,

              // recalcular día calendario
              date: updatedTask.dueDate
                ? new Date(updatedTask.dueDate).getDate()
                : task.date,
            }
          : task
      )
    );
  };

  // Eliminar tarea
  const deleteTask = (taskId) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== taskId)
    );
  };

  // Toggle completada
  const toggleTaskStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  };

  return {
    allTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  };
}