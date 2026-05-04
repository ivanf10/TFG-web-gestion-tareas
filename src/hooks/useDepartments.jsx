import { useState } from "react";

export function useDepartments() {
  const [allDepartments, setAllDepartments] = useState([
    {
      id: 1,
      name: "Ingeniería",
      employees: 42,
      description: "",
      members: [],
    },
    {
      id: 2,
      name: "Marketing",
      employees: 18,
      description: "",
      members: [],
    },
  ]);

  const addDepartment = (dept) => {
    const newDept = {
      id: Date.now(),
      name: dept.nombre,
      description: dept.descripcion || "",
      employees: dept.members?.length || 0,
      members: dept.members || [],
    };

    setAllDepartments((prev) => [newDept, ...prev]);
  };

  const updateDepartment = (updatedDept) => {
    setAllDepartments((prev) =>
      prev.map((d) =>
        d.id === updatedDept.id ? { ...d, ...updatedDept } : d
      )
    );
  };

  const deleteDepartment = (id) => {
    setAllDepartments((prev) => prev.filter((d) => d.id !== id));
  };

  return {
    allDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  };
}