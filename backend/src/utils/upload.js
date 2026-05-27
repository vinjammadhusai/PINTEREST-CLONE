const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

const uploadDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const localStorage = multer.diskStorage({
  destination: uploadDir,
  filename(req, file, cb) {
    const extension = path.extname(file.originalname) || ".jpg";
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pinterest-clone",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({
  storage: hasCloudinaryConfig ? cloudinaryStorage : localStorage,
});

module.exports = upload;
