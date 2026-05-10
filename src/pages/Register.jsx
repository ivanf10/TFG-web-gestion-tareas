import { useState } from "react";

import { useAuth } from "../hooks/useAuth";

export default function Register({
  onBackToLogin,
}) {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const [errors, setErrors] = useState({});

  const handleRegister = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre =
        "Introduce un nombre";
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido =
        "Introduce los apellidos";
    }

    if (!formData.email.trim()) {
      newErrors.email =
        "Introduce un email";
    }

    if (!formData.contrasena.trim()) {
      newErrors.contrasena =
        "Introduce una contraseña";
    }

    if (
      formData.contrasena.length < 6
    ) {
      newErrors.contrasena =
        "Mínimo 6 caracteres";
    }

    if (
      formData.contrasena !==
      formData.confirmarContrasena
    ) {
      newErrors.confirmarContrasena =
        "Las contraseñas no coinciden";
    }

    setErrors(newErrors);

    if (
      Object.keys(newErrors).length > 0
    ) {
      return;
    }

    const result = register({
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      contrasena: formData.contrasena,
      departamento: "Sin asignar",
    });

    if (!result.success) {
      setErrors({
        general: result.message,
      });

      return;
    }

    alert(
      "Cuenta creada correctamente",
    );

    onBackToLogin();
  };

  return (
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
          maxWidth: "500px",
          borderRadius: "20px",
          boxShadow:
            "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <div className="card-body p-4 p-md-5">
          {/* LOGO */}
          <div className="text-center mb-4">
            <div className="d-flex align-items-center justify-content-center gap-3 mb-3">
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
              Crear Cuenta
            </h2>

            <p
              style={{
                fontSize: "14px",
                color: "#6b7280",
                marginBottom: 0,
              }}
            >
              Registra un nuevo usuario
            </p>
          </div>

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

          <div className="row">
            <div className="col-12 col-md-6 mb-3">
              <label style={labelStyle}>
                Nombre
              </label>

              <input
                type="text"
                className="form-control"
                value={formData.nombre}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nombre:
                      e.target.value,
                  })
                }
                style={{
                  ...inputStyle,
                  borderColor:
                    errors.nombre
                      ? "#ef4444"
                      : "#e5e7eb",
                }}
              />

              {errors.nombre && (
                <p style={errorStyle}>
                  {errors.nombre}
                </p>
              )}
            </div>

            <div className="col-12 col-md-6 mb-3">
              <label style={labelStyle}>
                Apellidos
              </label>

              <input
                type="text"
                className="form-control"
                value={
                  formData.apellido
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    apellido:
                      e.target.value,
                  })
                }
                style={{
                  ...inputStyle,
                  borderColor:
                    errors.apellido
                      ? "#ef4444"
                      : "#e5e7eb",
                }}
              />

              {errors.apellido && (
                <p style={errorStyle}>
                  {errors.apellido}
                </p>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label style={labelStyle}>
              Correo Electrónico
            </label>

            <input
              type="email"
              className="form-control"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email:
                    e.target.value,
                })
              }
              style={{
                ...inputStyle,
                borderColor:
                  errors.email
                    ? "#ef4444"
                    : "#e5e7eb",
              }}
            />

            {errors.email && (
              <p style={errorStyle}>
                {errors.email}
              </p>
            )}
          </div>

          <div className="mb-3">
            <label style={labelStyle}>
              Contraseña
            </label>

            <input
              type="password"
              className="form-control"
              value={
                formData.contrasena
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contrasena:
                    e.target.value,
                })
              }
              style={{
                ...inputStyle,
                borderColor:
                  errors.contrasena
                    ? "#ef4444"
                    : "#e5e7eb",
              }}
            />

            {errors.contrasena && (
              <p style={errorStyle}>
                {errors.contrasena}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label style={labelStyle}>
              Confirmar Contraseña
            </label>

            <input
              type="password"
              className="form-control"
              value={
                formData.confirmarContrasena
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmarContrasena:
                    e.target.value,
                })
              }
              style={{
                ...inputStyle,
                borderColor:
                  errors.confirmarContrasena
                    ? "#ef4444"
                    : "#e5e7eb",
              }}
            />

            {errors.confirmarContrasena && (
              <p style={errorStyle}>
                {
                  errors.confirmarContrasena
                }
              </p>
            )}
          </div>

          <button
            onClick={handleRegister}
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
              marginBottom: "14px",
            }}
          >
            Crear Cuenta
          </button>

          <button
            onClick={onBackToLogin}
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
            }}
          >
            Volver al Login
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#111827",
  display: "block",
  marginBottom: "8px",
};

const inputStyle = {
  borderRadius: "8px",
  fontSize: "14px",
  padding: "12px",
};

const errorStyle = {
  color: "#ef4444",
  fontSize: "12px",
  marginTop: "6px",
  marginBottom: 0,
};