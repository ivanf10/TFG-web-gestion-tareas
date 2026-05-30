import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/tasks`;

export function useTasks() {

  const [allTasks, setTasks] = useState([]);

  /* GET TASKS */
  const fetchTasks = async () => {
    try {

      const response = await fetch(API_URL);

      const data = await response.json();

      setTasks(data);

    } catch (error) {

      console.error("Error fetching tasks:", error);

    }
  };

  /* CREATE TASK */
const addTask = async (newTask) => {
  try {

    const response = await fetch(API_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(newTask),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error creating task");
    }

    await fetchTasks();

  } catch (error) {

    console.error("Error adding task:", error);

  }
};

  /* UPDATE TASK */
  const updateTask = async (updatedTask) => {
    try {

      const response = await fetch(
        `${API_URL}/${updatedTask.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(updatedTask),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating task");
      }

      await fetchTasks();

    } catch (error) {

      console.error("Error updating task:", error);

    }
  };

  /* DELETE TASK */
  const deleteTask = async (id) => {
    try {

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error deleting task");
      }

      await fetchTasks();

    } catch (error) {

      console.error("Error deleting task:", error);

    }
  };

  /* TOGGLE TASK */
  const toggleTaskStatus = async (task) => {
    try {

      const newCompletedState = !task.completed;

      await updateTask({
        ...task,

        completed: newCompletedState,

        recordatorioActivo: newCompletedState
          ? false
          : task.enviarRecordatorio,

      });

    } catch (error) {

      console.error(error);

    }
  };

  /* INITIAL LOAD */
  useEffect(() => {

    fetchTasks();

  }, []);

  return {
    allTasks,

    fetchTasks,

    addTask,

    updateTask,

    deleteTask,

    toggleTaskStatus,
  };
}