import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

function YourClubs() {
  const userId = 1;
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        `http://localhost:5000/bookclubs/user/${userId}`
      );
      const data = await res.json();
      setClubs(data);
    };

    load();
  }, []);

  const handleLeave = async (clubId) => {
    await fetch("http://localhost:5000/bookclubs/leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, clubId }),
    });

    setClubs((prev) => prev.filter((c) => c.id !== clubId));
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6 pb-28 md-computer:pb-8">

        <Link to="/clubs" className="text-sm underline text-gray-600">
          ← Back
        </Link>

        <h1 className="text-3xl mt-3 mb-6">Your Clubs</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
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
                  onClick={() => handleLeave(club.id)}
                  className="px-4 py-2 bg-white rounded"
                >
                  Leave
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MobileNavbar />
    </div>
  );
}

export default YourClubs;