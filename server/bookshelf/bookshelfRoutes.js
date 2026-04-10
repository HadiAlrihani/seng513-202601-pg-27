// Routes for the bookshelf feature.
// All routes require a valid JWT (enforced by requireAuth middleware).
// Note: /books must be declared before /:bookId so Express doesn't
// interpret the string "books" as a bookId parameter.

import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  getBookshelf,
  getAllBooks,
  addBook,
  updateBook,
  removeBook,
  searchGoogleBooks,
  addBookFromSearch,
} from "./bookshelfController.js";

const router = express.Router();

router.get("/search", requireAuth, searchGoogleBooks); // Search Google Books API
router.get("/books", requireAuth, getAllBooks);         // Get all available books (for dropdown)
router.get("/", requireAuth, getBookshelf);             // Get user's full bookshelf
router.post("/from-google", requireAuth, addBookFromSearch); // Add a search result to the shelf
router.post("/", requireAuth, addBook);                 // Add an existing catalog book to the shelf
router.patch("/:bookId", requireAuth, updateBook);      // Update status/rating/review
router.delete("/:bookId", requireAuth, removeBook);     // Remove a book from the shelf

export default router;
