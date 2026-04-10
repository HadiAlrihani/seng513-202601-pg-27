import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("wormly_token");
    const isAdmin = localStorage.getItem("wormly_isAdmin") === "true";

    const [users, setUsers] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isAdmin) {
            navigate("/home");
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [usersRes, clubsRes] = await Promise.all([
                fetch("http://localhost:5000/admin/users", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch("http://localhost:5000/admin/clubs", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (usersRes.status === 401) {
                localStorage.clear();
                navigate("/");
                return;
            }

            const usersData = await usersRes.json();
            const clubsData = await clubsRes.json();

            if (!usersRes.ok) throw new Error(usersData.error || "Failed to fetch users");
            if (!clubsRes.ok) throw new Error(clubsData.error || "Failed to fetch clubs");

            setUsers(usersData);
            setClubs(clubsData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!confirm(`Delete account for "${username}"? This cannot be undone.`)) return;

        try {
            const response = await fetch(`http://localhost:5000/admin/users/${userId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to delete user");
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleDeleteClub = async (clubId, clubName) => {
        if (!confirm(`Delete club "${clubName}"? This cannot be undone.`)) return;

        try {
            const response = await fetch(`http://localhost:5000/admin/clubs/${clubId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to delete club");
            setClubs((prev) => prev.filter((c) => c.id !== clubId));
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-6 pb-28 md-computer:pb-8">
                <h1 className="font-italiana text-3xl md:text-4xl mb-6">Admin Dashboard</h1>

                {loading ? (
                    <p className="text-zinc-600">Loading...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : (
                    <div className="flex flex-col gap-8">
                        {/* Users table */}
                        <div>
                            <h2 className="font-italiana text-2xl mb-3">Users</h2>
                            <div className="bg-white border border-zinc-200 rounded-[24px] overflow-hidden">
                                <table className="w-full text-sm md:text-base">
                                    <thead className="bg-zinc-100 text-left">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Username</th>
                                            <th className="px-4 py-3 font-medium">Email</th>
                                            <th className="px-4 py-3 font-medium">Admin</th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user.id} className="border-t border-zinc-100">
                                                <td className="px-4 py-3">{user.username}</td>
                                                <td className="px-4 py-3 text-zinc-600">{user.email}</td>
                                                <td className="px-4 py-3">
                                                    {user.is_admin ? (
                                                        <span className="text-green-700 font-medium">Yes</span>
                                                    ) : (
                                                        <span className="text-zinc-400">No</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {!user.is_admin && (
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id, user.username)}
                                                            className="text-red-600 hover:underline text-sm"
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Clubs table */}
                        <div>
                            <h2 className="font-italiana text-2xl mb-3">Book Clubs</h2>
                            <div className="bg-white border border-zinc-200 rounded-[24px] overflow-hidden">
                                <table className="w-full text-sm md:text-base">
                                    <thead className="bg-zinc-100 text-left">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Club Name</th>
                                            <th className="px-4 py-3 font-medium">Book</th>
                                            <th className="px-4 py-3 font-medium">Visibility</th>
                                            <th className="px-4 py-3 font-medium">Members</th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {clubs.map((club) => (
                                            <tr key={club.id} className="border-t border-zinc-100">
                                                <td className="px-4 py-3">{club.club_name}</td>
                                                <td className="px-4 py-3 text-zinc-600">{club.book_title}</td>
                                                <td className="px-4 py-3 capitalize">{club.visibility}</td>
                                                <td className="px-4 py-3">{club.member_count}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => handleDeleteClub(club.id, club.club_name)}
                                                        className="text-red-600 hover:underline text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <MobileNavbar />
        </div>
    );
}
