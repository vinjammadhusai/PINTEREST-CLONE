const Post = require("../models/Post");
const User = require("../models/User");

const populatePost = (query) =>
  query
    .populate("owner", "name avatar bio")
    .populate("comments.user", "name avatar")
    .lean();

const getPosts = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 30);
    const skip = (page - 1) * limit;
    const { search, category } = req.query;

    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const [posts, total] = await Promise.all([
      populatePost(Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)),
      Post.countDocuments(filter),
    ]);

    res.json({
      posts,
      page,
      hasMore: skip + posts.length < total,
      total,
    });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await populatePost(
      Post.findByIdAndUpdate(
        req.params.id,
        { $inc: { viewCount: 1 } },
        { new: true }
      )
    );

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    const { title, description, category, tags, imageUrl, sourceUrl } = req.body;
    const uploadedImage = req.file;
    const uploadedImageUrl = uploadedImage
      ? uploadedImage.path?.startsWith("http")
        ? uploadedImage.path
        : `${req.protocol}://${req.get("host")}/uploads/${uploadedImage.filename}`
      : "";

    if (!title || (!uploadedImage && !imageUrl)) {
      res.status(400);
      throw new Error("Title and image are required");
    }

    const post = await Post.create({
      title,
      description,
      category,
      sourceUrl,
      tags: typeof tags === "string" ? tags.split(",").map((tag) => tag.trim()) : tags,
      imageUrl: uploadedImageUrl || imageUrl,
      imagePublicId: uploadedImage?.filename || "",
      owner: req.user._id,
    });

    res.status(201).json(await populatePost(Post.findById(post._id)));
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const alreadyLiked = post.likes.some((id) => id.equals(req.user._id));
    post.likes = alreadyLiked
      ? post.likes.filter((id) => !id.equals(req.user._id))
      : [...post.likes, req.user._id];

    await post.save();
    res.json(await populatePost(Post.findById(post._id)));
  } catch (error) {
    next(error);
  }
};

const toggleSave = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const alreadySaved = post.saves.some((id) => id.equals(req.user._id));
    post.saves = alreadySaved
      ? post.saves.filter((id) => !id.equals(req.user._id))
      : [...post.saves, req.user._id];

    await Promise.all([
      post.save(),
      User.findByIdAndUpdate(req.user._id, {
        [alreadySaved ? "$pull" : "$addToSet"]: { savedPosts: post._id },
      }),
    ]);

    res.json(await populatePost(Post.findById(post._id)));
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) {
      res.status(400);
      throw new Error("Comment text is required");
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { text, user: req.user._id } } },
      { new: true }
    );

    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    res.status(201).json(await populatePost(Post.findById(post._id)));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  toggleLike,
  toggleSave,
  addComment,
};
