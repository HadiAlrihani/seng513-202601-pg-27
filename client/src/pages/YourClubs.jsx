import { useEffect, useState } from "react";

function YourClubs() {
  const userId = 1; // temporary until auth is connected

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [leavingClubId, setLeavingClubId] = useState(null);

  useEffect(() => {
    const fetchUserClubs = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/bookclubs/user/${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch joined clubs");
        }

        const data = await response.json();
        setClubs(data);
      } catch (err) {
        console.error("Error fetching user clubs:", err);
        setError("Could not load your clubs.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserClubs();
  }, [userId]);

  const handleLeaveClub = async (clubId) => {
    if (leavingClubId) {
      return;
    }

    setLeavingClubId(clubId);

    try {
      const response = await fetch("http://localhost:5000/bookclubs/leave", {
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
        alert(data.error || "Failed to leave club");
        return;
      }

      setClubs((prevClubs) => prevClubs.filter((club) => club.id !== clubId));
      alert("Left club successfully");
    } catch (err) {
      console.error("Error leaving club:", err);
      alert("Something went wrong");
    } finally {
      setLeavingClubId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-800 px-4 py-8">
        <div className="mx-auto max-w-6xl rounded-xl bg-zinc-50 p-8 text-center text-gray-700 shadow-lg">
          Loading your clubs...
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

        <section className="bg-[#cfe0c8] px-6 py-6">
          <h1 className="text-3xl font-medium tracking-wide text-gray-900">
            YOUR CLUBS
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View the clubs you have already joined and leave them if needed.
          </p>
        </section>

        <section className="px-6 py-8">
          {clubs.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center text-gray-600">
              You have not joined any clubs yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {clubs.map((club) => {
                const isLeaving = leavingClubId === club.id;

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
                        disabled={isLeaving}
                        onClick={() => handleLeaveClub(club.id)}
                        className={`rounded-lg px-4 py-2 text-sm font-medium ${
                          isLeaving
                            ? "cursor-not-allowed bg-gray-300 text-gray-700"
                            : "bg-white text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        {isLeaving ? "Leaving..." : "Leave"}
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

export default YourClubs;