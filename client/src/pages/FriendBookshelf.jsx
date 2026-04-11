import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

const TABS = [
  { key: "reading", label: "Reading" },
  { key: "to_read", label: "To Read" },
  { key: "finished", label: "Finished" },
];

export default function FriendBookshelf() {
  const navigate = useNavigate();
  const { friendId } = useParams();

  const storedUserId =
    localStorage.getItem("userId") || localStorage.getItem("wormly_id");
  const userId = storedUserId ? Number(storedUserId) : null;

  const [friend, setFriend] = useState(null);
  const [shelf, setShelf] = useState({ to_read: [], reading: [], finished: [] });
  const [activeTab, setActiveTab] = useState("reading");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    fetch(`http://localhost:5000/friends/${userId}/bookshelf/${friendId}`)
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Could not load friend's bookshelf.");
        }

        setFriend(data.friend);
        setShelf(data.shelf);
      })
      .catch((err) => {
        setError(err.message || "Could not load friend's bookshelf.");
      })
      .finally(() => setLoading(false));
  }, [userId, friendId, navigate]);

  return (
    <div className="min-h-screen bg-neutral-800 px-4 py-8 pb-[12vh] md-computer:pb-8">
      <Navbar />

      <div className="mx-auto max-w-5xl mt-4 rounded-xl bg-zinc-50 shadow-lg overflow-hidden">
        <header className="bg-[#cfe0c8] px-4 py-4 md:px-6 md:py-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <button
              onClick={() => navigate("/friends")}
              className="bg-white rounded-lg px-2 py-1.5 md:px-3 text-sm font-medium hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              ← Back
            </button>
            <h1 className="text-xl md:text-3xl font-medium tracking-wide font-italiana truncate">
              {friend ? `${friend.username}'s Bookshelf` : "Friend's Bookshelf"}
            </h1>
          </div>
        </header>

        <div className="flex border-b border-gray-200 bg-white">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 px-2 py-3 md:px-6 md:py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === key
                  ? "border-[#6b8b67] text-[#6b8b67]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
              <span className="ml-1 md:ml-2 bg-[#dfe9d9] text-[#6b8b67] text-xs rounded-full px-1.5 md:px-2 py-0.5">
                {shelf[key].length}
              </span>
            </button>
          ))}
        </div>

        <section className="px-6 py-8">
          {loading && (
            <p className="text-center text-gray-500 py-12">Loading bookshelf...</p>
          )}

          {error && (
            <p className="text-center text-red-500 py-12">{error}</p>
          )}

          {!loading && !error && shelf[activeTab].length === 0 && (
            <p className="text-center text-gray-500 py-12">
              No books here yet.
            </p>
          )}

          {!loading && !error && shelf[activeTab].length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {shelf[activeTab].map((book) => (
                <div
                  key={book.book_id}
                  className="flex gap-4 rounded-2xl bg-[#b8d1b0] p-5 min-h-[160px]"
                >
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

                    <div className="flex gap-1 mt-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className="text-xl md:text-lg leading-none py-1 px-0.5"
                        >
                          {star <= (book.rating || 0) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>

                    {book.review ? (
                      <div className="mt-2 bg-white/60 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-700 italic">"{book.review}"</p>
                        {book.reviewed_at && (
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(book.reviewed_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-700 mt-2 italic">
                        No review added.
                      </p>
                    )}
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