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

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // LOGIN
  const login = async (email, contrasena) => {

    setAuthLoading(true);

    try {

      const response = await fetch(
        "http://localhost:3001/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password: contrasena,
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
        "http://localhost:3001/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            nombre: newUser.nombre,
            apellido: newUser.apellido,
            email: newUser.email,
            password: newUser.contrasena,
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