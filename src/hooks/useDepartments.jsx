import { useEffect, useState } from "react";

const API_URL = "http://localhost:3001/departments";

export function useDepartments() {

  const [allDepartments, setAllDepartments] = useState([]);

  /* GET DEPARTMENTS */
  const fetchDepartments = async () => {
    try {

      const response = await fetch(API_URL);

      const data = await response.json();

      const formattedDepartments = data.map((dept) => ({
        ...dept,

        name: dept.nombre,
        description: dept.descripcion,

        members: dept.miembros?.map((m) => m.id) || [],

        employees: dept.miembros?.length || 0,
      }));

      setAllDepartments(formattedDepartments);

    } catch (error) {

      console.error(
        "Error fetching departments:",
        error,
      );
    }
  };

  /* CREATE DEPARTMENT */
  const addDepartment = async (dept) => {
    try {

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          nombre: dept.nombre,
          descripcion: dept.descripcion,
          miembros: dept.miembros || [],
        }),
      });

      if (!response.ok) {
        throw new Error(
          "Error creating department",
        );
      }

      await fetchDepartments();

    } catch (error) {

      console.error(
        "Error adding department:",
        error,
      );
    }
  };

  /* UPDATE DEPARTMENT */
  const updateDepartment = async (
    updatedDept,
  ) => {
    try {

      const response = await fetch(
        `${API_URL}/${updatedDept.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            nombre:
              updatedDept.nombre ||
              updatedDept.name,

            descripcion:
              updatedDept.descripcion ||
              updatedDept.description,

            miembros:
              updatedDept.miembros ||
              updatedDept.members ||
              [],
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "Error updating department",
        );
      }

      await fetchDepartments();

    } catch (error) {

      console.error(
        "Error updating department:",
        error,
      );
    }
  };

  /* DELETE DEPARTMENT */
  const deleteDepartment = async (
    departmentId,
  ) => {
    try {

      const response = await fetch(
        `${API_URL}/${departmentId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(
          "Error deleting department",
        );
      }

      await fetchDepartments();

    } catch (error) {

      console.error(
        "Error deleting department:",
        error,
      );
    }
  };

  /* INITIAL LOAD */
  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    allDepartments,

    fetchDepartments,

    addDepartment,

    updateDepartment,

    deleteDepartment,
  };
}