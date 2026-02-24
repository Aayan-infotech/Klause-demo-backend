import { createS3Upload } from "../middlewares/s3Upload.middleware.js";

// Convenience exports for common use cases
export const uploadImage = createS3Upload("image", {
  validateMagicNumber: true,
});

export const uploadVideo = createS3Upload("video", {
  validateMagicNumber: true,
});

export const uploadAudio = createS3Upload("audio", {
  validateMagicNumber: true,
});

export const uploadDocument = createS3Upload("document", {
  maxSize: 5 * 1024 * 1024,
  folder: "documents",
  validateMagicNumber: true,
});

// Custom upload with specific config
export const uploadProfileImage = createS3Upload("image", {
  maxSize: 1 * 1024 * 1024,
  folder: "profiles",
  validateMagicNumber: true,
});

export const uploadRestaurntImages = createS3Upload("image", {
  maxSize: 8 * 1024 * 1024,
  folder: "restaurant",
  validateMagicNumber: false,
  maxFiles: 10,
});

export const uploadMenuImages = createS3Upload("image", {
  maxSize: 5 * 1024 * 1024,
  folder: "menu",
  validateMagicNumber: false,
  maxFiles: 5,
});

export const uploadVarientIcons = createS3Upload("image", {
  maxSize: 2 * 1024 * 1024,
  folder: "varientIcons",
  validateMagicNumber: true,
  maxFiles: 25,
});


