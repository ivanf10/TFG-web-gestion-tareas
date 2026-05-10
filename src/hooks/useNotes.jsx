import { useState } from "react";

export function useNotes() {
  const [allNotes, setAllNotes] = useState([]);

  // CREAR
  const addNote = (newNote) => {
    const today = new Date();

    const note = {
      id: Date.now(),

      title: newNote.title || "",
      tipo: newNote.tipo || "text",

      content: newNote.content || "",
      audioUrl: newNote.audioUrl || "",
      imageUrl: newNote.imageUrl || "",

      createdBy: newNote.createdBy || "",

      date: today.toISOString().split("T")[0],
    };

    setAllNotes((prev) => [note, ...prev]);
  };

  // EDITAR
  const updateNote = (updatedNote) => {
    setAllNotes((prev) =>
      prev.map((note) =>
        note.id === updatedNote.id
          ? {
              ...note,

              title: updatedNote.title,
              tipo: updatedNote.tipo,

              content: updatedNote.content || "",
              audioUrl: updatedNote.audioUrl || "",
              imageUrl: updatedNote.imageUrl || "",
            }
          : note
      )
    );
  };

  // ELIMINAR
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