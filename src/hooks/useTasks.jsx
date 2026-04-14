import { useState } from "react";

export function useTasks() {
  // Estado global de tareas
  const [allTasks, setAllTasks] = useState([
    {
      id: 1,
      title: "Revisar diseño de la nueva landing page",
      category: "Marketing",
      department: "Diseño",
      assignedTo: "Ana García",
      dueDate: "2024-10-25",
      completed: false,
      recordatorio: true,
      date: 25,
      description: "Revisión completa del diseño",
      creationDate: "2024-10-20",
      createdBy: "Admin",
    },
    {
      id: 2,
      title: "Desarrollar endpoint API usuarios",
      category: "Desarrollo",
      department: "Ingeniería",
      assignedTo: "Carlos Ruiz",
      dueDate: "2024-10-28",
      completed: false,
      recordatorio: false,
      date: 28,
      description: "Backend autenticación",
      creationDate: "2024-10-21",
      createdBy: "Admin",
    },
    {
      id: 3,
      title: "Preparar presentación trimestral",
      category: "Dirección",
      department: "Ventas",
      assignedTo: "Laura Méndez",
      dueDate: "2024-10-22",
      completed: true,
      recordatorio: true, 
      date: 22,
      description: "Informe de resultados",
      creationDate: "2024-10-18",
      createdBy: "Admin",
    },
  ]);

  // Crear tarea
  const addTask = (newTask) => {
    const today = new Date();

    const task = {
      id: Date.now(),
      title: newTask.title || "",
      description: newTask.description || "",
      department: newTask.department || "",
      assignedTo: newTask.assignedTo || "",
      dueDate: newTask.dueDate || "",
      completed: newTask.completed || false,
      recordatorio: newTask.recordatorio ?? false,

      date: newTask.dueDate
        ? new Date(newTask.dueDate).getDate()
        : today.getDate(),

      creationDate: today.toISOString().split("T")[0],
      createdBy: "Admin",
    };

    setAllTasks((prev) => [...prev, task]);
  };

  // Editar tarea
  const updateTask = (updatedTask) => {
    setAllTasks((prev) =>
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
    setAllTasks((prev) =>
      prev.filter((task) => task.id !== taskId)
    );
  };

  // Toggle completada
  const toggleTaskStatus = (taskId) => {
    setAllTasks((prev) =>
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