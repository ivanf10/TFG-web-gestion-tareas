import { createContext, useContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState(null);

  // SESSION
  useEffect(() => {

    const storedUser =
      localStorage.getItem("currentUser");

    if (!storedUser || storedUser === "undefined") {
      return;
    }

    try {
      setCurrentUser(
        JSON.parse(storedUser)
      );
    } catch (error) {

      localStorage.removeItem(
        "currentUser"
      );

      console.error(
        "Usuario inválido en localStorage"
      );
    }

  }, []);

  // LOGIN
  const login = async (email, password) => {

    setAuthLoading(true);

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setAuthLoading(false);

        return {
          success: false,
          message: data.error,
        };
      }

      setCurrentUser(data);

      localStorage.setItem(
        "currentUser",
        JSON.stringify(data),
      );

      setAuthLoading(false);

      return {
        success: true,
      };

    } catch (error) {

      setAuthLoading(false);

      return {
        success: false,
        message: "Error de conexión",
      };
    }
  };

  // REGISTER
  const register = async (newUser) => {

    setAuthLoading(true);

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            nombre: newUser.nombre,
            apellido: newUser.apellido,
            email: newUser.email,
            password: newUser.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setAuthLoading(false);

        return {
          success: false,
          message: data.error,
        };
      }

      setAuthLoading(false);

      setAuthMessage({
        type: "success",
        text: "Cuenta creada correctamente",
      });

      return {
        success: true,
      };

    } catch (error) {

      setAuthLoading(false);

      return {
        success: false,
        message: "Error de conexión",
      };
    }
  };

  // UPDATE USER
  const updateCurrentUser = async (updatedData) => {

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${currentUser.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(updatedData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error,
        };
      }

      const updatedUser = {
        ...currentUser,
        ...updatedData,
      };

      setCurrentUser(updatedUser);

      localStorage.setItem(
        "currentUser",
        JSON.stringify(updatedUser),
      );

      return {
        success: true,
      };

    } catch (error) {

      return {
        success: false,
        error: "Error de conexión",
      };
    }
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
      login,
      register,
      logout,
      updateCurrentUser,

      authLoading,
      setAuthLoading,
      authMessage,
      setAuthMessage,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);