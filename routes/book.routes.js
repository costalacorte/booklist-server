const express = require("express");
const router = express.Router();

const Book = require("../models/Book.model");
const { isAuthenticated } = require("../middleware/jwt.middleware.js");

// CREATE -> POST /api/books
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const { title, author, year, isRead } = req.body;
    const owner = req.payload._id; // vem do token do usuário logado

    const newBook = await Book.create({ title, author, year, isRead, owner });
    res.status(201).json(newBook);
  } catch (err) {
    next(err);
  }
});

// READ (todos os livros do usuário logado) -> GET /api/books
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
    const owner = req.payload._id;

    const updatedBook = await Book.findOneAndUpdate(
      { _id: req.params.id, owner },
      req.body,
      { new: true }
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
    const owner = req.payload._id;

    const deletedBook = await Book.findOneAndDelete({
      _id: req.params.id,
      owner,
    });

    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
