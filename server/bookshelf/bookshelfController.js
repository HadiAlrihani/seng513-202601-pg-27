// Controller for bookshelf operations.
// All handlers receive req.userId from the requireAuth middleware.

import { pool } from "../authentication/dbConfig.js";

// GET /bookshelf/
// Returns the user's bookshelf grouped into three arrays by read_status.
export const getBookshelf = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT ub.book_id, ub.read_status, ub.date_started, ub.date_finished,
              ub.rating, ub.review, ub.is_favorite,
              b.title, b.author, b.cover_image, b.book_length
       FROM user_books ub
       JOIN books b ON ub.book_id = b.id
       WHERE ub.user_id = $1
       ORDER BY b.title ASC`,
      [req.userId]
    );

    // Group rows by status on the server so the client doesn't have to filter
    const grouped = { to_read: [], reading: [], finished: [] };
    for (const row of result.rows) {
      grouped[row.read_status].push(row);
    }

    return res.status(200).json(grouped);
  } catch (err) {
    console.error("Error fetching bookshelf:", err);
    return res.status(500).json({ error: "Failed to fetch bookshelf" });
  }
};

// GET /bookshelf/search?q=...
// Searches the Open Library API (free, no key required) and returns normalized results.
export const searchGoogleBooks = async (req, res) => {
  const { q } = req.query;
  if (!q || !q.trim()) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10&fields=key,title,author_name,cover_i,number_of_pages_median`;
    const response = await fetch(url);
    const data = await response.json();

    const results = (data.docs || []).map((book) => ({
      google_books_id: book.key,
      title: book.title || "Unknown Title",
      author: (book.author_name || ["Unknown Author"]).join(", "),
      cover_image: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null,
      book_length: book.number_of_pages_median || 0,
      book_description: null,
    }));

    return res.status(200).json(results);
  } catch (err) {
    console.error("Open Library fetch error:", err.message);
    return res.status(500).json({ error: "Failed to search books" });
  }
};

// POST /bookshelf/from-google
// Upserts a book from the Open Library search into the books table, then adds it to the user's shelf.
// Body: { googleBook: { google_books_id, title, author, cover_image, book_length, book_description }, read_status }
export const addBookFromSearch = async (req, res) => {
  const { googleBook, read_status } = req.body;
  const validStatuses = ["to_read", "reading", "finished"];

  if (!googleBook?.google_books_id || !validStatuses.includes(read_status)) {
    return res.status(400).json({ error: "Invalid book data or read_status" });
  }

  const { google_books_id, title, author, cover_image, book_length, book_description } = googleBook;

  const date_started = read_status === "reading" ? new Date() : null;
  const date_finished = read_status === "finished" ? new Date() : null;

  try {
    // Upsert the book by external ID so we never create duplicates
    const bookResult = await pool.query(
      `INSERT INTO books (google_books_id, title, author, cover_image, book_length, book_description)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (google_books_id) DO UPDATE SET
         title = EXCLUDED.title,
         author = EXCLUDED.author,
         cover_image = EXCLUDED.cover_image
       RETURNING id`,
      [google_books_id, title, author, cover_image, book_length || 0, book_description]
    );

    const bookId = bookResult.rows[0].id;

    const insertResult = await pool.query(
      `INSERT INTO user_books (user_id, book_id, read_status, date_started, date_finished)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, book_id) DO NOTHING
       RETURNING book_id`,
      [req.userId, bookId, read_status, date_started, date_finished]
    );

    if (insertResult.rows.length === 0) {
      return res.status(409).json({ error: "This book is already on your shelf" });
    }

    const result = await pool.query(
      `SELECT ub.book_id, ub.read_status, ub.date_started, ub.date_finished,
              ub.rating, ub.review, ub.is_favorite,
              b.title, b.author, b.cover_image, b.book_length
       FROM user_books ub
       JOIN books b ON ub.book_id = b.id
       WHERE ub.user_id = $1 AND ub.book_id = $2`,
      [req.userId, bookId]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding book:", err);
    return res.status(500).json({ error: "Failed to add book" });
  }
};

// GET /bookshelf/books
// Returns all books in the catalog (used to populate the "add book" dropdown).
export const getAllBooks = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, title, author, cover_image FROM books ORDER BY title ASC"
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching books:", err);
    return res.status(500).json({ error: "Failed to fetch books" });
  }
};

// POST /bookshelf/
// Adds a book to the user's shelf. Body: { book_id, read_status }
// Silently ignores duplicate entries (ON CONFLICT DO NOTHING).
export const addBook = async (req, res) => {
  const { book_id, read_status } = req.body;
  const validStatuses = ["to_read", "reading", "finished"];

  if (!book_id || !validStatuses.includes(read_status)) {
    return res.status(400).json({ error: "Invalid book_id or read_status" });
  }

  // Automatically record dates based on the initial status
  const date_started = read_status === "reading" ? new Date() : null;
  const date_finished = read_status === "finished" ? new Date() : null;

  try {
    await pool.query(
      `INSERT INTO user_books (user_id, book_id, read_status, date_started, date_finished)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, book_id) DO NOTHING`,
      [req.userId, book_id, read_status, date_started, date_finished]
    );

    // Return the full row (existing or newly inserted) with book details
    const result = await pool.query(
      `SELECT ub.book_id, ub.read_status, ub.date_started, ub.date_finished,
              ub.rating, ub.review, ub.is_favorite,
              b.title, b.author, b.cover_image, b.book_length
       FROM user_books ub
       JOIN books b ON ub.book_id = b.id
       WHERE ub.user_id = $1 AND ub.book_id = $2`,
      [req.userId, book_id]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error adding book:", err);
    return res.status(500).json({ error: "Failed to add book" });
  }
};

// PATCH /bookshelf/:bookId
// Updates any subset of { read_status, rating, review, is_favorite }.
// Also auto-updates date_started / date_finished on status transitions.
export const updateBook = async (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const { read_status, rating, review, is_favorite } = req.body;
  const validStatuses = ["to_read", "reading", "finished"];

  // Build dynamic SET clause from whichever fields were sent
  const updates = [];
  const values = [];
  let idx = 1;

  if (read_status !== undefined) {
    if (!validStatuses.includes(read_status)) {
      return res.status(400).json({ error: "Invalid read_status" });
    }
    updates.push(`read_status = $${idx++}`);
    values.push(read_status);

    // Sync date fields with the new status
    updates.push(`date_started = $${idx++}`);
    values.push(read_status === "reading" ? new Date() : null);

    updates.push(`date_finished = $${idx++}`);
    values.push(read_status === "finished" ? new Date() : null);
  }

  if (rating !== undefined) {
    updates.push(`rating = $${idx++}`);
    values.push(rating);
  }
  if (review !== undefined) {
    updates.push(`review = $${idx++}`);
    values.push(review);
  }
  if (is_favorite !== undefined) {
    updates.push(`is_favorite = $${idx++}`);
    values.push(is_favorite);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  values.push(req.userId, bookId);

  try {
    const result = await pool.query(
      `UPDATE user_books SET ${updates.join(", ")}
       WHERE user_id = $${idx++} AND book_id = $${idx}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found in bookshelf" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error updating book:", err);
    return res.status(500).json({ error: "Failed to update book" });
  }
};

// DELETE /bookshelf/:bookId
// Removes a book from the user's shelf.
export const removeBook = async (req, res) => {
  const bookId = parseInt(req.params.bookId);

  try {
    const result = await pool.query(
      "DELETE FROM user_books WHERE user_id = $1 AND book_id = $2 RETURNING book_id",
      [req.userId, bookId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Book not found in bookshelf" });
    }

    return res.status(200).json({ message: "Book removed", book_id: bookId });
  } catch (err) {
    console.error("Error removing book:", err);
    return res.status(500).json({ error: "Failed to remove book" });
  }
};
