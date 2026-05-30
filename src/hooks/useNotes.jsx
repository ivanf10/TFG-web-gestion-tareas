import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL}/api/notes`;

export function useNotes() {

  const [allNotes, setAllNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(true);

  // CARGAR NOTAS
  const fetchNotes = async () => {

    try {

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Error obteniendo notas");
      }

      const data = await response.json();

      setAllNotes(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoadingNotes(false);

    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // CREAR
  const addNote = async (newNote) => {

    try {

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) {
        throw new Error("Error creando nota");
      }

      const createdNote = await response.json();

      setAllNotes((prev) => [
        createdNote,
        ...prev,
      ]);

      return createdNote;

    } catch (error) {

      console.error(error);
      alert("Error creando nota");
    }
  };

  // EDITAR
  const updateNote = async (updatedNote) => {

    try {

      const response = await fetch(
        `${API_URL}/${updatedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedNote),
        }
      );

      if (!response.ok) {
        throw new Error("Error actualizando nota");
      }

      const updated = await response.json();

      setAllNotes((prev) =>
        prev.map((note) =>
          note.id === updated.id
            ? updated
            : note
        )
      );

      return updated;

    } catch (error) {

      console.error(error);
      alert("Error actualizando nota");
    }
  };

  // ELIMINAR
  const deleteNote = async (noteId) => {

    try {

      const response = await fetch(
        `${API_URL}/${noteId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Error eliminando nota");
      }

      setAllNotes((prev) =>
        prev.filter((note) => note.id !== noteId)
      );

    } catch (error) {

      console.error(error);
      alert("Error eliminando nota");
    }
  };

  return {
    allNotes,
    loadingNotes,
    addNote,
    updateNote,
    deleteNote,
    fetchNotes,
  };
}