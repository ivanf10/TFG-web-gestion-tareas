import { useState } from "react";

import Layout from "./components/layout/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";

import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { currentUser } = useAuth();

  const [showRegister, setShowRegister] =
    useState(false);

  if (!currentUser) {
    return showRegister ? (
      <Register
        onBackToLogin={() =>
          setShowRegister(false)
        }
      />
    ) : (
      <Login
        onShowRegister={() =>
          setShowRegister(true)
        }
      />
    );
  }

  return <Layout />;
}