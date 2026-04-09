import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

function FindClub() {
  const userId = 1;

  const [clubs, setClubs] = useState([]);
  const [joinedClubIds, setJoinedClubIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [joiningClubId, setJoiningClubId] = useState(null);
  const [joiningByCode, setJoiningByCode] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [clubsRes, userRes] = await Promise.all([
        fetch("http://localhost:5000/bookclubs/public"),
        fetch(`http://localhost:5000/bookclubs/user/${userId}`),
      ]);

      const clubsData = await clubsRes.json();
      const userData = await userRes.json();

      setClubs(clubsData);
      setJoinedClubIds(userData.map((c) => c.id));
    };

    load();
  }, []);

  const handleJoin = async (clubId) => {
    if (joiningClubId || joinedClubIds.includes(clubId)) return;

    setJoiningClubId(clubId);

    const res = await fetch("http://localhost:5000/bookclubs/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, clubId }),
    });

    if (!res.ok) {
      alert("Failed to join");
      setJoiningClubId(null);
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

    setJoiningClubId(null);
  };

  const handleJoinByCode = async () => {
    if (!joinCode || joiningByCode) return;

    setJoiningByCode(true);

    const res = await fetch("http://localhost:5000/bookclubs/join-by-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, code: joinCode }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed");
      setJoiningByCode(false);
      return;
    }

    if (data.club) {
      setJoinedClubIds((prev) => [...prev, data.club.id]);

      setClubs((prev) => {
        const exists = prev.find((c) => c.id === data.club.id);

        if (exists) {
          return prev.map((c) =>
            c.id === data.club.id
              ? { ...c, number_members: c.number_members + 1 }
              : c
          );
        }

        return [...prev, data.club];
      });
    }

    setJoinCode("");
    setJoiningByCode(false);
  };

  const filtered = useMemo(() => {
    return clubs.filter((c) =>
      c.club_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clubs, searchTerm]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 pb-28 md-computer:pb-8">

        {/* BACK ONLY */}
        <Link to="/home" className="text-sm underline text-gray-600">
          ← Back
        </Link>

        {/* HEADER */}
        <div className="bg-[#cfe0c8] p-6 rounded-xl mt-3">
          <h1 className="text-3xl font-semibold">Find a Club</h1>

          <div className="flex gap-3 mt-4 flex-wrap">
            <input
              placeholder="Search clubs..."
              className="px-4 py-2 rounded-lg bg-white"
              onChange={(e) => setSearchTerm(e.target.value)}
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
        </div>

        {/* TITLE + VIEW ALL */}
        <div className="flex justify-between items-center mt-6 mb-4">
          <h2 className="text-2xl">Recommended Clubs</h2>

          <Link
            to="/my-clubs"
            className="text-sm underline text-gray-600"
          >
            View all
          </Link>
        </div>

        {/* CLUBS */}
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
                  <p className="text-sm mt-1">
                    • {club.number_members} members
                  </p>

                  <p className="mt-2 font-medium">{club.club_name}</p>
                  <p className="text-sm mt-1">
                    {club.club_description}
                  </p>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    disabled={isFull || isJoined}
                    onClick={() => handleJoin(club.id)}
                    className={`px-4 py-2 rounded ${
                      isFull
                        ? "bg-red-400 text-white"
                        : isJoined
                        ? "bg-green-600 text-white"
                        : "bg-white"
                    }`}
                  >
                    {isFull ? "Full" : isJoined ? "Joined" : "Join"}
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