import { createContext, useContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  // USERS
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem("users");

    if (storedUsers) {
      return JSON.parse(storedUsers);
    }

    // ADMIN DEMO
    const defaultUsers = [
      {
        id: 1,
        nombre: "Carlos",
        apellido: "Rodríguez",
        email: "admin@optitask.com",
        contrasena: "123456",
        departamento: "Ingeniería",
        rol: "Admin",
      },
    ];

    return defaultUsers;
  });

  // SESSION
  useEffect(() => {
    const storedUser =
      localStorage.getItem("currentUser");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // SAVE USERS
  useEffect(() => {
    localStorage.setItem(
      "users",
      JSON.stringify(users),
    );
  }, [users]);

  // LOGIN
  const login = (email, contrasena) => {
    const foundUser = users.find(
      (user) =>
        user.email === email &&
        user.contrasena === contrasena,
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Credenciales incorrectas",
      };
    }

    setCurrentUser(foundUser);

    localStorage.setItem(
      "currentUser",
      JSON.stringify(foundUser),
    );

    return {
      success: true,
    };
  };

  // REGISTER
  const register = (newUser) => {
    const emailExists = users.some(
      (user) => user.email === newUser.email,
    );

    if (emailExists) {
      return {
        success: false,
        message: "El email ya está registrado",
      };
    }

    const createdUser = {
      id: Date.now(),
      ...newUser,
      rol: "Usuario",
    };

    const updatedUsers = [
      ...users,
      createdUser,
    ];

    setUsers(updatedUsers);

    setCurrentUser(createdUser);

    localStorage.setItem(
    "currentUser",
    JSON.stringify(createdUser),
    );

    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers),
    );

    return {
      success: true,
    };
  };

  const updateCurrentUser = (updatedData) => {
    // USER ACTUALIZADO
    const updatedUser = {
        ...currentUser,
        ...updatedData,
    };

    // ACTUALIZAR LISTA DE USERS
    const updatedUsers = users.map((user) =>
        user.id === currentUser.id
        ? updatedUser
        : user,
    );

    // ACTUALIZAR ESTADOS
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);

    // LOCAL STORAGE
    localStorage.setItem(
        "users",
        JSON.stringify(updatedUsers),
    );

    localStorage.setItem(
        "currentUser",
        JSON.stringify(updatedUser),
    );
  };

  const changePassword = (newPassword) => {
    // USER ACTUALIZADO
    const updatedUser = {
      ...currentUser,
      contrasena: newPassword,
    };

    // ACTUALIZAR USERS
    const updatedUsers = users.map((user) =>
      user.id === currentUser.id
        ? updatedUser
        : user,
    );

    // ESTADOS
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);

    // LOCAL STORAGE
    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers),
    );

    localStorage.setItem(
      "currentUser",
      JSON.stringify(updatedUser),
    );
  };

  // LOGOUT
  const logout = () => {
    setCurrentUser(null);

    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        setUsers,
        login,
        register,
        logout,
        updateCurrentUser,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);