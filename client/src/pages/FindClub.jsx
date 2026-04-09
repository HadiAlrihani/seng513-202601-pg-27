import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

function FindClub() {
  const userId = 1; // temporary until auth is fully connected

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [joiningClubId, setJoiningClubId] = useState(null);
  const [joinedClubIds, setJoinedClubIds] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [joiningByCode, setJoiningByCode] = useState(false);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("http://localhost:5000/bookclubs/public");

        if (!response.ok) {
          throw new Error("Failed to fetch public clubs");
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

  const handleJoin = async (clubId) => {
    if (joiningClubId || joinedClubIds.includes(clubId)) {
      return;
    }

    setJoiningClubId(clubId);

    try {
      const response = await fetch("http://localhost:5000/bookclubs/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          clubId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to join club");
        return;
      }

      setClubs((prevClubs) =>
        prevClubs.map((club) =>
          club.id === clubId
            ? { ...club, number_members: club.number_members + 1 }
            : club
        )
      );

      setJoinedClubIds((prevIds) => [...prevIds, clubId]);
      alert("Joined successfully");
    } catch (err) {
      console.error("Error joining club:", err);
      alert("Something went wrong");
    } finally {
      setJoiningClubId(null);
    }
  };

  const handleJoinByCode = async () => {
    const trimmedCode = joinCode.trim();

    if (!trimmedCode) {
      alert("Please enter a club code");
      return;
    }

    if (joiningByCode) {
      return;
    }

    setJoiningByCode(true);

    try {
      const response = await fetch("http://localhost:5000/bookclubs/join-by-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          code: trimmedCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to join private club");
        return;
      }

      if (data.club) {
        setJoinedClubIds((prevIds) =>
          prevIds.includes(data.club.id) ? prevIds : [...prevIds, data.club.id]
        );

        setClubs((prevClubs) => {
          const alreadyExists = prevClubs.some((club) => club.id === data.club.id);

          if (alreadyExists) {
            return prevClubs.map((club) =>
              club.id === data.club.id
                ? { ...club, number_members: club.number_members + 1 }
                : club
            );
          }

          return [...prevClubs, { ...data.club, number_members: data.club.number_members }];
        });
      }

      setJoinCode("");
      alert("Joined private club successfully");
    } catch (err) {
      console.error("Error joining private club:", err);
      alert("Something went wrong");
    } finally {
      setJoiningByCode(false);
    }
  };

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

      if (selectedGenre === "All") {
        return matchesSearch;
      }

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
      <div className="mx-auto min-h-screen max-w-6xl overflow-hidden rounded-xl bg-zinc-50 shadow-lg">
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
              placeholder="Enter a code or name"
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
              {genres.map((genre) => (
                <option key={genre.id} value={genre.genre_name}>
                  {genre.genre_name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="border-b border-gray-200 bg-white px-6 py-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Join a private club
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Enter a private club code to join directly.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <input
                type="text"
                placeholder="Enter private club code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className="min-w-[220px] rounded-xl border-none bg-[#e9eee6] px-4 py-3 text-sm text-gray-800 outline-none ring-0 placeholder:text-gray-500"
              />

              <button
                onClick={handleJoinByCode}
                disabled={joiningByCode}
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  joiningByCode
                    ? "cursor-not-allowed bg-gray-300 text-gray-700"
                    : "bg-[#6b8b67] text-white hover:bg-[#5c7959]"
                }`}
              >
                {joiningByCode ? "Joining..." : "Join by Code"}
              </button>
            </div>
          </div>
        </section>

        <section className="px-6 py-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-medium text-gray-900">
              Recommended Clubs
            </h2>
              <Link to="/my-clubs" className="text-sm text-gray-700 underline">
              View all
            </Link>
          </div>

          {filteredClubs.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center text-gray-600">
              No public book clubs found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredClubs.map((club) => {
                const isFull = club.number_members >= club.max_members;
                const isJoining = joiningClubId === club.id;
                const isJoined = joinedClubIds.includes(club.id);
                const shouldDisable = isFull || isJoining || isJoined;

                let buttonText = "Join";
                if (isFull) buttonText = "Full";
                else if (isJoining) buttonText = "Joining...";
                else if (isJoined) buttonText = "Joined";

                let buttonClass = "bg-white text-gray-900 hover:bg-gray-100";

                if (isFull) {
                  buttonClass = "cursor-not-allowed bg-red-400 text-white";
                } else if (isJoined) {
                  buttonClass = "cursor-not-allowed bg-green-600 text-white";
                } else if (isJoining) {
                  buttonClass = "cursor-not-allowed bg-gray-300 text-gray-700";
                }

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
                        disabled={shouldDisable}
                        onClick={() => handleJoin(club.id)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium ${buttonClass}`}
                      >
                        {buttonText}
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