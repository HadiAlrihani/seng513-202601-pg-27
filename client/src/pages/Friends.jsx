import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

export default function Friends() {
    const navigate = useNavigate();

    const storedUserId =
        localStorage.getItem("userId") || localStorage.getItem("wormly_id");
    const userId = storedUserId ? Number(storedUserId) : null;
    const username =
        localStorage.getItem("username") ||
        localStorage.getItem("wormly_username") ||
        "";

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [friends, setFriends] = useState([]);

    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [loadingFriends, setLoadingFriends] = useState(true);

    const [searchError, setSearchError] = useState("");
    const [pageError, setPageError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [sendingToUserId, setSendingToUserId] = useState(null);
    const [handlingRequestId, setHandlingRequestId] = useState(null);

    useEffect(() => {
        if (!userId) {
            navigate("/");
            return;
        }

        loadRequests();
        loadFriends();
    }, [userId, navigate]);

    const showSuccess = (message) => {
        setSuccessMessage(message);
        window.clearTimeout(window.wormlyFriendsSuccessTimeout);
        window.wormlyFriendsSuccessTimeout = window.setTimeout(() => {
            setSuccessMessage("");
        }, 2500);
    };

    const loadRequests = async () => {
        try {
            setLoadingRequests(true);
            const response = await fetch(`http://localhost:5000/friends/requests/${userId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to load requests.");
            }

            setIncomingRequests(data);
        } catch (error) {
            console.error("Error loading requests:", error);
            setPageError("Could not load friend requests.");
        } finally {
            setLoadingRequests(false);
        }
    };

    const loadFriends = async () => {
        try {
            setLoadingFriends(true);
            const response = await fetch(`http://localhost:5000/friends/${userId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to load friends.");
            }

            setFriends(data);
        } catch (error) {
            console.error("Error loading friends:", error);
            setPageError("Could not load friends.");
        } finally {
            setLoadingFriends(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            setSearchResults([]);
            setSearchError("");
            return;
        }

        try {
            setLoadingSearch(true);
            setSearchError("");

            const response = await fetch(
                `http://localhost:5000/friends/search?query=${encodeURIComponent(
                    searchQuery
                )}&userId=${userId}`
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Search failed.");
            }

            setSearchResults(data);
        } catch (error) {
            console.error("Error searching users:", error);
            setSearchError(error.message || "Could not search users.");
        } finally {
            setLoadingSearch(false);
        }
    };

    const handleSendRequest = async (receiverId) => {
        try {
            setSendingToUserId(receiverId);

            const response = await fetch("http://localhost:5000/friends/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderId: userId,
                    receiverId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Failed to send request.");
                return;
            }

            setSearchResults((prev) =>
                prev.map((user) =>
                    user.id === receiverId
                        ? { ...user, relationship: "pending_sent" }
                        : user
                )
            );

            showSuccess("Friend request sent.");
        } catch (error) {
            console.error("Error sending request:", error);
            alert("Something went wrong while sending the request.");
        } finally {
            setSendingToUserId(null);
        }
    };

    const handleAcceptRequest = async (requestId, senderId, senderUsername) => {
        try {
            setHandlingRequestId(requestId);

            const response = await fetch(
                `http://localhost:5000/friends/request/${requestId}/accept`,
                {
                    method: "PATCH",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Failed to accept request.");
                return;
            }

            setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));
            setFriends((prev) => {
                const alreadyExists = prev.some((friend) => friend.id === senderId);
                if (alreadyExists) return prev;
                return [...prev, { id: senderId, username: senderUsername }];
            });

            setSearchResults((prev) =>
                prev.map((user) =>
                    user.id === senderId ? { ...user, relationship: "friends" } : user
                )
            );

            showSuccess("Friend request accepted.");
        } catch (error) {
            console.error("Error accepting request:", error);
            alert("Something went wrong while accepting the request.");
        } finally {
            setHandlingRequestId(null);
        }
    };

    const handleDeclineRequest = async (requestId, senderId) => {
        try {
            setHandlingRequestId(requestId);

            const response = await fetch(
                `http://localhost:5000/friends/request/${requestId}/decline`,
                {
                    method: "PATCH",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Failed to decline request.");
                return;
            }

            setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));

            setSearchResults((prev) =>
                prev.map((user) =>
                    user.id === senderId ? { ...user, relationship: "none" } : user
                )
            );

            showSuccess("Friend request declined.");
        } catch (error) {
            console.error("Error declining request:", error);
            alert("Something went wrong while declining the request.");
        } finally {
            setHandlingRequestId(null);
        }
    };

    const renderRelationshipButton = (user) => {
        if (user.relationship === "friends") {
            return (
                <button
                    disabled
                    className="rounded-2xl bg-[#d9e8d3] px-4 py-2 text-sm text-[#385a31]"
                >
                    Friends
                </button>
            );
        }

        if (user.relationship === "pending_sent") {
            return (
                <button
                    disabled
                    className="rounded-2xl bg-[#ece7d6] px-4 py-2 text-sm text-[#746534]"
                >
                    Requested
                </button>
            );
        }

        if (user.relationship === "pending_received") {
            return (
                <button
                    disabled
                    className="rounded-2xl bg-[#e6dbf5] px-4 py-2 text-sm text-[#5b3f85]"
                >
                    Pending You
                </button>
            );
        }

        return (
            <button
                onClick={() => handleSendRequest(user.id)}
                disabled={sendingToUserId === user.id}
                className="rounded-2xl bg-[#a8c49f] px-4 py-2 text-sm hover:bg-[#99b890] transition"
            >
                {sendingToUserId === user.id ? "Sending..." : "Add Friend"}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-6 pb-28 md-computer:pb-8">
                <Link to="/home" className="text-sm underline text-gray-600">
                    ← Back
                </Link>

                <div className="mt-4 bg-[#dce8d6] border border-[#bfd1b7] rounded-[28px] p-5 md:p-7 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-zinc-600">
                        Friends Shelf
                    </p>

                    <h1 className="font-playfair text-3xl md:text-4xl mt-1">
                        Connect With Readers
                    </h1>

                    <p className="text-zinc-700 mt-2">
                        Search for users, manage friend requests, and explore your reading circle.
                    </p>

                    <p className="text-sm text-zinc-700 mt-3">
                        Signed in as <span className="font-medium">{username}</span>
                    </p>

                    {successMessage ? (
                        <div className="mt-4 rounded-2xl border border-[#b8d7ac] bg-[#e8f5e1] px-4 py-3 text-[#315126]">
                            {successMessage}
                        </div>
                    ) : null}

                    {pageError ? (
                        <div className="mt-4 rounded-2xl border border-red-200 bg-white/80 px-4 py-3 text-red-600">
                            {pageError}
                        </div>
                    ) : null}
                </div>

                <div className="mt-6 bg-[#dce8d6] border border-[#bfd1b7] rounded-[24px] p-4 md:p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div>
                            <h2 className="font-playfair text-2xl">Find Friends</h2>
                            <p className="text-sm text-zinc-700 mt-1">
                                Search for other users and send friend requests.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSearch} className="mt-4 flex flex-col md:flex-row gap-3">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by username..."
                            className="flex-1 h-12 rounded-2xl border border-[#cbd8c5] bg-white/90 px-4"
                        />

                        <button
                            type="submit"
                            className="h-12 px-5 rounded-2xl bg-[#a8c49f] hover:bg-[#99b890] transition"
                        >
                            {loadingSearch ? "Searching..." : "Search"}
                        </button>
                    </form>

                    {searchError ? (
                        <p className="mt-4 text-red-600">{searchError}</p>
                    ) : null}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                        {searchResults.map((user) => (
                            <div
                                key={user.id}
                                className="bg-white border border-[#dde6d8] rounded-[24px] p-5"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                                            Reader
                                        </p>
                                        <h3 className="font-medium text-lg mt-1">
                                            {user.username}
                                        </h3>
                                    </div>
                                </div>

                                <div className="mt-5 flex justify-end">
                                    {renderRelationshipButton(user)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {!loadingSearch && searchQuery.trim() && searchResults.length === 0 && !searchError ? (
                        <p className="mt-4 text-zinc-700">No users found.</p>
                    ) : null}
                </div>

                <div className="mt-6 bg-[#dce8d6] border border-[#bfd1b7] rounded-[24px] p-4 md:p-5 shadow-sm">
                    <h2 className="font-playfair text-2xl">Incoming Requests</h2>
                    <p className="text-sm text-zinc-700 mt-1">
                        Accept or decline friend requests sent to you.
                    </p>

                    {loadingRequests ? (
                        <p className="mt-4 text-zinc-700">Loading requests...</p>
                    ) : incomingRequests.length === 0 ? (
                        <p className="mt-4 text-zinc-700">No incoming requests right now.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                            {incomingRequests.map((request) => (
                                <div
                                    key={request.id}
                                    className="bg-white border border-[#dde6d8] rounded-[24px] p-5"
                                >
                                    <p className="text-xs uppercase tracking-wide text-zinc-500">
                                        Request
                                    </p>
                                    <h3 className="font-medium text-lg mt-1">
                                        {request.username}
                                    </h3>

                                    <div className="flex gap-3 mt-5">
                                        <button
                                            onClick={() =>
                                                handleAcceptRequest(
                                                    request.id,
                                                    request.sender_id,
                                                    request.username
                                                )
                                            }
                                            disabled={handlingRequestId === request.id}
                                            className="px-4 py-2 rounded-2xl bg-[#a8c49f] hover:bg-[#99b890] transition"
                                        >
                                            {handlingRequestId === request.id ? "Working..." : "Accept"}
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDeclineRequest(request.id, request.sender_id)
                                            }
                                            disabled={handlingRequestId === request.id}
                                            className="px-4 py-2 rounded-2xl bg-[#f1e2e2] hover:bg-[#ead3d3] transition"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-6 bg-[#dce8d6] border border-[#bfd1b7] rounded-[24px] p-4 md:p-5 shadow-sm">
                    <h2 className="font-playfair text-2xl">Your Friends</h2>
                    <p className="text-sm text-zinc-700 mt-1">
                        Your connected readers will appear here.
                    </p>

                    {loadingFriends ? (
                        <p className="mt-4 text-zinc-700">Loading friends...</p>
                    ) : friends.length === 0 ? (
                        <p className="mt-4 text-zinc-700">You have no friends added yet.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
                            {friends.map((friend) => (
                                <div
                                    key={friend.id}
                                    className="bg-white border border-[#dde6d8] rounded-[24px] p-5 flex flex-col items-center text-center"
                                >
                                    <div className="w-16 h-16 rounded-full bg-[#e7efe2] flex items-center justify-center text-2xl">
                                        📚
                                    </div>

                                    <h3 className="font-medium text-lg mt-4 break-words">
                                        {friend.username}
                                    </h3>

                                    <button
                                        onClick={() => navigate(`/friends/${friend.id}/bookshelf`)}
                                        className="mt-4 px-4 py-2 rounded-2xl bg-[#a8c49f] hover:bg-[#99b890] transition"
                                    >
                                        View Shelf
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <MobileNavbar />
        </div>
    );
}