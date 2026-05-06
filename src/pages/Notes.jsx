import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";

export default function Notes({
  allNotes,
  addNote,
  updateNote,
  deleteNote,

  showAddNoteModal,
  setShowAddNoteModal,
  editingNote,
  setEditingNote,
  showEditNoteModal,
  setShowEditNoteModal,
  selectedNoteForDetail,
  setSelectedNoteForDetail,
  showNoteDetailModal,
  setShowNoteDetailModal,
  editNoteFormData,
  setEditNoteFormData,

  setIsMobileMenuOpen,
}) {

  // Formulario Nueva Nota
  const [newNote, setNewNote] = useState({
    tipo: "text",
    titulo: "",
    contenido: "",
    audioUrl: "",
    imageUrl: "",
  });

  // AUDIO 
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [editAudioPreview, setEditAudioPreview] = useState("");

  // IMAGEN
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // EDIT AUDIO
  const [editAudioBlob, setEditAudioBlob] = useState(null);
  const [editRecordingTime, setEditRecordingTime] = useState(0);
  const [editMediaRecorder, setEditMediaRecorder] = useState(null);
  const [editIsRecording, setEditIsRecording] = useState(false);
  const [editAudioDeleted, setEditAudioDeleted] = useState(false);

  // EDIT IMAGE
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editImageDeleted, setEditImageDeleted] = useState(false);

  // BUSCADOR
  const [noteSearchQuery, setNoteSearchQuery] = useState("");

  // PAGINACIÓN
  const [currentNotesPage, setCurrentNotesPage] = useState(1);
  const notesPerPage = 8;

  // FILTRADO
  const filteredNotes = allNotes.filter((note) =>
    (note.title || "").toLowerCase().includes(noteSearchQuery.toLowerCase())
  );

  const totalNotesPages = Math.ceil(filteredNotes.length / notesPerPage);

  const indexOfLastNote = currentNotesPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;

  const paginatedNotes = filteredNotes.slice(
    indexOfFirstNote,
    indexOfLastNote
  );

  // AJUSTE DE PAGINA
  useEffect(() => {
    if (currentNotesPage > 1 && indexOfFirstNote >= filteredNotes.length) {
      setCurrentNotesPage((prev) => prev - 1);
    }
  }, [filteredNotes]);

  // PAGINACIÓN
  const handlePreviousNotesPage = () => {
    setCurrentNotesPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextNotesPage = () => {
    if (currentNotesPage < totalNotesPages) {
      setCurrentNotesPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    setCurrentNotesPage(1);
  }, [noteSearchQuery]);

  useEffect(() => {
    if (editingNote) {
      setEditAudioDeleted(false);
      setEditAudioBlob(null);
      setEditImageDeleted(false);
      setEditNoteFormData({
        titulo: editingNote.title || "",
        contenido: editingNote.content || "",
        audioUrl: editingNote.audioUrl || "",
        imageUrl: editingNote.imageUrl || "",
      });

      setEditImagePreview(editingNote.imageUrl || null);
    }
  }, [editingNote]);

  useEffect(() => {
    let interval;

    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    let interval;

    if (editIsRecording) {
      interval = setInterval(() => {
        setEditRecordingTime((prev) => prev + 1);
      }, 1000);
    }

  return () => clearInterval(interval);
}, [editIsRecording]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }

      if (editImagePreview && editImagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(editImagePreview);
      }
    };
  }, [imagePreview, editImagePreview]);

  const startAudioRecording = async ({
    setBlob,
    setRecorder,
    setIsRecording,
    setTime,
    onStop,
  }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const recorder = new MediaRecorder(stream);

      let chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, {
          type: "audio/webm",
        });

        setBlob(blob);

        if (onStop) {
          onStop(blob);
        }

        chunks = [];
      };

      recorder.start();

      setRecorder(recorder);
      setIsRecording(true);
      setTime(0);

    } catch (error) {
      console.error("Error al acceder al micro:", error);
    }
  };

  const startRecording = async () => {
    startAudioRecording({
      setBlob: setAudioBlob,
      setRecorder: setMediaRecorder,
      setIsRecording: setIsRecording,
      setTime: setRecordingTime,

      onStop: (blob) => {
        setNewNote((prev) => ({
          ...prev,
          audioUrl: URL.createObjectURL(blob),
        }));
      },
    });
  };

  const startEditRecording = async () => {
    setEditAudioBlob(null);
    setEditAudioPreview("");

    startAudioRecording({
      setBlob: setEditAudioBlob,
      setRecorder: setEditMediaRecorder,
      setIsRecording: setEditIsRecording,
      setTime: setEditRecordingTime,

      onStop: (blob) => {
        setEditAudioDeleted(true);
        setEditAudioPreview(URL.createObjectURL(blob));
      },
    });
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);

      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const stopEditRecording = () => {
    if (editMediaRecorder) {
      editMediaRecorder.stop();

      setEditIsRecording(false);

      editMediaRecorder.stream
        .getTracks()
        .forEach((t) => t.stop());
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    setIsRecording(false);

    setNewNote((prev) => ({
      ...prev,
      audioUrl: "",
    }));
  };

  const deleteEditRecording = () => {
    setEditAudioBlob(null);
    setEditAudioDeleted(true);
    setEditAudioPreview("");
  };


  const handleImageFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setNewNote((prev) => ({
      ...prev,
      imageUrl: previewUrl,
    }));
  };

  const handleEditImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEditImageDeleted(false);
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  return (
    <>
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
            Mis Notas
          </h2>
        </div>

        <button
          onClick={() => setShowAddNoteModal(true)}
          className="btn btn-primary"
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          + Añadir Nueva Nota
        </button>
      </div>

      <div
        className="card rounded-2xl border-0 mb-4"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}
      >
        <div className="card-body p-3 p-md-4">

          {/* SEARCH */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Buscar notas por título..."
              className="form-control"
              style={{
                borderRadius: "6px",
                borderColor: "#e5e7eb",
                fontSize: "14px",
              }}
              value={noteSearchQuery}
              onChange={(e) => setNoteSearchQuery(e.target.value)}
            />
          </div>

          {/* GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "16px",
            }}
          >
            {paginatedNotes.map((note) => (
              <div
                key={note.id}
                className="card rounded-2"
                style={{
                  backgroundColor:
                    note.tipo === "text"
                      ? "#fff3cd"
                      : note.tipo === "audio"
                      ? "#e7f3ff"
                      : "#f0f0f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  border: "none",
                  height: "230px",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                <div
                  className="d-flex flex-column"
                  style={{ flex: 1, padding: "12px" }}
                >
                  <h5
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#111827",
                      marginBottom: "8px",
                      lineHeight: "1.3",
                    }}
                  >
                    {note.title}
                  </h5>

                  {/* TEXT */}
                  {note.tipo === "text" && (
                    <div style={{ marginBottom: "2px" }}>
                      <div
                        style={
                          note.content?.length > 250
                            ? { maxHeight: "130px", overflow: "hidden" }
                            : {}
                        }
                      >
                        <p
                          className={
                            note.content?.length > 250
                              ? "note-text-truncated"
                              : ""
                          }
                          style={{
                            fontSize: "13px",
                            color: "#4b5563",
                            marginBottom: "6px",
                            lineHeight: "1.4",
                            marginTop: 0,
                          }}
                        >
                          {note.content}
                        </p>
                      </div>

                      {note.content?.length > 250 && (
                        <button
                          onClick={() => {
                            setSelectedNoteForDetail(note);
                            setShowNoteDetailModal(true);
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#3b82f6",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            padding: "0",
                            textDecoration: "underline",
                          }}
                        >
                          Leer más
                        </button>
                      )}
                    </div>
                  )}

                  {/* AUDIO */}
                  {note.tipo === "audio" && (
                    <div style={{ marginBottom: "8px", flex: 1 }}>
                      <audio
                        key={note.audioUrl}
                        controls
                        style={{
                          width: "100%",
                          height: "32px",
                        }}
                      >
                        <source src={note.audioUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}

                  {/* IMAGE */}
                  {note.tipo === "image" && (
                    <div
                      style={{
                        marginBottom: "8px",
                        flex: 1,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={note.imageUrl}
                        alt={note.title}
                        style={{
                          width: "100%",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    </div>
                  )}

                  {/* FOOTER */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "auto",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => {
                          setEditingNote(note);
                          setEditNoteFormData({
                            titulo: note.title,
                            contenido: note.content || "",
                            audioUrl: note.audioUrl || "",
                            imageUrl: note.imageUrl || "",
                          });
                          setShowEditNoteModal(true);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px",
                          color: "#6b7280",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Editar nota"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm("¿Eliminar nota?")) {
                            deleteNote(note.id);
                          }
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "2px",
                          color: "#ef4444",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        title="Eliminar nota"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <span
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                      }}
                    >
                      {note.date}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINACIÓN */}
          <div
            className="d-flex align-items-center justify-content-between mt-3"
            style={{ fontSize: "14px", color: "#6b7280" }}
          >
            <p style={{ marginBottom: "0" }}>
              Mostrando{" "}
              {paginatedNotes.length > 0
                ? (currentNotesPage - 1) * notesPerPage + 1
                : 0}{" "}
              a{" "}
              {Math.min(
                currentNotesPage * notesPerPage,
                filteredNotes.length
              )}{" "}
              de {filteredNotes.length} notas
            </p>

            <div className="d-flex gap-2">
              <button
                className="btn btn-sm"
                onClick={handlePreviousNotesPage}
                disabled={currentNotesPage === 1}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "transparent",
                  border: "1px solid #e5e7eb",
                  color: currentNotesPage === 1 ? "#d1d5db" : "#4b5563",
                  borderRadius: "6px",
                }}
              >
                &lsaquo;
              </button>

              <button
                className="btn btn-sm"
                onClick={handleNextNotesPage}
                disabled={currentNotesPage >= totalNotesPages}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "transparent",
                  border: "1px solid #e5e7eb",
                  color:
                    currentNotesPage >= totalNotesPages
                      ? "#d1d5db"
                      : "#4b5563",
                  borderRadius: "6px",
                }}
              >
                &rsaquo;
              </button>
            </div>
          </div>

          {/* EMPTY */}
          {filteredNotes.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#6b7280",
              }}
            >
              <p style={{ fontSize: "16px", marginBottom: "0" }}>
                No hay notas que coincidan con tu búsqueda
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    {/* Note Detail Modal */}
    {showNoteDetailModal && selectedNoteForDetail && (
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
        onClick={() => setShowNoteDetailModal(false)}
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
        {/* HEADER */}
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
            {selectedNoteForDetail.title}
            </h4>

            <button
            onClick={() => setShowNoteDetailModal(false)}
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

        {/* CONTENIDO */}
        <div style={{ padding: "24px" }}>
            {selectedNoteForDetail.tipo === "text" && (
            <p
                style={{
                color: "#4b5563",
                lineHeight: "1.6",
                fontSize: "14px",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                }}
            >
                {selectedNoteForDetail.content}
            </p>
            )}

            {selectedNoteForDetail.tipo === "audio" && (
            <audio
                controls
                style={{
                width: "100%",
                marginBottom: "16px",
                }}
            >
                <source
                src={selectedNoteForDetail.audioUrl}
                type="audio/mpeg"
                />
                Elemento de audio no compatible con tu navegador.
            </audio>
            )}

            {selectedNoteForDetail.tipo === "image" && (
            <img
                src={selectedNoteForDetail.imageUrl}
                alt={selectedNoteForDetail.title}
                style={{
                width: "100%",
                borderRadius: "8px",
                marginBottom: "16px",
                }}
            />
            )}

            {/* FECHA */}
            <div
            style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
                fontSize: "12px",
                color: "#6b7280",
            }}
            >
            {selectedNoteForDetail.date}
            </div>
          </div>
        </div>
      </div>
    
    )}
      {/* Add Note Modal */}
      {showAddNoteModal && (
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
          onClick={() => setShowAddNoteModal(false)}
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
                    Añadir Nueva Nota
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: 0,
                    }}
                  >
                    Crea una nueva nota para capturar tus ideas.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setShowAddNoteModal(false);

                    // RESET COMPLETO
                    setNewNote({
                      tipo: "text",
                      titulo: "",
                      contenido: "",
                      audioUrl: "",
                      imageUrl: "",
                    });

                    setAudioBlob(null);
                    setRecordingTime(0);
                    setImageFile(null);
                    setImagePreview(null);

                    if (mediaRecorder && isRecording) {
                      mediaRecorder.stop();
                    }
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
                {/* TIPO */}
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
                    Tipo de nota <span style={{ color: "#ef4444" }}>*</span>
                  </label>

                  <select
                    className="form-select"
                    style={{
                      borderRadius: "6px",
                      borderColor: "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                    }}
                    value={newNote.tipo}
                    onChange={(e) => {
                      setNewNote({
                        ...newNote,
                        tipo: e.target.value,
                        contenido: "",
                        audioUrl: "",
                        imageUrl: "",
                      });

                      // RESET
                      setAudioBlob(null);
                      setRecordingTime(0);
                      setImageFile(null);
                      setImagePreview(null);

                      if (mediaRecorder && isRecording) {
                        mediaRecorder.stop();
                      }
                    }}
                  >
                    <option value="text">Texto</option>
                    <option value="audio">Audio</option>
                    <option value="image">Imagen</option>
                  </select>
                </div>

                {/* TITULO */}
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
                    Título de la nota{" "}
                    <span style={{ color: "#ef4444" }}>*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Ej: Ideas para el proyecto..."
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      borderColor: "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                    }}
                    value={newNote.titulo}
                    onChange={(e) =>
                      setNewNote({ ...newNote, titulo: e.target.value })
                    }
                  />
                </div>

                {/* TEXT */}
                {newNote.tipo === "text" && (
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
                      Contenido
                    </label>

                    <textarea
                      placeholder="Escribe el contenido de tu nota..."
                      className="form-control"
                      style={{
                        borderRadius: "6px",
                        borderColor: "#e5e7eb",
                        fontSize: "14px",
                        padding: "10px 12px",
                        minHeight: "120px",
                        resize: "vertical",
                      }}
                      value={newNote.contenido}
                      onChange={(e) =>
                        setNewNote({
                          ...newNote,
                          contenido: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

                {/* AUDIO */}
                {newNote.tipo === "audio" && (
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
                      Grabar audio
                    </label>

                    <div
                      style={{
                        backgroundColor: "#f9fafb",
                        border: "2px dashed #e5e7eb",
                        borderRadius: "6px",
                        padding: "16px",
                      }}
                    >
                      {!audioBlob ? (
                        <div>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              marginBottom: "12px",
                            }}
                          >
                            {!isRecording ? (
                              <button
                                type="button"
                                onClick={startRecording}
                                style={{
                                  flex: 1,
                                  padding: "10px 16px",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  backgroundColor: "#ef4444",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "8px",
                                }}
                              >
                                <span style={{ fontSize: "16px" }}>●</span>
                                Grabar
                              </button>
                            ) : (
                              <div style={{ flex: 1, display: "flex", gap: "8px" }}>
                                <button
                                  type="button"
                                  onClick={stopRecording}
                                  style={{
                                    flex: 1,
                                    padding: "10px 16px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    backgroundColor: "#2563eb",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <span
                                    style={{
                                      width: "6px",
                                      height: "6px",
                                      backgroundColor: "white",
                                      borderRadius: "50%",
                                    }}
                                  ></span>
                                  Detener
                                </button>

                                <div
                                  style={{
                                    padding: "10px 16px",
                                    backgroundColor: "#fecaca",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#7f1d1d",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {Math.floor(recordingTime / 60)}:
                                  {(recordingTime % 60)
                                    .toString()
                                    .padStart(2, "0")}
                                </div>
                              </div>
                            )}
                          </div>

                          {isRecording && (
                            <p
                              style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                margin: 0,
                              }}
                            >
                              Micrófono activo...
                            </p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div
                            style={{
                              backgroundColor: "#e0f2fe",
                              borderRadius: "6px",
                              padding: "12px",
                              marginBottom: "12px",
                            }}
                          >
                            <audio controls style={{ width: "100%", height: "32px" }}>
                              <source
                                src={newNote.audioUrl}
                                type="audio/webm"
                              />
                            </audio>
                          </div>

                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              type="button"
                              onClick={deleteRecording}
                              style={{
                                flex: 1,
                                padding: "10px 16px",
                                fontSize: "14px",
                                fontWeight: "500",
                                backgroundColor: "#fecaca",
                                color: "#7f1d1d",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* IMAGEN */}
                {newNote.tipo === "image" && (
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
                    Subir imagen
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    style={{ display: "none" }}
                    id="imageInput"
                  />

                  <div
                    style={{
                      backgroundColor: "#f9fafb",
                      border: "2px dashed #e5e7eb",
                      borderRadius: "6px",
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >
                    {!imagePreview ? (
                      <div>
                        <label htmlFor="imageInput" style={{ display: "block", cursor: "pointer" }}>
                          <div style={{ padding: "24px" }}>
                            <p
                              style={{
                                fontSize: "14px",
                                color: "#6b7280",
                                margin: 0,
                                marginBottom: "8px",
                              }}
                            >
                              Haz clic para seleccionar una imagen
                            </p>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById("imageInput")?.click();
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
                              Seleccionar imagen
                            </button>
                          </div>
                        </label>
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            marginBottom: "12px",
                            borderRadius: "6px",
                            overflow: "hidden",
                            backgroundColor: "#f0f0f0",
                            maxHeight: "200px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                              maxWidth: "100%",
                              maxHeight: "200px",
                              objectFit: "contain",
                            }}
                          />
                        </div>

                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => {
                              setImageFile(null);
                              setImagePreview(null);
                            }}
                            style={{
                              flex: 1,
                              padding: "10px 16px",
                              fontSize: "14px",
                              fontWeight: "500",
                              backgroundColor: "#fecaca",
                              color: "#7f1d1d",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          >
                            Eliminar
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              document.getElementById("imageInput")?.click();
                            }}
                            style={{
                              flex: 1,
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
                            Cambiar imagen
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              </form>
              {/* BOTONES */}
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
                    setShowAddNoteModal(false);

                    // RESET
                    setAudioBlob(null);
                    setRecordingTime(0);
                    setImageFile(null);
                    setImagePreview(null);

                    if (mediaRecorder && isRecording) {
                      stopRecording();
                    }
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
                    // VALIDACIÓN
                    if (!newNote.titulo.trim()) {
                      alert("Por favor, ingresa un título para la nota.");
                      return;
                    }

                    if (newNote.tipo === "text" && !newNote.contenido.trim()) {
                      alert("Por favor, ingresa contenido para la nota de texto.");
                      return;
                    }

                    if (newNote.tipo === "audio" && !audioBlob) {
                      alert("Por favor, graba un audio.");
                      return;
                    }

                    if (newNote.tipo === "image" && !imageFile) {
                      alert("Por favor, sube una imagen.");
                      return;
                    }

                    const noteData = {
                      title: newNote.titulo,
                      tipo: newNote.tipo,
                      content: newNote.contenido || "",
                      audioUrl: "",
                      imageUrl: "",
                    };

                    if (newNote.tipo === "audio" && audioBlob) {
                      noteData.audioUrl = URL.createObjectURL(audioBlob);
                      noteData.audioBlob = audioBlob;
                    }

                    if (newNote.tipo === "image" && imageFile) {
                      noteData.imageUrl = imagePreview;
                      noteData.imageFile = imageFile;
                    }

                    addNote(noteData);

                    setShowAddNoteModal(false);

                    setNewNote({
                      tipo: "text",
                      titulo: "",
                      contenido: "",
                      audioUrl: "",
                      imageUrl: "",
                    });

                    setAudioBlob(null);
                    setRecordingTime(0);
                    setImageFile(null);
                    setImagePreview(null);
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
                  Crear Nota
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Note Modal */}
      {showEditNoteModal && editingNote && (
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
          onClick={() => setShowEditNoteModal(false)}
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
                    Editar Nota
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#6b7280",
                      marginBottom: 0,
                    }}
                  >
                    Actualiza los detalles de tu nota.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowEditNoteModal(false);
                    setEditAudioBlob(null);
                    setEditRecordingTime(0);
                    setEditImageFile(null);
                    setEditImagePreview(null);
                    if (editMediaRecorder && editIsRecording) {
                      stopEditRecording();
                    }
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
                    Tipo de nota <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <select
                    className="form-select"
                    disabled
                    style={{
                      borderRadius: "6px",
                      borderColor: "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                      backgroundColor: "#f3f4f6",
                      color: "#6b7280",
                      cursor: "not-allowed",
                    }}
                    value={editingNote.tipo}
                  >
                    <option value="text">Texto</option>
                    <option value="audio">Audio</option>
                    <option value="image">Imagen</option>
                  </select>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      marginTop: "4px",
                      marginBottom: 0,
                    }}
                  >
                    El tipo de nota no puede ser cambiado.
                  </p>
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
                    Título de la nota{" "}
                    <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Ideas para el proyecto..."
                    className="form-control"
                    style={{
                      borderRadius: "6px",
                      borderColor: "#e5e7eb",
                      fontSize: "14px",
                      padding: "10px 12px",
                    }}
                    value={editNoteFormData.titulo}
                    onChange={(e) =>
                      setEditNoteFormData({
                        ...editNoteFormData,
                        titulo: e.target.value,
                      })
                    }
                  />
                </div>

                {editingNote.tipo === "text" && (
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
                      Contenido
                    </label>
                    <textarea
                      placeholder="Escribe el contenido de tu nota..."
                      className="form-control"
                      style={{
                        borderRadius: "6px",
                        borderColor: "#e5e7eb",
                        fontSize: "14px",
                        padding: "10px 12px",
                        minHeight: "120px",
                        resize: "vertical",
                      }}
                      value={editNoteFormData.contenido}
                      onChange={(e) =>
                        setEditNoteFormData({
                          ...editNoteFormData,
                          contenido: e.target.value,
                        })
                      }
                    />
                  </div>
                )}

                {editingNote.tipo === "audio" && (
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
                      Grabar audio
                    </label>
                    <div
                      style={{
                        backgroundColor: "#f9fafb",
                        border: "2px dashed #e5e7eb",
                        borderRadius: "6px",
                        padding: "16px",
                      }}
                    >
                      {!editAudioBlob && 
                      (!editingNote.audioUrl || editAudioDeleted) ? (
                        <div>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              marginBottom: "12px",
                            }}
                          >
                            {!editIsRecording ? (
                              <button
                                type="button"
                                onClick={startEditRecording}
                                style={{
                                  flex: 1,
                                  padding: "10px 16px",
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  backgroundColor: "#ef4444",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "6px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "8px",
                                }}
                              >
                                <span style={{ fontSize: "16px" }}>●</span>
                                Grabar
                              </button>
                            ) : (
                              <div
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  gap: "8px",
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={stopEditRecording}
                                  style={{
                                    flex: 1,
                                    padding: "10px 16px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    backgroundColor: "#2563eb",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "8px",
                                  }}
                                >
                                  <span
                                    style={{
                                      display: "inline-block",
                                      width: "6px",
                                      height: "6px",
                                      backgroundColor: "white",
                                      borderRadius: "50%",
                                    }}
                                  ></span>
                                  Detener
                                </button>
                                <div
                                  style={{
                                    padding: "10px 16px",
                                    backgroundColor: "#fecaca",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#7f1d1d",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {Math.floor(editRecordingTime / 60)}
                                  {":"}
                                  {(editRecordingTime % 60)
                                    .toString()
                                    .padStart(2, "0")}
                                </div>
                              </div>
                            )}
                          </div>
                          {editIsRecording && (
                            <p
                              style={{
                                fontSize: "12px",
                                color: "#6b7280",
                                margin: 0,
                              }}
                            >
                              Micrófono activo...
                            </p>
                          )}
                        </div>
                      ) : editAudioBlob || (editingNote.audioUrl && !editAudioDeleted) ? (
                        <div>
                          <div
                            style={{
                              backgroundColor: "#e0f2fe",
                              borderRadius: "6px",
                              padding: "12px",
                              marginBottom: "12px",
                            }}
                          >
                            <audio
                              controls
                              style={{
                                width: "100%",
                                height: "32px",
                              }}
                            >
                              <source
                                src={
                                  editAudioBlob
                                    ? editAudioPreview
                                    : !editAudioDeleted
                                      ? editingNote.audioUrl
                                      : ""
                                }
                                type="audio/webm"
                              />
                              Tu navegador no soporta el elemento de audio.
                            </audio>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => deleteEditRecording()}
                              style={{
                                flex: 1,
                                padding: "10px 16px",
                                fontSize: "14px",
                                fontWeight: "500",
                                backgroundColor: "#fecaca",
                                color: "#7f1d1d",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                )}

                {editingNote.tipo === "image" && (
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
                      Subir imagen
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditImageFileChange}
                      style={{
                        display: "none",
                      }}
                      id="editImageInput"
                    />
                    <div
                      style={{
                        backgroundColor: "#f9fafb",
                        border: "2px dashed #e5e7eb",
                        borderRadius: "6px",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    >
                      {!(editImagePreview || (editingNote.imageUrl && !editImageDeleted)) ? (
                        <div>
                          <label
                            htmlFor="editImageInput"
                            style={{
                              display: "block",
                              cursor: "pointer",
                            }}
                          >
                            <div
                              style={{
                                padding: "24px",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#6b7280",
                                  margin: 0,
                                  marginBottom: "8px",
                                }}
                              >
                                Haz clic para seleccionar una imagen
                              </p>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  document
                                    .getElementById("editImageInput")
                                    ?.click();
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
                                Seleccionar imagen
                              </button>
                            </div>
                          </label>
                        </div>
                      ) : (
                        <div>
                          <div
                            style={{
                              marginBottom: "12px",
                              borderRadius: "6px",
                              overflow: "hidden",
                              backgroundColor: "#f0f0f0",
                              maxHeight: "200px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={
                                editImageFile
                                  ? URL.createObjectURL(editImageFile)
                                  : !editImageDeleted
                                    ? editingNote.imageUrl
                                    : ""
                              }
                              alt="Preview"
                              style={{
                                maxWidth: "100%",
                                maxHeight: "200px",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setEditImageFile(null);
                                setEditImagePreview(null);
                                setEditImageDeleted(true);
                              }}
                              style={{
                                flex: 1,
                                padding: "10px 16px",
                                fontSize: "14px",
                                fontWeight: "500",
                                backgroundColor: "#fecaca",
                                color: "#7f1d1d",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                              }}
                            >
                              Eliminar
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                document
                                  .getElementById("editImageInput")
                                  ?.click();
                              }}
                              style={{
                                flex: 1,
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
                              Cambiar imagen
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
                      setShowEditNoteModal(false);
                      setEditAudioBlob(null);
                      setEditAudioDeleted(false);
                      setEditRecordingTime(0);
                      setEditImageFile(null);
                      setEditImagePreview(editingNote?.imageUrl || null);
                      if (editMediaRecorder && editIsRecording) {
                        stopEditRecording();
                      }
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
                    onClick={async () => {
                      if (!editNoteFormData.titulo.trim()) {
                        alert("Por favor, ingresa un título para la nota.");
                        return;
                      }

                      if (
                        editingNote.tipo === "text" &&
                        !editNoteFormData.contenido.trim()
                      ) {
                        alert("Por favor, ingresa contenido.");
                        return;
                      }

                      if (
                        editingNote.tipo === "audio" &&
                        !editAudioBlob &&
                        (!editingNote.audioUrl || editAudioDeleted)
                      ) {
                        alert("Graba un audio o mantén el existente.");
                        return;
                      }

                      if (
                        editingNote.tipo === "image" &&
                        !editImageFile &&
                        !(editImagePreview || (editingNote.imageUrl && !editImageDeleted))
                      ) {
                        alert("Sube una imagen o mantén la existente.");
                        return;
                      }

                      let imageUrl = editingNote.imageUrl;

                      if (editingNote.tipo === "image") {
                        if (editImageFile) {
                          imageUrl = await fileToBase64(editImageFile);
                        } else if (editImageDeleted) {
                          imageUrl = "";
                        }
                      }

                      const updatedNote = {
                        id: editingNote.id,
                        title: editNoteFormData.titulo,
                        tipo: editingNote.tipo,

                        content:
                          editingNote.tipo === "text"
                            ? editNoteFormData.contenido
                            : "",

                        audioUrl:
                          editingNote.tipo === "audio"
                            ? editAudioBlob
                              ? editAudioPreview
                              : editAudioDeleted
                                ? ""
                                : editingNote.audioUrl
                            : "",

                        imageUrl,
                      };

                      updateNote(updatedNote);

                      // RESET
                      setShowEditNoteModal(false);
                      setEditingNote(null);

                      setEditNoteFormData({
                        titulo: "",
                        contenido: "",
                        audioUrl: "",
                        imageUrl: "",
                      });

                      setEditAudioBlob(null);
                      setEditAudioDeleted(false);
                      setEditRecordingTime(0);
                      setEditImageFile(null);
                      setEditImagePreview(null);
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
    </>
  );
}