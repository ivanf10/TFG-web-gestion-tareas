import { useState, useEffect } from "react";

export function useNotes() {
  // Estado global de notas
  const [allNotes, setAllNotes] = useState([
    {
      id: 1,
      title: "Estrategia Q4 Campaña Web",
      content:
        "Priorizar el SEO técnico para la landing de suscripción. Necesitamos revisar las keywords principales del sector y comparar con la competencia directa.",
      tipo: "text",
      date: "2025-04-23",
    },
    {
      id: 2,
      title: "Feedback Reunión Diseño",
      tipo: "audio",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      date: "2025-04-20",
    },
    {
      id: 3,
      title: "Notas de Cliente VIP",
      tipo: "image",
      imageUrl: "https://picsum.photos/300/200",
      content: "Bug en el header responsive en móviles.",
      date: "2025-04-12",
    },
  ]);

  // CREAR NOTA
  const addNote = (newNote) => {
    const today = new Date();

    const note = {
      id: Date.now(),
      title: newNote.title || "",
      tipo: newNote.tipo || "text",
      date: today.toISOString().split("T")[0],

      content: newNote.tipo === "text" ? newNote.content || "" : "",
      audioUrl: newNote.tipo === "audio" ? newNote.audioUrl || "" : "",
      imageUrl: newNote.tipo === "image" ? newNote.imageUrl || "" : "",
    };

    setAllNotes((prev) => [note, ...prev]);
  };

  // EDITAR NOTA
  const updateNote = (updatedNote) => {
    setAllNotes((prev) =>
      prev.map((note) =>
        note.id === updatedNote.id
          ? {
              ...note,
              title: updatedNote.title,
              tipo: updatedNote.tipo,

              content:
                updatedNote.tipo === "text"
                  ? updatedNote.content || ""
                  : "",

              audioUrl:
                updatedNote.tipo === "audio"
                  ? updatedNote.audioUrl || ""
                  : "",

              imageUrl:
                updatedNote.tipo === "image"
                  ? updatedNote.imageUrl || ""
                  : "",
            }
          : note
      )
    );
  };

  // EDIT AUDIO
  const [editAudioBlob, setEditAudioBlob] = useState(null);
  const [editRecordingTime, setEditRecordingTime] = useState(0);
  const [editMediaRecorder, setEditMediaRecorder] = useState(null);
  const [editIsRecording, setEditIsRecording] = useState(false);

  // EDIT IMAGE
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  // TIMER EDIT
  useEffect(() => {
    let interval;

    if (editIsRecording) {
      interval = setInterval(() => {
        setEditRecordingTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [editIsRecording]);

  // START EDIT RECORDING
  const startEditRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setEditAudioBlob(blob);
        chunks = [];
      };

      recorder.start();
      setEditMediaRecorder(recorder);
      setEditIsRecording(true);
      setEditRecordingTime(0);
    } catch (err) {
      console.error(err);
    }
  };

  // STOP EDIT RECORDING
  const stopEditRecording = () => {
    if (editMediaRecorder) {
      editMediaRecorder.stop();
      editMediaRecorder.stream.getTracks().forEach((t) => t.stop());
      setEditIsRecording(false);
    }
  };

  // DELETE EDIT AUDIO
  const deleteEditRecording = () => {
    setEditAudioBlob(null);
  };

  // IMAGE HANDLER EDIT
  const handleEditImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setEditImageFile(file);
    const preview = URL.createObjectURL(file);
    setEditImagePreview(preview);
  };


  // ELIMINAR NOTA
  const deleteNote = (noteId) => {
    setAllNotes((prev) =>
      prev.filter((note) => note.id !== noteId)
    );
  };

  return {
    allNotes,
    addNote,
    updateNote,
    deleteNote,
  };
}