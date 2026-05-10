import { useAuth } from "./useAuth";

export function useUsers() {
  const { users, setUsers } = useAuth();

  const addUser = (newUser) => {
    const createdUser = {
      id: Date.now(),
      ...newUser,
    };

    setUsers((prev) => [
      ...prev,
      createdUser,
    ]);
  };

  const updateUser = (updatedUser) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === updatedUser.id
          ? updatedUser
          : user,
      ),
    );
  };

  const deleteUser = (id) => {
    setUsers((prev) =>
      prev.filter((user) => user.id !== id),
    );
  };

  return {
    allUsers: users,
    addUser,
    updateUser,
    deleteUser,
  };
}