import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});

// IMAGE
router.post("/image", upload.single("file"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        error: "No se ha enviado ninguna imagen",
      });
    }

    const result = await new Promise((resolve, reject) => {

      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "notes-images",
          resource_type: "image",
        },
        (error, result) => {

          if (error) {
            console.error("CLOUDINARY ERROR:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });

  } catch (error) {

    console.error("UPLOAD IMAGE ERROR:");
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

router.delete("/image/:publicId", async (req, res) => {
  try {

    const { publicId } = req.params;

    await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error eliminando imagen",
    });
  }
});

// AUDIO
router.post("/audio", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: "No se ha enviado ningún audio",
      });
    }

    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "notes-audios",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        stream.end(req.file.buffer);
      });

    const result = await streamUpload();

    res.json({
      url: result.secure_url,
      publicId: result.public_id,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al subir audio",
    });
  }
});

router.delete("/audio/:publicId", async (req, res) => {
  try {

    const { publicId } = req.params;

    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "video",
      }
    );

    res.json({
      success: true,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error eliminando audio",
    });
  }
});

export default router;