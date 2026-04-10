import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

function FindClub() {
  const navigate = useNavigate();

  const storedUserId =
    localStorage.getItem("userId") || localStorage.getItem("wormly_id");
  const userId = storedUserId ? Number(storedUserId) : null;

  const [clubs, setClubs] = useState([]);
  const [joinedClubIds, setJoinedClubIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joiningClubId, setJoiningClubId] = useState(null);
  const [joiningByCode, setJoiningByCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    const load = async () => {
      try {
        setErrorMessage("");

        const [clubsRes, userRes] = await Promise.all([
          fetch("http://localhost:5000/bookclubs/public"),
          fetch(`http://localhost:5000/bookclubs/user/${userId}`),
        ]);

        const clubsData = await clubsRes.json();
        const userData = await userRes.json();

        if (!clubsRes.ok) {
          throw new Error(clubsData.error || "Failed to load public clubs.");
        }

        if (!userRes.ok) {
          throw new Error(userData.error || "Failed to load your clubs.");
        }

        setClubs(clubsData);
        setJoinedClubIds(userData.map((c) => c.id));
      } catch (error) {
        console.error("Error loading clubs:", error);
        setErrorMessage(error.message || "Unable to load clubs.");
      }
    };

    load();
  }, [userId, navigate]);

  const handleJoin = async (clubId) => {
    if (!userId) {
      navigate("/");
      return;
    }

    if (joiningClubId || joinedClubIds.includes(clubId)) return;

    setJoiningClubId(clubId);

    try {
      const res = await fetch("http://localhost:5000/bookclubs/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, clubId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to join");
        return;
      }

      setJoinedClubIds((prev) => [...prev, clubId]);

      setClubs((prev) =>
        prev.map((c) =>
          c.id === clubId
            ? { ...c, number_members: c.number_members + 1 }
            : c
        )
      );
    } catch (error) {
      console.error("Error joining club:", error);
      alert("Something went wrong");
    } finally {
      setJoiningClubId(null);
    }
  };

  const handleJoinByCode = async () => {
    if (!userId) {
      navigate("/");
      return;
    }

    if (!joinCode.trim() || joiningByCode) return;

    setJoiningByCode(true);

    try {
      const res = await fetch("http://localhost:5000/bookclubs/join-by-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, code: joinCode.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed");
        return;
      }

      if (data.club) {
        setJoinedClubIds((prev) =>
          prev.includes(data.club.id) ? prev : [...prev, data.club.id]
        );

        setClubs((prev) => {
          const exists = prev.find((c) => c.id === data.club.id);

          if (exists) {
            return prev.map((c) =>
              c.id === data.club.id
                ? { ...c, number_members: c.number_members + 1 }
                : c
            );
          }

          return [
            ...prev,
            { ...data.club, number_members: data.club.number_members + 1 },
          ];
        });
      }

      setJoinCode("");
    } catch (error) {
      console.error("Error joining by code:", error);
      alert("Something went wrong");
    } finally {
      setJoiningByCode(false);
    }
  };

  const filtered = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return clubs;
    }

    return clubs.filter((club) => {
      const clubName = (club.club_name || "").toLowerCase();
      const bookTitle = (club.book_title || "").toLowerCase();
      const description = (club.club_description || "").toLowerCase();

      return (
        clubName.includes(search) ||
        bookTitle.includes(search) ||
        description.includes(search)
      );
    });
  }, [clubs, searchTerm]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 pb-28 md-computer:pb-8">
        <Link to="/home" className="text-sm underline text-gray-600">
          ← Back
        </Link>

        <div className="bg-[#cfe0c8] p-6 rounded-xl mt-3">
          <h1 className="text-3xl font-semibold">Find a Club</h1>

          <div className="flex gap-3 mt-4 flex-wrap">
            <input
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white"
            />

            <input
              placeholder="Private code"
              className="px-4 py-2 rounded-lg bg-white"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />

            <button
              onClick={handleJoinByCode}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              {joiningByCode ? "Joining..." : "Join by Code"}
            </button>
          </div>

          {errorMessage ? (
            <p className="text-red-600 mt-4">{errorMessage}</p>
          ) : null}
        </div>

        <div className="flex justify-between items-center mt-6 mb-4">
          <h2 className="text-2xl">Recommended Clubs</h2>

          <Link to="/my-clubs" className="text-sm underline text-gray-600">
            View all
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((club) => {
            const isFull = club.number_members >= club.max_members;
            const isJoined = joinedClubIds.includes(club.id);

            return (
              <div
                key={club.id}
                className="bg-[#b8d1b0] p-5 rounded-xl flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold">{club.book_title}</h3>
                  <p className="text-sm mt-1">• {club.number_members} members</p>

                  <p className="mt-2 font-medium">{club.club_name}</p>
                  <p className="text-sm mt-1">{club.club_description}</p>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    disabled={isFull || isJoined || joiningClubId === club.id}
                    onClick={() => handleJoin(club.id)}
                    className={`px-4 py-2 rounded ${
                      isFull
                        ? "bg-red-400 text-white"
                        : isJoined
                        ? "bg-green-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    {joiningClubId === club.id
                      ? "Joining..."
                      : isFull
                      ? "Full"
                      : isJoined
                      ? "Joined"
                      : "Join"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <MobileNavbar />
    </div>
  );
}

export default FindClub;