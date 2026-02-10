const Bookmark = require("../model/bookmark.model");
const isValidUrl = require("../utils/isValidUrl");
const { fetchTitle } = require("../services/metadata.service");

// POST /api/bookmarks
exports.createBookmark = async (req, res, next) => {
  try {
    let { url, title, description = "", tags = [] } = req.body;

    if (!url) {
      return res.status(400).json({ message: "URL is required" });
    }

    if (!isValidUrl(url)) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    if (!title) {
      title = await fetchTitle(url);
    }

    const bookmark = await Bookmark.create({
      userId: req.user.uid, // 🔐 lock bookmark to user
      url,
      title,
      description,
      tags,
    });

    res.status(201).json(bookmark);
  } catch (err) {
    next(err);
  }
};

// GET /api/bookmarks?q=&tags=
exports.getAllBookmarks = async (req, res, next) => {
  try {
    const { q, tags } = req.query;

    // 🔐 always filter by logged-in user
    const filter = { userId: req.user.uid };

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (tags) {
      filter.tags = { $in: tags.split(",") };
    }

    const bookmarks = await Bookmark.find(filter).sort({
      createdAt: -1,
    });

    res.json(bookmarks);
  } catch (err) {
    next(err);
  }
};

// GET /api/bookmarks/:id
exports.getBookmarkById = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      userId: req.user.uid, // 🔐 ownership check
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json(bookmark);
  } catch (err) {
    next(err);
  }
};

// PUT /api/bookmarks/:id
exports.updateBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid }, // 🔐
      req.body,
      { new: true },
    );

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json(bookmark);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/bookmarks/:id
exports.deleteBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid, // 🔐
    });

    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    res.json({ message: "Bookmark deleted successfully" });
  } catch (err) {
    next(err);
  }
};
