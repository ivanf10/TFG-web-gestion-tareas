import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import uploadRoutes from "./routes/uploadRoutes.js";
import cloudinary from "./config/cloudinary.js";

dotenv.config();

const app = express();

const prisma = new PrismaClient();

app.use(cors());

app.use(express.json());

app.use("/api/upload", uploadRoutes);

/* LOGIN */
app.post("/api/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },

      include: {
        departamentos: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: "Usuario no encontrado",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        error: "Contraseña incorrecta",
      });
    }

    res.json(user);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error en login",
    });
  }
});

/* REGISTER */
app.post("/api/register", async (req, res) => {
  try {

    const {
      nombre,
      apellido,
      email,
      password,
    } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "El email ya está registrado",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nombre,
        apellido,
        email,
        password: hashedPassword,
        rol: email === "admin@admin.com"
        ? "Admin"
        : "Usuario",
      },
    });

    res.json(user);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error registrando usuario",
    });
  }
});

/* GET USERS */
app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        departamentos: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error obteniendo usuarios",
    });
  }
});

/* CREATE USER */
app.post("/api/users", async (req, res) => {
  try {

    const {
      nombre,
      apellido,
      email,
      password,
      rol,
      departamentos,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nombre,
        apellido,
        email,
        password: hashedPassword,
        rol,

        departamentos: departamentos?.length
          ? {
              connect: departamentos.map((id) => ({
                id,
              })),
            }
          : undefined,
      }
    });

    res.json(user);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

/* UPDATE USER */
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      apellido,
      email,
      rol,
      departamentos,
    } = req.body;

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
      nombre,
      apellido,
      email,
      rol,

      ...(departamentos !== undefined && {
        departamentos: {
          set: departamentos.map((id) => ({ id })),
        },
      }),
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error actualizando usuario",
    });
  }
});

/* DELETE USER */
app.delete("/api/users/:id", async (req, res) => {
  try {

    const { id } = req.params;

    await prisma.$transaction(async (tx) => {

    // OBTENER NOTAS DEL USUARIO
    const userNotes = await tx.note.findMany({
      where: {
        createdById: id,
      },
    });

    // BORRAR ARCHIVOS DE CLOUDINARY
    for (const note of userNotes) {

      if (note.imagePublicId) {
        await cloudinary.uploader.destroy(
          note.imagePublicId
        );
      }

      if (note.audioPublicId) {
        await cloudinary.uploader.destroy(
          note.audioPublicId,
          {
            resource_type: "video",
          }
        );
      }
    }

    // ELIMINAR NOTAS DEL USUARIO
    await tx.note.deleteMany({
      where: {
        createdById: id,
      },
    });

    // ELIMINAR TODAS LAS TAREAS ASIGNADAS AL USUARIO
    await tx.task.deleteMany({
      where: {
        assignedToId: id,
      },
    });

    // ELIMINAR TODAS LAS TAREAS DONDE PARTICIPA EL USUARIO
    await tx.task.deleteMany({
      where: {
        OR: [
          { assignedToId: id },
          { createdById: id },
        ],
      },
    });

    // ELIMINAR USUARIO
    await tx.user.delete({
      where: {
        id,
      },
    });

  });

    res.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

/* GET DEPARTMENTS */
app.get("/api/departments", async (req, res) => {
  try {

    const departments = await prisma.department.findMany({
      include: {
        miembros: true,
        tareas: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(departments);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo departamentos",
    });
  }
});

/* CREATE DEPARTMENT */
app.post("/api/departments", async (req, res) => {
  try {

    const {
      nombre,
      descripcion,
      miembros,
    } = req.body;

    const department = await prisma.department.create({
      data: {
        nombre,
        descripcion,

        miembros: miembros?.length
          ? {
              connect: miembros.map((id) => ({
                id,
              })),
            }
          : undefined,
      },

      include: {
        miembros: true,
      },
    });

    res.json(department);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

/* UPDATE DEPARTMENT */
app.put("/api/departments/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const {
      nombre,
      descripcion,
      miembros,
    } = req.body;

    const updatedDepartment = await prisma.department.update({
      where: {
        id,
      },

      data: {
        nombre,
        descripcion,

        miembros: {
          set: (miembros || []).map((id) => ({
            id,
          })),
        },
      },

      include: {
        miembros: true,
      },
    });

    res.json(updatedDepartment);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error actualizando departamento",
    });
  }
});

/* DELETE DEPARTMENT */
app.delete("/api/departments/:id", async (req, res) => {
  try {

    const { id } = req.params;

    await prisma.department.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error eliminando departamento",
    });
  }
});

/* GET TASKS */
app.get("/api/tasks", async (req, res) => {
  try {

    const tasks = await prisma.task.findMany({
      include: {
        departamento: true,
        assignedTo: true,
        createdBy: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(tasks);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo tareas",
    });

  }
});

/* CREATE TASK */
app.post("/api/tasks", async (req, res) => {
  try {

    const {
      titulo,
      descripcion,
      estado,
      fechaLimite,
      enviarRecordatorio,
      completed,
      departamentoId,
      assignedToId,
      createdById,
    } = req.body;

    if (!createdById) {
      return res.status(400).json({
        error: "createdById es obligatorio",
      });
    }

    const task = await prisma.task.create({
      data: {
        titulo,
        descripcion,
        estado,

        fechaLimite: fechaLimite
          ? new Date(fechaLimite)
          : null,

        enviarRecordatorio,
        completed,

        departamento: departamentoId
          ? {
              connect: {
                id: departamentoId,
              },
            }
          : undefined,

        assignedTo: assignedToId
          ? {
              connect: {
                id: assignedToId,
              },
            }
          : undefined,

        createdBy: {
          connect: {
            id: createdById,
          },
        },
      },

      include: {
        departamento: true,
        assignedTo: true,
        createdBy: true,
      },
    });

    res.json(task);

  } catch (error) {

    console.error("CREATE TASK ERROR:");
    console.error(error);

    res.status(500).json({
      error: error.message,
    });

  }
});

/* UPDATE TASK */
app.put("/api/tasks/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const {
      titulo,
      descripcion,
      estado,
      fechaLimite,
      enviarRecordatorio,
      completed,
      departamentoId,
      assignedToId,
    } = req.body;

    const updatedTask = await prisma.task.update({
      where: {
        id,
      },

      data: {
        titulo,
        descripcion,
        estado,

        fechaLimite: fechaLimite
          ? new Date(fechaLimite)
          : null,

        enviarRecordatorio,
        completed,

        departamento: departamentoId
          ? {
              connect: {
                id: departamentoId,
              },
            }
          : {
              disconnect: true,
            },

        assignedTo: assignedToId
          ? {
              connect: {
                id: assignedToId,
              },
            }
          : {
              disconnect: true,
            },
      },

      include: {
        departamento: true,
        assignedTo: true,
        createdBy: true,
      },
    });

    res.json(updatedTask);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error actualizando tarea",
    });

  }
});

/* DELETE TASK */
app.delete("/api/tasks/:id", async (req, res) => {
  try {

    const { id } = req.params;

    await prisma.task.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error eliminando tarea",
    });

  }
});

/* GET NOTES */
app.get("/api/notes", async (req, res) => {
  try {

    const notes = await prisma.note.findMany({
      include: {
        createdBy: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(notes);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error obteniendo notas",
    });
  }
});

/* CREATE NOTE */
app.post("/api/notes", async (req, res) => {
  try {

    const {
      titulo,
      tipo,

      contenido,

      audioUrl,
      audioPublicId,

      imageUrl,
      imagePublicId,

      createdById,
    } = req.body;

    if (!createdById) {
      return res.status(400).json({
        error: "createdById es obligatorio",
      });
    }

    const note = await prisma.note.create({
      data: {
        titulo,
        tipo,

        contenido:
          tipo === "text"
            ? contenido
            : null,

        audioUrl:
          tipo === "audio"
            ? audioUrl
            : null,

        audioPublicId:
          tipo === "audio"
            ? audioPublicId
            : null,

        imageUrl:
          tipo === "image"
            ? imageUrl
            : null,

        imagePublicId:
          tipo === "image"
            ? imagePublicId
            : null,

        createdBy: {
          connect: {
            id: createdById,
          },
        },
      },

      include: {
        createdBy: true,
      },
    });

    res.json(note);

  } catch (error) {

    console.error("CREATE NOTE ERROR:");
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

/* UPDATE NOTE */
app.put("/api/notes/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const existingNote = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!existingNote) {
      return res.status(404).json({
        error: "Nota no encontrada",
      });
    }

    const {
      titulo,
      tipo,

      contenido,

      audioUrl,
      audioPublicId,

      imageUrl,
      imagePublicId,
    } = req.body;

    /* DELETE OLD IMAGE */
    if (
      existingNote.imagePublicId &&
      imagePublicId &&
      existingNote.imagePublicId !== imagePublicId
    ) {

      await cloudinary.uploader.destroy(
        existingNote.imagePublicId
      );
    }

    /* DELETE IMAGE IF REMOVED */
    if (
      existingNote.imagePublicId &&
      tipo === "image" &&
      !imagePublicId
    ) {

      await cloudinary.uploader.destroy(
        existingNote.imagePublicId
      );
    }

    /* DELETE OLD AUDIO */
    if (
      existingNote.audioPublicId &&
      audioPublicId &&
      existingNote.audioPublicId !== audioPublicId
    ) {

      await cloudinary.uploader.destroy(
        existingNote.audioPublicId,
        {
          resource_type: "video",
        }
      );
    }

    /* DELETE AUDIO IF REMOVED */
    if (
      existingNote.audioPublicId &&
      tipo === "audio" &&
      !audioPublicId
    ) {

      await cloudinary.uploader.destroy(
        existingNote.audioPublicId,
        {
          resource_type: "video",
        }
      );
    }

    const updatedNote = await prisma.note.update({
      where: {
        id,
      },

      data: {
        titulo,

        contenido:
          tipo === "text"
            ? contenido
            : null,

        audioUrl:
          tipo === "audio"
            ? audioUrl
            : null,

        audioPublicId:
          tipo === "audio"
            ? audioPublicId
            : null,

        imageUrl:
          tipo === "image"
            ? imageUrl
            : null,

        imagePublicId:
          tipo === "image"
            ? imagePublicId
            : null,
      },

      include: {
        createdBy: true,
      },
    });

    res.json(updatedNote);

  } catch (error) {

    console.error("UPDATE NOTE ERROR:");
    console.error(error.message);
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});


/* DELETE NOTE */
app.delete("/api/notes/:id", async (req, res) => {
  try {

    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!note) {
      return res.status(404).json({
        error: "Nota no encontrada",
      });
    }

    /* DELETE IMAGE CLOUDINARY */
    if (note.imagePublicId) {

      await cloudinary.uploader.destroy(
        note.imagePublicId
      );
    }

    /* DELETE AUDIO CLOUDINARY */
    if (note.audioPublicId) {

      await cloudinary.uploader.destroy(
        note.audioPublicId,
        {
          resource_type: "video",
        }
      );
    }

    /* DELETE NOTE DB */
    await prisma.note.delete({
      where: {
        id,
      },
    });

    res.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error eliminando nota",
    });
  }
});

/* CHANGE PASSWORD */
app.put("/api/users/change-password", async (req, res) => {
  try {

    const {
      userId,
      currentPassword,
      newPassword,
    } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "Usuario no encontrado",
      });
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        error: "La contraseña actual es incorrecta",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        password: hashedPassword,
      },
    });

    res.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error cambiando contraseña",
    });
  }
});

app.listen(3001, () => {
  console.log("Servidor funcionando en puerto 3001");
});