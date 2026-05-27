const Post = require("../models/Post");
const User = require("../models/User");

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "savedPosts",
        populate: { path: "owner", select: "name avatar" },
      })
      .lean();

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const posts = await Post.find({ owner: user._id })
      .sort({ createdAt: -1 })
      .populate("owner", "name avatar")
      .lean();

    res.json({ user, posts, savedPosts: user.savedPosts || [] });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
};
