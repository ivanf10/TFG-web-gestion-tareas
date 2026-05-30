import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

export default function Account({
  setIsMobileMenuOpen,
  allDepartments,
}) {
  const [isEditingAccount, setIsEditingAccount] =
    useState(false);

  const {
    currentUser,
    updateCurrentUser,
    logout,
  } = useAuth();

	const [accountData, setAccountData] = useState(currentUser || {});

  // DATOS TEMPORALES DE EDICIÓN
  const [editAccountData, setEditAccountData] = useState(accountData);

	const [showPasswordModal, setShowPasswordModal] = useState(false);

	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	const [passwordErrors, setPasswordErrors] = useState({});

	const validatePasswordForm = () => {
		const errors = {};

		if (!passwordData.currentPassword.trim()) {
			errors.currentPassword =
				"La contraseña actual es obligatoria";
		}

		if (!passwordData.newPassword.trim()) {
			errors.newPassword =
				"La nueva contraseña es obligatoria";
		} else if (
			passwordData.newPassword.length < 6
		) {
			errors.newPassword =
				"Debe tener al menos 6 caracteres";
		}

		if (!passwordData.confirmPassword.trim()) {
			errors.confirmPassword =
				"Confirma la nueva contraseña";
		} else if (
			passwordData.newPassword !==
			passwordData.confirmPassword
		) {
			errors.confirmPassword =
				"Las contraseñas no coinciden";
		}

		setPasswordErrors(errors);

		return Object.keys(errors).length === 0;
	};

	const [showPasswords, setShowPasswords] =
		useState({
			current: false,
			new: false,
			confirm: false,
		});

  const changePassword = async (
    currentPassword,
    newPassword
  ) => {

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/change-password`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          userId: currentUser.id,
          currentPassword,
          newPassword,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error,
      };
    }

    return {
      success: true,
    };
  };  

  useEffect(() => {
    setAccountData(currentUser);
  }, [currentUser]);

  return (
    <div className="p-3 p-md-5">
      {/* HEADER */}
      <div className="d-flex align-items-center justify-content-between mb-3 mb-md-5">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn d-md-none"
            onClick={() =>
              setIsMobileMenuOpen((prev) => !prev)
            }
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
              marginBottom: 0,
            }}
          >
            Mi Cuenta
          </h2>
        </div>
      </div>

      <div className="row">
        {/* PERFIL */}
        <div className="col-12 col-lg-4 mb-4 mb-lg-0">
          <div
            className="card rounded-2xl border-0"
            style={{
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div className="card-body p-4">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {/* AVATAR */}
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
                    fontSize: "28px",
                    fontWeight: "700",
                    marginBottom: "16px",
                  }}
                >
                  {accountData.nombre?.charAt(0)}
                  {accountData.apellido?.charAt(0)}
                </div>

                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#111827",
                    marginBottom: "4px",
                  }}
                >
                  {accountData.nombre}{" "}
                  {accountData.apellido}
                </h3>

                <p
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginBottom: "12px",
                  }}
                >
                  {accountData.email}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      backgroundColor:
                        accountData.rol === "Admin"
                          ? "#ede9fe"
                          : "#dcfce7",
                      color:
                        accountData.rol === "Admin"
                          ? "#7c3aed"
                          : "#15803d",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    {accountData.rol}
                  </span>

                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      backgroundColor: "#d1fae5",
                      color: "#065f46",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    Activo
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  {accountData.departamentos?.length ? (
                    accountData.departamentos.map((dept) => (
                      <span
                        key={dept.id}
                        style={{
                          display: "inline-block",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          backgroundColor: "#eff6ff",
                          color: "#2563eb",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {dept.nombre}
                      </span>
                    ))
                  ) : (
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: "#f3f4f6",
                        color: "#6b7280",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      Sin asignar
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* INFORMACIÓN */}
        <div className="col-12 col-lg-8">
          <div
            className="card rounded-2xl border-0"
            style={{
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div className="card-body p-4">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  marginBottom: "24px",
                }}
              >
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#111827",
                    marginBottom: 0,
                  }}
                >
                  Perfil de Usuario
                </h3>

                <button
                  onClick={() => {

                    if (isEditingAccount) {

                      // CANCELAR
                      setEditAccountData({
                        nombre: currentUser.nombre,
                        apellido: currentUser.apellido,
                        email: currentUser.email,
                      });

                      setIsEditingAccount(false);

                    } else {

                      // ABRIR EDICIÓN
                      setEditAccountData({
                        nombre: currentUser.nombre,
                        apellido: currentUser.apellido,
                        email: currentUser.email,
                      });

                      setIsEditingAccount(true);
                    }
                  }}
                  style={{
                    padding: "8px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: isEditingAccount
                      ? "#ef4444"
                      : "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  {isEditingAccount ? "Cancelar" : "Editar"}
                </button>
              </div>

              {!isEditingAccount ? (
                <div>
                  {/* NOMBRE */}
                  <div
                    style={{
                      marginBottom: "20px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform:
                          "uppercase",
                        letterSpacing: "0.5px",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Nombre
                    </label>

                    <p
                      style={{
                        fontSize: "14px",
                        color: "#111827",
                        marginBottom: 0,
                      }}
                    >
                      {accountData.nombre}
                    </p>
                  </div>

                  {/* APELLIDOS */}
                  <div
                    style={{
                      marginBottom: "20px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform:
                          "uppercase",
                        letterSpacing: "0.5px",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Apellidos
                    </label>

                    <p
                      style={{
                        fontSize: "14px",
                        color: "#111827",
                        marginBottom: 0,
                      }}
                    >
                      {accountData.apellido}
                    </p>
                  </div>

                  {/* EMAIL */}
                  <div
                    style={{
                      marginBottom: "20px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform:
                          "uppercase",
                        letterSpacing: "0.5px",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Correo Electrónico
                    </label>

                    <p
                      style={{
                        fontSize: "14px",
                        color: "#111827",
                        marginBottom: 0,
                      }}
                    >
                      {accountData.email}
                    </p>
                  </div>

                  {/* ROL */}
                  <div
                    style={{
                      marginBottom: "20px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform:
                          "uppercase",
                        letterSpacing: "0.5px",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Tipo de Usuario
                    </label>

                    <p
                      style={{
                        fontSize: "14px",
                        color: "#111827",
                        marginBottom: 0,
                      }}
                    >
                      {accountData.rol}
                    </p>
                  </div>

                  {/* DEPARTAMENTO */}
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#6b7280",
                        textTransform:
                          "uppercase",
                        letterSpacing: "0.5px",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Departamentos
                    </label>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                      }}
                    >
                      {accountData.departamentos?.length ? (
                        accountData.departamentos.map((dept) => (
                          <span
                            key={dept.id}
                            style={{
                              display: "inline-block",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              backgroundColor: "#eff6ff",
                              color: "#2563eb",
                              fontSize: "12px",
                              fontWeight: "500",
                            }}
                          >
                            {dept.nombre}
                          </span>
                        ))
                      ) : (
                        <span
                          style={{
                            display: "inline-block",
                            padding: "4px 8px",
                            borderRadius: "4px",
                            backgroundColor: "#f3f4f6",
                            color: "#6b7280",
                            fontSize: "12px",
                            fontWeight: "500",
                          }}
                        >
                          Sin asignar
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
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
                      Nombre
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      style={{
                        borderRadius: "6px",
                        borderColor:
                          "#e5e7eb",
                        fontSize: "14px",
                        padding:
                          "10px 12px",
                      }}
                      value={
                        editAccountData.nombre
                      }
                      onChange={(e) =>
                        setEditAccountData({
                          ...editAccountData,
                          nombre:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* APELLIDOS */}
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
                      Apellidos
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      style={{
                        borderRadius: "6px",
                        borderColor:
                          "#e5e7eb",
                        fontSize: "14px",
                        padding:
                          "10px 12px",
                      }}
                      value={
                        editAccountData.apellido
                      }
                      onChange={(e) =>
                        setEditAccountData({
                          ...editAccountData,
                          apellido:
                            e.target.value,
                        })
                      }
                    />
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
                      Correo Electrónico
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      style={{
                        borderRadius: "6px",
                        borderColor:
                          "#e5e7eb",
                        fontSize: "14px",
                        padding:
                          "10px 12px",
                      }}
                      value={
                        editAccountData.email
                      }
                      onChange={(e) =>
                        setEditAccountData({
                          ...editAccountData,
                          email:
                            e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* BOTONES */}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      justifyContent:
                        "flex-end",
                    }}
                  >
                    <button
                      onClick={() => {
                        setEditAccountData(
                          accountData,
                        );

                        setIsEditingAccount(
                          false,
                        );
                      }}
                      style={{
                        padding: "10px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        backgroundColor:
                          "#f3f4f6",
                        color: "#4b5563",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Cancelar
                    </button>

                   <button
                      onClick={async () => {

                        const result =
                          await updateCurrentUser(
                            editAccountData
                          );

                        if (!result?.success) {
                          return;
                        }

                        setIsEditingAccount(false);
                      }}
                      style={{
                        padding: "10px 16px",
                        fontSize: "14px",
                        fontWeight: "500",
                        backgroundColor:
                          "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SEGURIDAD */}
          <div
            className="card rounded-2xl border-0 mt-4"
            style={{
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <div className="card-body p-4">
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: "20px",
                }}
              >
                Seguridad
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <button
                  onClick={() => {
                    setShowPasswordModal(true);
                  }}
                  style={{
                    padding: "10px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor: "transparent",
                    color: "#2563eb",
                    border: "1px solid #2563eb",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cambiar Contraseña
                </button>

                <button
                  onClick={() => {
										logout();
									}}
                  style={{
                    padding: "10px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                    backgroundColor:
                      "#fee2e2",
                    color: "#dc2626",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

			{/* CHANGE PASSWORD MODAL */}
			{showPasswordModal && (
				<div
					style={{
						position: "fixed",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor:
							"rgba(0,0,0,0.5)",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						zIndex: 2000,
					}}
					onClick={() => {
						setShowPasswordModal(false);

						setPasswordData({
							currentPassword: "",
							newPassword: "",
							confirmPassword: "",
						});

						setPasswordErrors({});
					}}
				>
					<div
						className="card rounded-3"
						style={{
							width: "90%",
							maxWidth: "500px",
							boxShadow:
								"0 10px 40px rgba(0,0,0,0.2)",
						}}
						onClick={(e) =>
							e.stopPropagation()
						}
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
										Cambiar Contraseña
									</h2>

									<p
										style={{
											fontSize: "14px",
											color: "#6b7280",
											marginBottom: 0,
										}}
									>
										Actualiza tu contraseña de acceso.
									</p>
								</div>

								<button
									onClick={() => {
										setShowPasswordModal(false);

										setPasswordData({
											currentPassword: "",
											newPassword: "",
											confirmPassword: "",
										});

										setPasswordErrors({});
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

							{/* ACTUAL */}
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
									Contraseña Actual
								</label>

								<div style={{ position: "relative" }}>
									<input
										type={
											showPasswords.current
												? "text"
												: "password"
										}
										className="form-control"
										value={
											passwordData.currentPassword
										}
										onChange={(e) =>
											setPasswordData({
												...passwordData,
												currentPassword:
													e.target.value,
											})
										}
										style={{
											borderRadius: "6px",
											borderColor:
												passwordErrors.currentPassword
													? "#ef4444"
													: "#e5e7eb",
											fontSize: "14px",
											padding: "10px 44px 10px 12px",
										}}
									/>

									<button
										type="button"
										onClick={() =>
											setShowPasswords({
												...showPasswords,
												current:
													!showPasswords.current,
											})
										}
										style={{
											position: "absolute",
											right: "12px",
											top: "50%",
											transform: "translateY(-50%)",
											border: "none",
											background: "none",
											cursor: "pointer",
											color: "#6b7280",
											padding: 0,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										{showPasswords.current ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>

								{passwordErrors.currentPassword && (
									<p
										style={{
											color: "#ef4444",
											fontSize: "12px",
											marginTop: "6px",
											marginBottom: 0,
										}}
									>
										{passwordErrors.currentPassword}
									</p>
								)}
							</div>

							{/* NUEVA */}
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
									Nueva Contraseña
								</label>

								<div style={{ position: "relative" }}>
									<input
										type={
											showPasswords.new
												? "text"
												: "password"
										}
										className="form-control"
										value={passwordData.newPassword}
										onChange={(e) =>
											setPasswordData({
												...passwordData,
												newPassword:
													e.target.value,
											})
										}
										style={{
											borderRadius: "6px",
											borderColor:
												passwordErrors.newPassword
													? "#ef4444"
													: "#e5e7eb",
											fontSize: "14px",
											padding: "10px 44px 10px 12px",
										}}
									/>

									<button
										type="button"
										onClick={() =>
											setShowPasswords({
												...showPasswords,
												new: !showPasswords.new,
											})
										}
										style={{
											position: "absolute",
											right: "12px",
											top: "50%",
											transform: "translateY(-50%)",
											border: "none",
											background: "none",
											cursor: "pointer",
											color: "#6b7280",
											padding: 0,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										{showPasswords.new ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>

								{passwordErrors.newPassword && (
									<p
										style={{
											color: "#ef4444",
											fontSize: "12px",
											marginTop: "6px",
											marginBottom: 0,
										}}
									>
										{passwordErrors.newPassword}
									</p>
								)}
							</div>

							{/* CONFIRMAR */}
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
									Confirmar Contraseña
								</label>

								<div style={{ position: "relative" }}>
									<input
										type={
											showPasswords.confirm
												? "text"
												: "password"
										}
										className="form-control"
										value={
											passwordData.confirmPassword
										}
										onChange={(e) =>
											setPasswordData({
												...passwordData,
												confirmPassword:
													e.target.value,
											})
										}
										style={{
											borderRadius: "6px",
											borderColor:
												passwordErrors.confirmPassword
													? "#ef4444"
													: "#e5e7eb",
											fontSize: "14px",
											padding: "10px 44px 10px 12px",
										}}
									/>

									<button
										type="button"
										onClick={() =>
											setShowPasswords({
												...showPasswords,
												confirm:
													!showPasswords.confirm,
											})
										}
										style={{
											position: "absolute",
											right: "12px",
											top: "50%",
											transform: "translateY(-50%)",
											border: "none",
											background: "none",
											cursor: "pointer",
											color: "#6b7280",
											padding: 0,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										{showPasswords.confirm ? (
											<EyeOff size={18} />
										) : (
											<Eye size={18} />
										)}
									</button>
								</div>

								{passwordErrors.confirmPassword && (
									<p
										style={{
											color: "#ef4444",
											fontSize: "12px",
											marginTop: "6px",
											marginBottom: 0,
										}}
									>
										{passwordErrors.confirmPassword}
									</p>
								)}
							</div>

							{/* BOTONES */}
							<div
								style={{
									borderTop:
										"1px solid #e5e7eb",
									paddingTop: "16px",
									display: "flex",
									justifyContent:
										"flex-end",
									gap: "12px",
								}}
							>
								<button
									onClick={() => {
										setShowPasswordModal(false);

										setPasswordData({
											currentPassword: "",
											newPassword: "",
											confirmPassword: "",
										});

										setPasswordErrors({});
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
                  onClick={async () => {

                    const isValid =
                      validatePasswordForm();

                    if (!isValid) return;

                    const result = await changePassword(
                      passwordData.currentPassword,
                      passwordData.newPassword,
                    );

                    if (!result?.success) {
                      setPasswordErrors({
                        currentPassword:
                          result.error || "Error al cambiar contraseña",
                      });

                      return;
                    }

                    setShowPasswordModal(false);

                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });

                    setPasswordErrors({});
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
                  Guardar Contraseña
                </button>
							</div>
						</div>
					</div>
				</div>
			)}
    </div>
  );
}