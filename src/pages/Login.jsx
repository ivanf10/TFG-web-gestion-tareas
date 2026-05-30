import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Login({
    onShowRegister,
}) {
  const {
    login,
    authLoading,
  } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Introduce un email";
    }

    if (!formData.password.trim()) {
      newErrors.password =
        "Introduce una contraseña";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const result = await login(
      formData.email,
      formData.password,
    );

    if (!result.success) {

      setErrors({
        general: result.message,
      });

      return;
    }
  };

  return (
    <>
      {authLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "32px",
              borderRadius: "20px",
              minWidth: "280px",
              textAlign: "center",
              boxShadow:
                "0 10px 40px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                border: "4px solid #e5e7eb",
                borderTop: "4px solid #2563eb",
                borderRadius: "999px",
                margin: "0 auto 18px",
                animation:
                  "spin 1s linear infinite",
              }}
            />

            <p
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              Iniciando sesión...
            </p>
          </div>
        </div>
      )}
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f9fafb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          className="card border-0"
          style={{
            width: "100%",
            maxWidth: "460px",
            borderRadius: "20px",
            boxShadow:
              "0 10px 40px rgba(0,0,0,0.08)",
          }}
        >
          <div className="card-body p-4 p-md-5">
            {/* LOGO */}
            <div className="text-center mb-4">
              <div
                className="d-flex align-items-center justify-content-center gap-3 mb-3"
              >
                <img
                  src="/logo.png"
                  alt="OPTI TASK"
                  style={{
                    width: "80px",
                    height: "80px",
                  }}
                />

                <div>
                  <h1
                    style={{
                      fontSize: "34px",
                      fontWeight: "700",
                      marginBottom: "2px",
                      fontFamily:
                        "Dela Gothic One",
                      whiteSpace: "nowrap",
                      color: "#111827",
                    }}
                  >
                    OPTI TASK
                  </h1>

                  <p
                    style={{
                      fontSize: "18px",
                      color: "#6b7280",
                      marginBottom: 0,
                    }}
                  >
                    Gestión de Tareas
                  </p>
                </div>
              </div>

              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: "6px",
                }}
              >
                Iniciar Sesión
              </h2>

              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginBottom: 0,
                }}
              >
                Accede a tu cuenta para continuar
              </p>
            </div>

            {/* ERROR */}
            {errors.general && (
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#fee2e2",
                  color: "#dc2626",
                  borderRadius: "8px",
                  fontSize: "14px",
                  marginBottom: "20px",
                }}
              >
                {errors.general}
              </div>
            )}

            {/* EMAIL */}
            <div className="mb-3">
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#111827",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Correo Electrónico
              </label>

              <input
                type="email"
                className="form-control"
                placeholder="Ej. admin@optitask.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                style={{
                  borderRadius: "8px",
                  borderColor: errors.email
                    ? "#ef4444"
                    : "#e5e7eb",
                  fontSize: "14px",
                  padding: "12px",
                }}
              />

              {errors.email && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "6px",
                    marginBottom: 0,
                  }}
                >
                  {errors.email}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mb-4">
              <label
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#111827",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                Contraseña
              </label>

              <input
                type="password"
                className="form-control"
                placeholder="Tu contraseña"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                style={{
                  borderRadius: "8px",
                  borderColor: errors.password
                    ? "#ef4444"
                    : "#e5e7eb",
                  fontSize: "14px",
                  padding: "12px",
                }}
              />

              {errors.password && (
                <p
                  style={{
                    color: "#ef4444",
                    fontSize: "12px",
                    marginTop: "6px",
                    marginBottom: 0,
                  }}
                >
                  {errors.password}
                </p>
              )}
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              style={{
                width: "100%",
                padding: "12px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#2563eb",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Entrar
            </button>

            <button
              onClick={onShowRegister}
              style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  color: "#4b5563",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                  marginTop: "12px",
              }}
              >
              Crear Cuenta
              </button>
          </div>
        </div>
      </div>
    </>
  );
}