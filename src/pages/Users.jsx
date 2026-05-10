import { useState } from "react";
import { Edit, Trash2, } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Users({
  allUsers,

  addUser,
  updateUser,
  deleteUser,

  allDepartments,

  setIsMobileMenuOpen,

  showAddUserModal,
  setShowAddUserModal,

  selectedUserForDetail,
  setSelectedUserForDetail,

  showUserDetailModal,
  setShowUserDetailModal,

  editingUser,
  setEditingUser,

  showEditUserModal,
  setShowEditUserModal,

  editUserFormData,
  setEditUserFormData,
}) {

  const { currentUser } = useAuth();

  const [userSearchQuery, setUserSearchQuery] = useState("");

  const [newUser, setNewUser] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contrasena: "",
    departamento: "",
    rol: "Usuario",
    });

  const [userErrors, setUserErrors] = useState({});
  const [editUserErrors, setEditUserErrors] = useState({});

  const validateUserForm = () => {
    const errors = {};

    // Nombre
    if (!newUser.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    } else if (newUser.nombre.trim().length < 2) {
      errors.nombre = "Mínimo 2 caracteres";
    }

    // Apellido
    if (!newUser.apellido.trim()) {
      errors.apellido = "Los apellidos son obligatorios";
    }

    // Email
    if (!newUser.email.trim()) {
      errors.email = "El email es obligatorio";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)
    ) {
      errors.email = "Formato de email inválido";
    }

    // Contraseña
    if (!newUser.contrasena.trim()) {
      errors.contrasena = "La contraseña es obligatoria";
    } else if (newUser.contrasena.length < 6) {
      errors.contrasena =
        "La contraseña debe tener mínimo 6 caracteres";
    }

    // Departamento
    if (!newUser.departamento) {
      errors.departamento =
        "Selecciona un departamento";
    }

    // Rol
    if (!newUser.rol) {
      errors.rol = "Selecciona un tipo de usuario";
    }

    setUserErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const validateEditUserForm = () => {
    const errors = {};

    if (!editUserFormData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    }

    if (!editUserFormData.apellido.trim()) {
      errors.apellido = "El apellido es obligatorio";
    }

    if (!editUserFormData.email.trim()) {
      errors.email = "El email es obligatorio";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        editUserFormData.email,
      )
    ) {
      errors.email = "Introduce un email válido";
    }

    if (!editUserFormData.departamento) {
      errors.departamento =
        "Selecciona un departamento";
    }

    if (!editUserFormData.rol) {
      errors.rol = "Selecciona un rol";
    }

    setEditUserErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const [userDepartmentSearch, setUserDepartmentSearch] =
    useState("");

  if (currentUser?.rol !== "Admin") {
    return null;
  }  

  return (
    <div className="p-3 p-md-5">
    <div className="d-flex align-items-center justify-content-between mb-3 mb-md-5">
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn d-md-none"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          style={{
            padding: "8px",
            backgroundColor: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Menú"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              color="#6b7280"
            />
          </svg>
        </button>

        <h2
          style={{
            fontSize: "clamp(18px, 5vw, 24px)",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "0",
          }}
        >
          Usuarios
        </h2>
      </div>

      <button
        onClick={() => {
          setShowAddUserModal(true);

          setNewUser({
            nombre: "",
            apellido: "",
            email: "",
            contrasena: "",
            departamento: "",
            rol: "Usuario",
          });

          setUserDepartmentSearch("");
        }}
        className="btn btn-primary"
        style={{
          padding: "8px 16px",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        + Añadir Usuario
      </button>
    </div>

    <div
      className="card rounded-2xl border-0"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
    >
      <div className="card-body p-3 p-md-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="form-control"
            style={{
              borderRadius: "6px",
              borderColor: "#e5e7eb",
              fontSize: "14px",
              maxWidth: "300px",
            }}
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  NOMBRE
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  APELLIDO/S
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  E-MAIL
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  DEPARTAMENTO ASIGNADO
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  TIPO DE USUARIO
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  ACCIONES
                </th>
              </tr>
            </thead>

            <tbody>
              {allUsers
                .filter((user) =>
                  `${user.nombre} ${user.apellido}`
                    .toLowerCase()
                    .includes(userSearchQuery.toLowerCase()),
                )
                .map((user, idx) => {
                  return (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom:
                          idx !== allUsers.length - 1
                            ? "1px solid #f3f4f6"
                            : "none",
                      }}
                    >
                      <td
                        onClick={() => {
                          setSelectedUserForDetail(user);
                          setShowUserDetailModal(true);
                        }}
                        style={{
                          padding: "16px 12px",
                          fontSize: "14px",
                          color: "#111827",
                          fontWeight: "500",
                          cursor: "pointer",
                        }}
                      >
                        {user.nombre}
                      </td>

                      <td
                        onClick={() => {
                          setSelectedUserForDetail(user);
                          setShowUserDetailModal(true);
                        }}
                        style={{
                          padding: "16px 12px",
                          fontSize: "14px",
                          color: "#4b5563",
                          cursor: "pointer",
                        }}
                      >
                        {user.apellido}
                      </td>

                      <td
                        onClick={() => {
                          setSelectedUserForDetail(user);
                          setShowUserDetailModal(true);
                        }}
                        style={{
                          padding: "16px 12px",
                          fontSize: "14px",
                          color: "#4b5563",
                          cursor: "pointer",
                        }}
                      >
                        {user.email}
                      </td>

                      <td
                        onClick={() => {
                          setSelectedUserForDetail(user);
                          setShowUserDetailModal(true);
                        }}
                        style={{
                          padding: "16px 12px",
                          fontSize: "14px",
                          color: "#4b5563",
                          cursor: "pointer",
                        }}
                      >
                        {user.departamento}
                      </td>

                      <td
                        onClick={() => {
                          setSelectedUserForDetail(user);
                          setShowUserDetailModal(true);
                        }}
                        style={{
                          padding: "16px 12px",
                          fontSize: "14px",
                          color: "#4b5563",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor:
                              user.rol === "Admin"
                                ? "#ede9fe"
                                : "#f0fdf4",
                            color:
                              user.rol === "Admin"
                                ? "#7c3aed"
                                : "#16a34a",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          {user.rol}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "16px 12px",
                          fontSize: "14px",
                        }}
                      >
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => {
                              setEditingUser(user);

                              setEditUserFormData({
                                nombre: user.nombre,
                                apellido: user.apellido,
                                email: user.email,
                                departamento: user.departamento,
                                rol: user.rol,
                              });

                              setShowEditUserModal(true);
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px 8px",
                              color: "#6b7280",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            title="Editar usuario"
                          >
                            <Edit size={16} />
                          </button>

                          <button
                            onClick={() => {
                              if (
                                window.confirm(
                                  "¿Seguro que quieres eliminar este usuario?",
                                )
                              ) {
                                deleteUser(selectedUserForDetail.id);

                                setShowUserDetailModal(false);
                                setSelectedUserForDetail(null);
                              }
                            }}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px 8px",
                              color: "#ef4444",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            title="Eliminar usuario"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    {/* Add User Modal */}
      {showAddUserModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => {
            setShowAddUserModal(false);

            setUserErrors({});

            setNewUser({
              nombre: "",
              apellido: "",
              email: "",
              contrasena: "",
              departamento: "",
              rol: "Usuario",
            });
        }}
        >
          <div
            className="card rounded-3"
            style={{
              width: "90%",
              maxWidth: "600px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      marginBottom: "4px",
                      color: "#111827",
                    }}
                  >
                    Nuevo Usuario
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: 0,
                    }}
                  >
                    Completa los detalles para crear un nuevo usuario.
                  </p>
                </div>
                <button
                  onClick={() => {
                      setShowAddUserModal(false);

                      setUserErrors({});

                      setNewUser({
                        nombre: "",
                        apellido: "",
                        email: "",
                        contrasena: "",
                        departamento: "",
                        rol: "Usuario",
                      });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#6b7280",
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>

              <form>
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
                    Nombre <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Carlos"
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      borderColor: userErrors.nombre
                      ? "#ef4444"
                      : "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                    }}
                    value={newUser.nombre}
                    onChange={(e) =>
                      setNewUser({ ...newUser, nombre: e.target.value })
                    }
                  />
                  {userErrors.nombre && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "6px",
                        marginBottom: "0",
                      }}
                    >
                      {userErrors.nombre}
                    </p>
                  )}
                </div>

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
                    Apellido/s <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Rodríguez García"
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      borderColor: userErrors.apellido
                      ? "#ef4444"
                      : "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                    }}
                    value={newUser.apellido}
                    onChange={(e) =>
                      setNewUser({ ...newUser, apellido: e.target.value })
                    }
                  />
                  {userErrors.apellido && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "6px",
                        marginBottom: "0",
                      }}
                    >
                      {userErrors.apellido}
                    </p>
                  )}
                </div>

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
                    E-Mail <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="Ej. carlos@company.com"
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      borderColor: userErrors.email
                      ? "#ef4444"
                      : "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                    }}
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                  {userErrors.email && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "6px",
                        marginBottom: "0",
                      }}                    >
                      {userErrors.email}
                    </p>
                  )}
                </div>

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
                    Contraseña <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Contraseña segura"
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      borderColor: userErrors.contrasena
                      ? "#ef4444"
                      : "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                    }}
                    value={newUser.contrasena}
                    onChange={(e) =>
                      setNewUser({ ...newUser, contrasena: e.target.value })
                    }
                  />
                  {userErrors.contrasena && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "6px",
                        marginBottom: "0",
                      }}
                    >
                      {userErrors.contrasena}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                  <label
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#111827",
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Departamento Asignado{" "}
                    <span style={{ color: "#ef4444" }}>*</span>
                  </label>

                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <select
                      className="form-control"
                      style={{
                        borderRadius: "6px",
                        borderColor: userErrors.departamento
                          ? "#ef4444"
                          : "#e5e7eb",
                        fontSize: "14px",
                        padding: "10px 12px",
                        paddingRight: "32px",
                        appearance: "none",
                        backgroundColor: "white",
                        cursor: "pointer",
                        height: "44px",
                        width: "100%",
                      }}
                      value={newUser.departamento}
                      onChange={(e) =>
                        setNewUser({
                          ...newUser,
                          departamento: e.target.value,
                        })
                      }
                    >
                      <option value="">Seleccionar departamento</option>

                      {allDepartments.map((department) => (
                        <option
                          key={department.id}
                          value={department.name}
                        >
                          {department.name}
                        </option>
                      ))}
                    </select>

                    <svg
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "18px",
                        height: "18px",
                        pointerEvents: "none",
                        color: "#6b7280",
                      }}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.5 7.5L10 12L14.5 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#111827",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Tipo de Usuario <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <select
                        className="form-control"
                        style={{
                          borderRadius: "6px",
                          borderColor: userErrors.rol ? "#ef4444" : "#e5e7eb",
                          fontSize: "14px",
                          padding: "10px 12px",
                          paddingRight: "32px",
                          appearance: "none",
                          backgroundColor: "white",
                          cursor: "pointer",
                          height: "44px",
                          width: "100%",
                        }}
                        value={newUser.rol}
                        onChange={(e) =>
                          setNewUser({ ...newUser, rol: e.target.value })
                        }
                      >
                        <option value="Usuario">Usuario</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <svg
                        style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "18px",
                          height: "18px",
                          pointerEvents: "none",
                          color: "#6b7280",
                        }}
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.5 7.5L10 12L14.5 7.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "16px",
                    display: "flex",
                    gap: "12px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddUserModal(false);

                      setUserErrors({});

                      setNewUser({
                        nombre: "",
                        apellido: "",
                        email: "",
                        contrasena: "",
                        departamento: "",
                        rol: "Usuario",
                      });
                    }}
                    style={{
                      padding: "10px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      backgroundColor: "#f3f4f6",
                      color: "#4b5563",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const isValid = validateUserForm();

                      if (!isValid) return;

                      addUser(newUser);

                      setShowAddUserModal(false);

                      setNewUser({
                        nombre: "",
                        apellido: "",
                        email: "",
                        contrasena: "",
                        departamento: "",
                        rol: "Usuario",
                      });

                      setUserErrors({});
                    }}
                    style={{
                      padding: "10px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Guardar Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserDetailModal && selectedUserForDetail && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => {
            setShowUserDetailModal(false);
            setSelectedUserForDetail(null);
          }}
        >
          <div
            className="card rounded-3"
            style={{
              width: "90%",
              maxWidth: "600px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-body p-4">
              {/* HEADER */}
              <div className="d-flex justify-content-end mb-2">
                <button
                  onClick={() => {
                    setShowUserDetailModal(false);
                    setSelectedUserForDetail(null);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#6b7280",
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </div>

              {/* PERFIL */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  marginBottom: "32px",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#dbeafe",
                    color: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "30px",
                    fontWeight: "700",
                    marginBottom: "16px",
                  }}
                >
                  {selectedUserForDetail.nombre.charAt(0)}
                  {selectedUserForDetail.apellido.charAt(0)}
                </div>

                <h2
                  style={{
                    fontSize: "26px",
                    fontWeight: "700",
                    color: "#111827",
                    marginBottom: "6px",
                  }}
                >
                  {selectedUserForDetail.nombre}{" "}
                  {selectedUserForDetail.apellido}
                </h2>

                <p
                  style={{
                    fontSize: "15px",
                    color: "#6b7280",
                    marginBottom: "16px",
                  }}
                >
                  {selectedUserForDetail.email}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      backgroundColor:
                        selectedUserForDetail.rol === "Admin"
                          ? "#ede9fe"
                          : "#dcfce7",
                      color:
                        selectedUserForDetail.rol === "Admin"
                          ? "#7c3aed"
                          : "#15803d",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    {selectedUserForDetail.rol}
                  </span>

                  <span
                    style={{
                      display: "inline-block",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      backgroundColor: "#dcfce7",
                      color: "#15803d",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    Activo
                  </span>
                </div>

                <p
                  style={{
                    fontSize: "14px",
                    color: "#4b5563",
                    marginBottom: 0,
                  }}
                >
                  {selectedUserForDetail.departamento}
                </p>
              </div>

              {/* INFORMACIÓN */}
              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "24px",
                  marginBottom: "24px",
                }}
              >
                <div className="row g-4">
                  <div className="col-6">
                    <h3
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "8px",
                      }}
                    >
                      Nombre
                    </h3>

                    <p
                      style={{
                        fontSize: "14px",
                        color: "#111827",
                        marginBottom: 0,
                      }}
                    >
                      {selectedUserForDetail.nombre}
                    </p>
                  </div>

                  <div className="col-6">
                    <h3
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "8px",
                      }}
                    >
                      Apellidos
                    </h3>

                    <p
                      style={{
                        fontSize: "14px",
                        color: "#111827",
                        marginBottom: 0,
                      }}
                    >
                      {selectedUserForDetail.apellido}
                    </p>
                  </div>

                  <div className="col-6">
                    <h3
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "8px",
                      }}
                    >
                      Correo Electrónico
                    </h3>

                    <p
                      style={{
                        fontSize: "14px",
                        color: "#111827",
                        marginBottom: 0,
                        wordBreak: "break-word",
                      }}
                    >
                      {selectedUserForDetail.email}
                    </p>
                  </div>

                  <div className="col-6">
                    <h3
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "8px",
                      }}
                    >
                      Departamento
                    </h3>

                    <p
                      style={{
                        fontSize: "14px",
                        color: "#111827",
                        marginBottom: 0,
                      }}
                    >
                      {selectedUserForDetail.departamento}
                    </p>
                  </div>
                </div>
              </div>

              {/* ACCIONES */}
              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        "¿Seguro que quieres eliminar este usuario?",
                      )
                    ) {
                      deleteUser(selectedUserForDetail.id);

                      setShowUserDetailModal(false);
                      setSelectedUserForDetail(null);
                    }
                  }}
                  style={{
                    padding: "10px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "transparent",
                    color: "#dc2626",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>

                <button
                  onClick={() => {
                    setEditingUser(selectedUserForDetail);

                    setEditUserFormData({
                      nombre: selectedUserForDetail.nombre,
                      apellido: selectedUserForDetail.apellido,
                      email: selectedUserForDetail.email,
                      departamento:
                        selectedUserForDetail.departamento,
                      rol: selectedUserForDetail.rol,
                    });

                    setShowUserDetailModal(false);
                    setShowEditUserModal(true);
                  }}
                  style={{
                    padding: "10px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Editar Usuario
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {showEditUserModal && editingUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
          }}
          onClick={() => {
            setShowEditUserModal(false);

            setEditUserErrors({});
          }}
        >
          <div
            className="card rounded-3"
            style={{
              width: "90%",
              maxWidth: "600px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-body p-4">
              {/* HEADER */}
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: "700",
                      marginBottom: "4px",
                      color: "#111827",
                    }}
                  >
                    Editar Usuario
                  </h2>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: 0,
                    }}
                  >
                    Modifica los datos del usuario.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowEditUserModal(false);

                    setEditUserErrors({});
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    color: "#6b7280",
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>

              <form>
                {/* NOMBRE */}
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
                    Nombre{" "}
                    <span style={{ color: "#ef4444" }}>
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      borderColor: editUserErrors.nombre
                        ? "#ef4444"
                        : "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                    }}
                    value={editUserFormData.nombre}
                    onChange={(e) =>
                      setEditUserFormData({
                        ...editUserFormData,
                        nombre: e.target.value,
                      })
                    }
                  />

                  {editUserErrors.nombre && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "6px",
                        marginBottom: 0,
                      }}
                    >
                      {editUserErrors.nombre}
                    </p>
                  )}
                </div>

                {/* APELLIDO */}
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
                    Apellido/s{" "}
                    <span style={{ color: "#ef4444" }}>
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      borderColor: editUserErrors.apellido
                        ? "#ef4444"
                        : "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                    }}
                    value={editUserFormData.apellido}
                    onChange={(e) =>
                      setEditUserFormData({
                        ...editUserFormData,
                        apellido: e.target.value,
                      })
                    }
                  />

                  {editUserErrors.apellido && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "6px",
                        marginBottom: 0,
                      }}
                    >
                      {editUserErrors.apellido}
                    </p>
                  )}
                </div>

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
                    E-Mail{" "}
                    <span style={{ color: "#ef4444" }}>
                      *
                    </span>
                  </label>

                  <input
                    type="email"
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      borderColor: editUserErrors.email
                        ? "#ef4444"
                        : "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                    }}
                    value={editUserFormData.email}
                    onChange={(e) =>
                      setEditUserFormData({
                        ...editUserFormData,
                        email: e.target.value,
                      })
                    }
                  />

                  {editUserErrors.email && (
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "12px",
                        marginTop: "6px",
                        marginBottom: 0,
                      }}
                    >
                      {editUserErrors.email}
                    </p>
                  )}
                </div>

                {/* SELECTS */}
                <div
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  {/* DEPARTAMENTO */}
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#111827",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Departamento
                    </label>

                    <select
                      className="form-control"
                      style={{
                        borderRadius: "6px",
                        borderColor:
                          editUserErrors.departamento
                            ? "#ef4444"
                            : "#e5e7eb",
                        fontSize: "14px",
                        padding: "10px 12px",
                        height: "44px",
                      }}
                      value={editUserFormData.departamento}
                      onChange={(e) =>
                        setEditUserFormData({
                          ...editUserFormData,
                          departamento: e.target.value,
                        })
                      }
                    >
                      <option value="">
                        Seleccionar departamento
                      </option>

                      {allDepartments.map((department) => (
                        <option
                          key={department.id}
                          value={department.name}
                        >
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ROL */}
                  <div style={{ flex: 1 }}>
                    <label
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#111827",
                        display: "block",
                        marginBottom: "8px",
                      }}
                    >
                      Tipo de Usuario
                    </label>

                    <select
                      className="form-control"
                      style={{
                        borderRadius: "6px",
                        borderColor: editUserErrors.rol
                          ? "#ef4444"
                          : "#e5e7eb",
                        fontSize: "14px",
                        padding: "10px 12px",
                        height: "44px",
                      }}
                      value={editUserFormData.rol}
                      onChange={(e) =>
                        setEditUserFormData({
                          ...editUserFormData,
                          rol: e.target.value,
                        })
                      }
                    >
                      <option value="Usuario">
                        Usuario
                      </option>

                      <option value="Admin">
                        Admin
                      </option>
                    </select>
                  </div>
                </div>

                {/* FOOTER */}
                <div
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "16px",
                    display: "flex",
                    gap: "12px",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditUserModal(false);

                      setEditUserErrors({});
                    }}
                    style={{
                      padding: "10px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      backgroundColor: "#f3f4f6",
                      color: "#4b5563",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const isValid =
                        validateEditUserForm();

                      if (!isValid) return;

                      updateUser({
                        ...editingUser,
                        ...editUserFormData,
                      });

                      setShowEditUserModal(false);

                      setEditUserErrors({});
                    }}
                    style={{
                      padding: "10px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      backgroundColor: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
  </div>
  );
}