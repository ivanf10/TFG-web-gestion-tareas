import { useState } from "react";
import { Edit, Trash2, Search } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Departments({
  allDepartments,
  allUsers,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  setIsMobileMenuOpen,
}) {

  const { currentUser } = useAuth();

  // MODALES
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false);
  const [showDepartmentDetailModal, setShowDepartmentDetailModal] = useState(false);

  // CREAR DEPARTAMENTO
  const [newDepartment, setNewDepartment] = useState({
    nombre: "",
    descripcion: "",
  });

  const [departmentMembers, setDepartmentMembers] = useState([]);
  const [memberSearch, setMemberSearch] = useState("");

  // EDITAR DEPARTAMENTO
  const [editingDepartment, setEditingDepartment] = useState(null);

  const [editDepartmentFormData, setEditDepartmentFormData] = useState({
    nombre: "",
    descripcion: "",
  });

  const [editDepartmentMembers, setEditDepartmentMembers] = useState([]);
  const [editMemberSearch, setEditMemberSearch] = useState("");

  // DETALLE
  const [selectedDepartmentForDetail, setSelectedDepartmentForDetail] =
    useState(null);

  // BUSCADOR
  const [departmentSearchQuery, setDepartmentSearchQuery] = useState("");

  const filteredDepartments = allDepartments.filter((dept) =>
    (dept.name || "")
      .toLowerCase()
      .includes(departmentSearchQuery.toLowerCase())
  );

  const filteredUsers = (allUsers || []).filter((user) => {
    const fullName =
      `${user.nombre} ${user.apellido}`;

    return (
      fullName
        .toLowerCase()
        .includes(memberSearch.toLowerCase()) &&
      !departmentMembers.includes(fullName)
    );
  });

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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
            Departamentos
          </h2>
        </div>

        {currentUser?.rol === "Admin" && (
          <button
            onClick={() => {
              setShowAddDepartmentModal(true);
              setNewDepartment({
                nombre: "",
                descripcion: "",
              });
              setDepartmentMembers([]);
              setMemberSearch("");
            }}
            className="btn btn-primary"
          >
            + Añadir Departamento
          </button>
        )}
      </div>

      <div
        className="card rounded-2xl border-0"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
      >
        <div className="card-body p-3 p-md-4">

          {/* CONTENT */}
          {filteredDepartments.length === 0 ? (
            <div
              style={{
                minHeight: "420px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Search size={28} color="#9ca3af" />
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: "6px",
                    }}
                  >
                    {allDepartments.length === 0
                      ? "No hay departamentos registrados"
                      : "No se encontraron departamentos"}
                  </h3>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: 0,
                    }}
                  >
                    {allDepartments.length === 0
                      ? "Crea tu primer departamento para comenzar."
                      : "Prueba con otros términos de búsqueda."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* SEARCH */}
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
                  value={departmentSearchQuery}
                  onChange={(e) => setDepartmentSearchQuery(e.target.value)}
                />
              </div>

              {/* TABLE */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                      <th style={thStyle}>NOMBRE DEL DEPARTAMENTO</th>
                      <th style={thStyle}>Nº DE EMPLEADOS</th>

                      {currentUser?.rol === "Admin" && (
                        <th style={thStyle}>ACCIONES</th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDepartments.map((dept, idx) => (
                      <tr
                        key={dept.id}
                        style={{
                          borderBottom:
                            idx !== filteredDepartments.length - 1
                              ? "1px solid #f3f4f6"
                              : "none",
                        }}
                      >
                        <td
                          onClick={() => {
                            setSelectedDepartmentForDetail(dept);
                            setShowDepartmentDetailModal(true);
                          }}
                          style={tdClickable}
                        >
                          {dept.name}
                        </td>

                        <td
                          onClick={() => {
                            setSelectedDepartmentForDetail(dept);
                            setShowDepartmentDetailModal(true);
                          }}
                          style={tdClickableSecondary}
                        >
                          {dept.employees}
                        </td>

                        {currentUser?.rol === "Admin" && (
                          <td style={{ padding: "16px 12px" }}>
                            <div style={{ display: "flex", gap: "8px" }}>

                              {/* EDIT */}
                              <button
                                onClick={() => {
                                  setEditingDepartment(dept);
                                  setEditDepartmentFormData({
                                    nombre: dept.name,
                                    descripcion: dept.description || "",
                                  });
                                  setEditDepartmentMembers(dept.members || []);
                                  setShowEditDepartmentModal(true);
                                }}
                                style={iconBtn}
                                title="Editar departamento"
                              >
                                <Edit size={16} />
                              </button>

                              {/* DELETE */}
                              <button
                                onClick={() => {
                                  if (window.confirm("¿Eliminar departamento?")) {
                                    deleteDepartment(dept.id);
                                  }
                                }}
                                style={{ ...iconBtn, color: "#ef4444" }}
                                title="Eliminar departamento"
                              >
                                <Trash2 size={16} />
                              </button>

                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

        </div>
      </div>
      {/* Add Department Modal */}
      {showAddDepartmentModal && (
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
          onClick={() => setShowAddDepartmentModal(false)}
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
                    Nuevo Departamento
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: 0,
                    }}
                  >
                    Completa los detalles para crear un nuevo departamento.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddDepartmentModal(false)}
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
                    Nombre del Departamento{" "}
                    <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Recursos Humanos"
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      borderColor: "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                    }}
                    value={newDepartment.nombre}
                    onChange={(e) =>
                      setNewDepartment({
                        ...newDepartment,
                        nombre: e.target.value,
                      })
                    }
                  />
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
                    Descripción
                  </label>
                  <textarea
                    placeholder="Describe brevemente las responsabilidades de este departamento..."
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      borderColor: "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                      minHeight: "100px",
                      resize: "vertical",
                    }}
                    value={newDepartment.descripcion}
                    onChange={(e) =>
                      setNewDepartment({
                        ...newDepartment,
                        descripcion: e.target.value,
                      })
                    }
                  />
                </div>

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
                    Asignar Miembros
                  </label>

                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        border: "1px solid #e5e7eb",
                        backgroundColor: "#f9fafb",
                        minHeight: "44px",
                        alignItems: "center",
                      }}
                    >
                      {departmentMembers.map((member) => (
                        <div
                          key={member}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor: "#dbeafe",
                            color: "#1e40af",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          {member}

                          <button
                            type="button"
                            onClick={() =>
                              setDepartmentMembers(
                                departmentMembers.filter(
                                  (m) => m !== member,
                                ),
                              )
                            }
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "#1e40af",
                              fontSize: "16px",
                              padding: 0,
                              marginLeft: "2px",
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      <input
                        type="text"
                        placeholder={
                          departmentMembers.length === 0
                            ? "Buscar usuarios..."
                            : ""
                        }
                        className="form-control"
                        style={{
                          border: "none",
                          outline: "none",
                          padding: 0,
                          fontSize: "14px",
                          flex: 1,
                          minWidth: "150px",
                          backgroundColor: "transparent",
                          boxShadow: "none",
                        }}
                        value={memberSearch}
                        onChange={(e) =>
                          setMemberSearch(e.target.value)
                        }
                      />

                      <button
                        type="button"
                        style={{
                          background: "none",
                          border: "none",
                          color: "#6b7280",
                          display: "flex",
                          alignItems: "center",
                          padding: "4px",
                        }}
                      >
                        <Search size={18} />
                      </button>
                    </div>

                    {/* DROPDOWN */}
                    {memberSearch &&
                      filteredUsers.length > 0 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            marginTop: "6px",
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow:
                              "0 10px 25px rgba(0,0,0,0.08)",
                            zIndex: 50,
                            overflow: "hidden",
                          }}
                        >
                          {filteredUsers.map((user) => {
                            const fullName =
                              `${user.nombre} ${user.apellido}`;

                            return (
                              <button
                                key={user.id}
                                type="button"
                                onClick={() => {
                                  setDepartmentMembers([
                                    ...departmentMembers,
                                    fullName,
                                  ]);

                                  setMemberSearch("");
                                }}
                                style={{
                                  width: "100%",
                                  border: "none",
                                  background: "white",
                                  padding: "10px 12px",
                                  textAlign: "left",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "#f9fafb")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    "white")
                                }
                              >
                                <div
                                  style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    backgroundColor: "#dbeafe",
                                    color: "#2563eb",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px",
                                    fontWeight: "700",
                                    flexShrink: 0,
                                  }}
                                >
                                  {user.nombre.charAt(0)}
                                  {user.apellido.charAt(0)}
                                </div>

                                <div>
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "14px",
                                      fontWeight: "500",
                                      color: "#111827",
                                    }}
                                  >
                                    {fullName}
                                  </p>

                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "12px",
                                      color: "#6b7280",
                                    }}
                                  >
                                    {user.departamento}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
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
                    onClick={() => setShowAddDepartmentModal(false)}
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
                        if (!newDepartment.nombre.trim()) {
                        alert("Por favor, ingresa un nombre para el departamento.");
                        return;
                        }

                        addDepartment({
                        ...newDepartment,
                        members: departmentMembers,
                        });

                        setShowAddDepartmentModal(false);

                        setNewDepartment({ nombre: "", descripcion: "" });
                        setDepartmentMembers([]);
                        setMemberSearch("");
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
                    Guardar
                    </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Edit Department Modal */}
      {showEditDepartmentModal && editingDepartment && (
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
          onClick={() => setShowEditDepartmentModal(false)}
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
                    Editar Departamento
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: 0,
                    }}
                  >
                    Actualiza los detalles del departamento.
                  </p>
                </div>
                <button
                  onClick={() => setShowEditDepartmentModal(false)}
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
                    Nombre del Departamento{" "}
                    <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Recursos Humanos"
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      borderColor: "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                    }}
                    value={editDepartmentFormData.nombre}
                    onChange={(e) =>
                      setEditDepartmentFormData({
                        ...editDepartmentFormData,
                        nombre: e.target.value,
                      })
                    }
                  />
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
                    Descripción
                  </label>
                  <textarea
                    placeholder="Describe brevemente las responsabilidades de este departamento..."
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      borderColor: "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                      minHeight: "100px",
                      resize: "vertical",
                    }}
                    value={editDepartmentFormData.descripcion}
                    onChange={(e) =>
                      setEditDepartmentFormData({
                        ...editDepartmentFormData,
                        descripcion: e.target.value,
                      })
                    }
                  />
                </div>

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
                    Asignar Miembros
                  </label>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      padding: "10px 12px",
                      borderRadius: "6px",
                      borderColor: "#e5e7eb",
                      border: "1px solid #e5e7eb",
                      backgroundColor: "#f9fafb",
                      minHeight: "44px",
                      alignItems: "center",
                    }}
                  >
                    {editDepartmentMembers.map((member) => (
                      <div
                        key={member}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        {member}
                        <button
                          type="button"
                          onClick={() =>
                            setEditDepartmentMembers(
                              editDepartmentMembers.filter(
                                (m) => m !== member,
                              ),
                            )
                          }
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#1e40af",
                            fontSize: "16px",
                            padding: "0",
                            marginLeft: "2px",
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <input
                      type="text"
                      placeholder={
                        editDepartmentMembers.length === 0
                          ? "Buscar usuarios..."
                          : ""
                      }
                      className="form-control"
                      style={{
                        border: "none",
                        outline: "none",
                        padding: "0",
                        fontSize: "14px",
                        flex: "1",
                        minWidth: "150px",
                        backgroundColor: "transparent",
                      }}
                      value={editMemberSearch}
                      onChange={(e) => setEditMemberSearch(e.target.value)}
                      onKeyPress={(e) => {
                        if (
                          e.key === "Enter" &&
                          editMemberSearch.trim() &&
                          !editDepartmentMembers.includes(
                            editMemberSearch.trim(),
                          )
                        ) {
                          e.preventDefault();
                          setEditDepartmentMembers([
                            ...editDepartmentMembers,
                            editMemberSearch.trim(),
                          ]);
                          setEditMemberSearch("");
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          editMemberSearch.trim() &&
                          !editDepartmentMembers.includes(
                            editMemberSearch.trim(),
                          )
                        ) {
                          setEditDepartmentMembers([
                            ...editDepartmentMembers,
                            editMemberSearch.trim(),
                          ]);
                          setEditMemberSearch("");
                        }
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#6b7280",
                        padding: "4px 8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Search size={18} />
                    </button>
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
                    onClick={() => setShowEditDepartmentModal(false)}
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
                      if (!editDepartmentFormData.nombre.trim()) {
                        alert("Por favor, ingresa un nombre para el departamento.");
                        return;
                      }

                      updateDepartment({
                        id: editingDepartment.id,
                        name: editDepartmentFormData.nombre,
                        description: editDepartmentFormData.descripcion,
                        members: editDepartmentMembers,
                      });

                      setShowEditDepartmentModal(false);
                      setEditingDepartment(null);

                      setEditDepartmentFormData({
                        nombre: "",
                        descripcion: "",
                      });
                      setEditDepartmentMembers([]);
                      setEditMemberSearch("");
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
      {/* Department Detail Modal */}
      {showDepartmentDetailModal && selectedDepartmentForDetail && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1050,
          }}
          onClick={() => setShowDepartmentDetailModal(false)}
        >
          <div
            className="card rounded-3"
            style={{
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "24px",
                borderBottom: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4
                style={{
                  marginBottom: 0,
                  color: "#111827",
                  fontWeight: "600",
                }}
              >
                {selectedDepartmentForDetail.name}
              </h4>
              <button
                onClick={() => setShowDepartmentDetailModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "24px",
                  color: "#6b7280",
                  cursor: "pointer",
                  padding: "0",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "24px" }}>
              <div
                style={{
                  marginBottom: "24px",
                }}
              >
                <h5
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "8px",
                  }}
                >
                  Descripción
                </h5>
                <p
                  style={{
                    color: "#4b5563",
                    lineHeight: "1.6",
                    fontSize: "14px",
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    margin: 0,
                  }}
                >
                  {selectedDepartmentForDetail.description ||
                    "Sin descripción"}
                </p>
              </div>

              <div
                style={{
                  marginBottom: "24px",
                }}
              >
                <h5
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#6b7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    marginBottom: "12px",
                  }}
                >
                  Miembros del Departamento
                </h5>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {selectedDepartmentForDetail.members &&
                  selectedDepartmentForDetail.members.length > 0 ? (
                    selectedDepartmentForDetail.members.map((member) => (
                      <div
                        key={member}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          backgroundColor: "#dbeafe",
                          color: "#1e40af",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "500",
                        }}
                      >
                        {member}
                      </div>
                    ))
                  ) : (
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                        margin: 0,
                      }}
                    >
                      No hay miembros asignados
                    </p>
                  )}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 0 0 0",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                  }}
                >
                  <strong>
                    {selectedDepartmentForDetail.members?.length || 0}
                  </strong>{" "}
                  empleado
                  {(selectedDepartmentForDetail.members?.length || 0) !== 1 ? "s" : ""}
                </div>
                <button
                  onClick={() => setShowDepartmentDetailModal(false)}
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// estilos reutilizados 
const thStyle = {
  textAlign: "left",
  padding: "12px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const tdClickable = {
  padding: "16px 12px",
  fontSize: "14px",
  color: "#111827",
  fontWeight: "500",
  cursor: "pointer",
};

const tdClickableSecondary = {
  padding: "16px 12px",
  fontSize: "14px",
  color: "#4b5563",
  cursor: "pointer",
};

const iconBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "4px 8px",
  color: "#6b7280",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};