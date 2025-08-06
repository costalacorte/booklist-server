const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Book = require("../models/Book.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// ✅ TEST ROUTE — temporária só para verificar se está funcionando
router.get("/test", (req, res) => {
  console.log("✅ Test route reached");
  res.json({ message: "Test successful!" });
});

// ✅ READ ONE -> GET /api/books/:id — DEIXAR PRIMEIRO!
router.get("/:id", isAuthenticated, async (req, res, next) => {
  console.log("🔍 GET /api/books/:id called with id:", req.params.id);
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const owner = req.payload._id;
    const book = await Book.findOne({ _id: id, owner });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (err) {
    console.error("❌ Error in GET /:id:", err);
    next(err);
  }
});

// CREATE -> POST /api/books
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { title, author, year, isRead } = req.body;
    const owner = req.payload._id;
    const newBook = await Book.create({ title, author, year, isRead, owner });
    res.status(201).json(newBook);
  } catch (err) {
    next(err);
  }
});

// READ ALL -> GET /api/books
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const owner = req.payload._id;
    const books = await Book.find({ owner }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    next(err);
  }
});

// UPDATE -> PUT /api/books/:id
router.put("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const owner = req.payload._id;

    const updatedBook = await Book.findOneAndUpdate(
      { _id: id, owner },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);
  } catch (err) {
    next(err);
  }
});

// DELETE -> DELETE /api/books/:id
router.delete("/:id", isAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book id" });
    }

    const owner = req.payload._id;

    const deletedBook = await Book.findOneAndDelete({ _id: id, owner });

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
