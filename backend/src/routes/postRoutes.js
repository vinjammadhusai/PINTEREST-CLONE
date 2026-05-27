const express = require("express");
const {
  addComment,
  createPost,
  getPost,
  getPosts,
  toggleLike,
  toggleSave,
} = require("../controllers/postController");
const protect = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", protect, upload.single("image"), createPost);
router.patch("/:id/like", protect, toggleLike);
router.patch("/:id/save", protect, toggleSave);
router.post("/:id/comments", protect, addComment);

module.exports = router;
