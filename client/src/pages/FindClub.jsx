import { useEffect, useMemo, useState } from "react";

function FindClub() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("http://localhost:5000/bookclubs/public");

        if (!response.ok) {
          throw new Error("Failed to fetch public book clubs");
        }

        const data = await response.json();
        setClubs(data);
      } catch (err) {
        console.error("Error fetching clubs:", err);
        setError("Could not load book clubs.");
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const filteredClubs = useMemo(() => {
    return clubs.filter((club) => {
      const clubName = club.club_name?.toLowerCase() || "";
      const bookTitle = club.book_title?.toLowerCase() || "";
      const description = club.club_description?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        clubName.includes(search) ||
        bookTitle.includes(search) ||
        description.includes(search);

      if (selectedGenre === "All") return matchesSearch;

      return matchesSearch && bookTitle.includes(selectedGenre.toLowerCase());
    });
  }, [clubs, searchTerm, selectedGenre]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-800 px-4 py-8">
        <div className="mx-auto max-w-6xl rounded-xl bg-zinc-50 p-8 text-center text-gray-700 shadow-lg">
          Loading public book clubs...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-800 px-4 py-8">
        <div className="mx-auto max-w-6xl rounded-xl bg-zinc-50 p-8 text-center text-red-600 shadow-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-800 px-4 py-8">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-xl bg-zinc-50 shadow-lg">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#dfe9d9] text-sm font-semibold text-[#6b8b67]">
              WC
            </div>
            <div className="text-2xl font-medium text-gray-900">
              Wormly Connected
            </div>
          </div>

          <div className="text-2xl">👤</div>
        </header>

        <section className="flex flex-col gap-4 bg-[#cfe0c8] px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-3xl font-medium tracking-wide text-gray-900">
            FIND A CLUB
          </h1>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <input
              type="text"
              placeholder="Enter a code"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-w-[200px] rounded-xl border-none bg-[#e9eee6] px-4 py-3 text-sm text-gray-800 outline-none ring-0 placeholder:text-gray-500"
            />

            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="min-w-[200px] rounded-xl border-none bg-[#e9eee6] px-4 py-3 text-sm text-gray-800 outline-none ring-0"
            >
              <option value="All">Select a genre</option>
              <option value="Dune">Dune</option>
              <option value="1984">1984</option>
              <option value="Fiction">Fiction</option>
              <option value="Romance">Romance</option>
            </select>
          </div>
        </section>

        <section className="px-6 py-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-medium text-gray-900">
              Recommended Clubs
            </h2>
            <button className="text-sm text-gray-700 underline">
              View all
            </button>
          </div>

          {filteredClubs.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center text-gray-600">
              No public book clubs found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredClubs.map((club) => {
                const isFull = club.number_members >= club.max_members;

                return (
                  <div
                    key={club.id}
                    className="flex min-h-[190px] flex-col justify-between rounded-2xl bg-[#b8d1b0] p-5"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {club.book_title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-700">
                        • {club.number_members} members
                      </p>

                      <p className="mt-3 text-sm font-semibold text-[#223025]">
                        {club.club_name}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#38443b]">
                        {club.club_description}
                      </p>
                    </div>

                    <div className="mt-5 flex justify-end">
                      <button
                        disabled={isFull}
                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                          isFull
                            ? "cursor-not-allowed bg-red-400 text-white"
                            : "bg-white text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {isFull ? "Full" : "Join"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default FindClub;