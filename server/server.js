import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();

const prisma = new PrismaClient();

app.use(cors());

app.use(express.json());

/* LOGIN */
app.post("/login", async (req, res) => {
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
app.post("/register", async (req, res) => {
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
app.get("/users", async (req, res) => {
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
app.post("/users", async (req, res) => {
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
app.put("/users/:id", async (req, res) => {
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

        departamentos: {
          set: (departamentos || []).map((id) => ({
            id,
          })),
        },
      },
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
app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
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
      error: "Error eliminando usuario",
    });
  }
});

/* GET DEPARTMENTS */
app.get("/departments", async (req, res) => {
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
app.post("/departments", async (req, res) => {
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
app.put("/departments/:id", async (req, res) => {
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
app.delete("/departments/:id", async (req, res) => {
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
app.get("/tasks", async (req, res) => {
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
app.post("/tasks", async (req, res) => {
  try {

    console.log(req.body);

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

    console.log(req.body);

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
app.put("/tasks/:id", async (req, res) => {
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
app.delete("/tasks/:id", async (req, res) => {
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

app.listen(3001, () => {
  console.log("Servidor funcionando en puerto 3001");
});