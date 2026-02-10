const Note = require("../model/note.model");

// POST /api/notes
exports.createNote = async (req, res, next) => {
  try {
    const { title, description = "", tags = [] } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const note = await Note.create({
      userId: req.user.uid, // 🔐 lock note to user
      title,
      description,
      tags,
    });

    res.status(201).json(note);
  } catch (err) {
    next(err);
  }
};

// GET /api/notes?q=&tags=
exports.getAllNotes = async (req, res, next) => {
  try {
    const { q, tags } = req.query;

    // 🔐 always start with userId filter
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

    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    next(err);
  }
};

// GET /api/notes/:id
exports.getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.uid, // 🔐 ownership check
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (err) {
    next(err);
  }
};

// PUT /api/notes/:id
exports.updateNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid }, // 🔐
      req.body,
      { new: true },
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json(note);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/notes/:id
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid, // 🔐
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (err) {
    next(err);
  }
};
