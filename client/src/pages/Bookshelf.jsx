// Bookshelf page — lets users track books across three reading states:
// "To Read", "Reading", and "Finished".
// Books can be added, have their status changed, or be removed.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

// Tab definitions in display order
const TABS = [
  { key: "reading", label: "Reading" },
  { key: "to_read", label: "To Read" },
  { key: "finished", label: "Finished" },
];

export default function Bookshelf() {
  const navigate = useNavigate();

  // Shelf data grouped by read_status
  const [shelf, setShelf] = useState({ to_read: [], reading: [], finished: [] });
  // All books available in the catalog (for the add-book dropdown)
  const [allBooks, setAllBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("reading");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add book form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addBookId, setAddBookId] = useState("");
  const [addStatus, setAddStatus] = useState("to_read");

  // Fetch the user's shelf and full book catalog on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirect to login if not authenticated
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("http://localhost:5000/bookshelf/", { headers }),
      fetch("http://localhost:5000/bookshelf/books", { headers }),
    ])
      .then(async ([shelfRes, booksRes]) => {
        if (!shelfRes.ok) throw new Error("Auth failed");
        const shelfData = await shelfRes.json();
        const booksData = await booksRes.json();
        setShelf(shelfData);
        setAllBooks(booksData);
      })
      .catch(() => setError("Could not load bookshelf. Please try again."))
      .finally(() => setLoading(false));
  }, [navigate]);

  // Add a book to the shelf via POST /bookshelf/
  const handleAddBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/bookshelf/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ book_id: parseInt(addBookId), read_status: addStatus }),
    });

    if (res.ok) {
      const newEntry = await res.json();
      // Add to the correct shelf bucket
      setShelf((prev) => ({
        ...prev,
        [newEntry.read_status]: [...prev[newEntry.read_status], newEntry],
      }));
      setShowAddForm(false);
      setAddBookId("");
      setActiveTab(newEntry.read_status); // Switch to the tab the book was added to
    }
  };

  // Move a book to a different status bucket via PATCH /bookshelf/:bookId
  const handleStatusChange = async (bookId, newStatus) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/bookshelf/${bookId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ read_status: newStatus }),
    });

    if (res.ok) {
      // Rebuild shelf state: update the status and re-group all entries
      setShelf((prev) => {
        const all = [...prev.to_read, ...prev.reading, ...prev.finished];
        const updated = all.map((b) =>
          b.book_id === bookId ? { ...b, read_status: newStatus } : b
        );
        return {
          to_read: updated.filter((b) => b.read_status === "to_read"),
          reading: updated.filter((b) => b.read_status === "reading"),
          finished: updated.filter((b) => b.read_status === "finished"),
        };
      });
    }
  };

  // Remove a book from the shelf via DELETE /bookshelf/:bookId
  const handleRemove = async (bookId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/bookshelf/${bookId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setShelf((prev) => ({
        to_read: prev.to_read.filter((b) => b.book_id !== bookId),
        reading: prev.reading.filter((b) => b.book_id !== bookId),
        finished: prev.finished.filter((b) => b.book_id !== bookId),
      }));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-800 px-4 py-8 pb-[12vh] md-computer:pb-8">
      <Navbar />

      <div className="mx-auto max-w-5xl mt-4 rounded-xl bg-zinc-50 shadow-lg overflow-hidden">

        {/* Page header with title and add-book toggle */}
        <header className="bg-[#cfe0c8] px-6 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-medium tracking-wide font-italiana">My Bookshelf</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            {showAddForm ? "Cancel" : "+ Add Book"}
          </button>
        </header>

        {/* Collapsible add-book form */}
        {showAddForm && (
          <form
            onSubmit={handleAddBook}
            className="px-6 py-4 bg-[#e9eee6] flex gap-4 flex-wrap items-end border-b border-gray-200"
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Book</label>
              <select
                value={addBookId}
                onChange={(e) => setAddBookId(e.target.value)}
                required
                className="rounded-xl bg-white px-4 py-3 text-sm min-w-[220px] border border-gray-300"
              >
                <option value="">Select a book...</option>
                {allBooks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title} — {b.author}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Status</label>
              <select
                value={addStatus}
                onChange={(e) => setAddStatus(e.target.value)}
                className="rounded-xl bg-white px-4 py-3 text-sm border border-gray-300"
              >
                <option value="to_read">To Read</option>
                <option value="reading">Reading</option>
                <option value="finished">Finished</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-[#b8d1b0] rounded-lg px-5 py-3 text-sm font-medium hover:bg-[#a5c4a0] transition-colors"
            >
              Add
            </button>
          </form>
        )}

        {/* Tab navigation */}
        <div className="flex border-b border-gray-200 bg-white px-6">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? "border-[#6b8b67] text-[#6b8b67]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
              {/* Badge showing count for each tab */}
              <span className="ml-2 bg-[#dfe9d9] text-[#6b8b67] text-xs rounded-full px-2 py-0.5">
                {shelf[key].length}
              </span>
            </button>
          ))}
        </div>

        {/* Book list for the active tab */}
        <section className="px-6 py-8">
          {loading && (
            <p className="text-center text-gray-500 py-12">Loading your bookshelf...</p>
          )}
          {error && (
            <p className="text-center text-red-500 py-12">{error}</p>
          )}
          {!loading && !error && shelf[activeTab].length === 0 && (
            <p className="text-center text-gray-500 py-12">
              No books here yet. Add one above!
            </p>
          )}
          {!loading && !error && shelf[activeTab].length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {shelf[activeTab].map((book) => (
                <div
                  key={book.book_id}
                  className="flex gap-4 rounded-2xl bg-[#b8d1b0] p-5 min-h-[160px]"
                >
                  {/* Cover image */}
                  {book.cover_image && (
                    <img
                      src={book.cover_image}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}

                  <div className="flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{book.title}</h3>
                      <p className="text-sm text-gray-700 mt-1">{book.author}</p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Status change dropdown */}
                      <select
                        value={book.read_status}
                        onChange={(e) => handleStatusChange(book.book_id, e.target.value)}
                        className="text-xs rounded-lg bg-white px-2 py-1 border border-gray-300"
                      >
                        <option value="to_read">To Read</option>
                        <option value="reading">Reading</option>
                        <option value="finished">Finished</option>
                      </select>
                      <button
                        onClick={() => handleRemove(book.book_id)}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <MobileNavbar />
    </div>
  );
}
