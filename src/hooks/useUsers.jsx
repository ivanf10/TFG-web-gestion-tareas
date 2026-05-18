import { useEffect, useState } from "react";

const API_URL = "http://localhost:3001/users";

export function useUsers() {

  const [allUsers, setUsers] = useState([]);

  /* GET USERS */
  const fetchUsers = async () => {
    try {

      const response = await fetch(API_URL);

      const data = await response.json();

      setUsers(data);

    } catch (error) {

      console.error("Error fetching users:", error);
    }
  };

  /* CREATE USER */
  const addUser = async (newUser) => {
    try {

      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Error creating user");
      }

      await fetchUsers();

    } catch (error) {

      console.error("Error adding user:", error);
    }
  };

  /* UPDATE USER */
  const updateUser = async (updatedUser) => {
    try {

      const response = await fetch(
        `${API_URL}/${updatedUser.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(updatedUser),
        },
      );

      if (!response.ok) {
        throw new Error("Error updating user");
      }

      await fetchUsers();

    } catch (error) {

      console.error("Error updating user:", error);
    }
  };

  /* DELETE USER */
  const deleteUser = async (id) => {
    try {

      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Error deleting user");
      }

      await fetchUsers();

    } catch (error) {

      console.error("Error deleting user:", error);
    }
  };

  /* INITIAL LOAD */
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    allUsers,

    fetchUsers,

    addUser,

    updateUser,

    deleteUser,
  };
}