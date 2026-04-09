import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

function YourClubs() {
    const navigate = useNavigate();

    const storedUserId =
        localStorage.getItem("userId") || localStorage.getItem("wormly_id");
    const userId = storedUserId ? Number(storedUserId) : null;

    const [clubs, setClubs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [leavingClubId, setLeavingClubId] = useState(null);

    const loadUserClubs = async () => {
        if (!userId) {
            navigate("/");
            return;
        }

        try {
            setIsLoading(true);
            setErrorMessage("");

            const response = await fetch(`http://localhost:5000/bookclubs/user/${userId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to load your clubs.");
            }

            setClubs(data);
        } catch (error) {
            console.error("Error loading user clubs:", error);
            setErrorMessage(error.message || "Unable to load your clubs.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUserClubs();
    }, [userId]);

    const handleLeave = async (clubId) => {
        if (!userId) {
            navigate("/");
            return;
        }

        try {
            setLeavingClubId(clubId);

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
                alert(data.error || "Failed to leave club.");
                return;
            }

            await loadUserClubs();
        } catch (error) {
            console.error("Error leaving club:", error);
            alert("Something went wrong while leaving the club.");
        } finally {
            setLeavingClubId(null);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-6 pb-28 md-computer:pb-8">
                <Link to="/clubs" className="text-sm underline text-gray-600">
                    ← Back
                </Link>

                <div className="mt-3 mb-6">
                    <h1 className="font-playfair text-3xl md:text-4xl">Your Clubs</h1>
                    <p className="text-zinc-700 mt-2">
                        Continue reading, track your progress, and join spoiler-safe discussions.
                    </p>
                </div>

                <div className= "flex flex-col md:flex-row gap-3 mb-5">
                    <button
                        onClick={loadUserClubs}
                        className="mb-5 px-4 py-2 rounded-2xl bg-white border border-[#c8d5c3] hover:bg-[#f7faf6] transition"
                    >
                        Refresh Clubs
                    </button>
                    <button
                        onClick={() => navigate("/create-clubs")}
                        className="mb-5 px-4 py-2 rounded-2xl bg-white border border-[#c8d5c3] hover:bg-[#f7faf6] transition"
                    >
                        Add a Club 
                    </button>
                </div>
                {isLoading ? (
                    <div className="bg-white/80 border border-[#dde6d8] rounded-[24px] p-6">
                        Loading your clubs...
                    </div>
                ) : errorMessage ? (
                    <div className="bg-white/80 border border-red-200 rounded-[24px] p-6 text-red-600">
                        {errorMessage}
                    </div>
                ) : clubs.length === 0 ? (
                    <div className="bg-[#dce8d6] border border-[#bfd1b7] rounded-[24px] p-6 shadow-sm">
                        <p className="text-zinc-800">You have not joined any clubs yet.</p>
                        <button
                            onClick={() => navigate("/clubs")}
                            className="mt-4 px-4 py-2 rounded-2xl bg-white border border-[#c8d5c3] hover:bg-[#f7faf6] transition"
                        >
                            Find a Club
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {clubs.map((club) => (
                            <div
                                key={club.id}
                                className="bg-[#dce8d6] border border-[#bfd1b7] rounded-[24px] p-5 shadow-sm"
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="max-w-2xl">
                                        <p className="text-xs uppercase tracking-wide text-zinc-600">
                                            {club.user_role || "member"} · {club.number_members} members
                                        </p>

                                        <h2 className="font-playfair text-2xl mt-1">
                                            {club.club_name}
                                        </h2>

                                        <p className="text-zinc-700 mt-1">{club.book_title}</p>

                                        <p className="text-sm text-zinc-700 mt-3 leading-6">
                                            {club.club_description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mt-4 text-sm">
                                            <span className="bg-white/75 border border-[#d4ddd0] rounded-full px-3 py-1">
                                                Current checkpoint:{" "}
                                                {club.progress_checkpoint !== null &&
                                                club.progress_checkpoint !== undefined
                                                    ? club.progress_checkpoint
                                                    : "Not started"}
                                            </span>

                                            <span className="bg-white/75 border border-[#d4ddd0] rounded-full px-3 py-1">
                                                {club.visibility}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-3 md:min-w-[170px]">
                                        <button
                                            onClick={() => navigate(`/clubs/${club.id}/discussion`)}
                                            className="flex-1 md:flex-none px-4 py-2 rounded-2xl bg-white border border-[#c8d5c3] hover:bg-[#f7faf6] transition"
                                        >
                                            Discussion
                                        </button>

                                        <button
                                            onClick={() => handleLeave(club.id)}
                                            disabled={leavingClubId === club.id}
                                            className="flex-1 md:flex-none px-4 py-2 rounded-2xl bg-[#a8c49f] hover:bg-[#99b890] transition"
                                        >
                                            {leavingClubId === club.id ? "Leaving..." : "Leave"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <MobileNavbar />
        </div>
    );
}

export default YourClubs;