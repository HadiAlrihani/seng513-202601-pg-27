import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

function ClubDiscussion() {
    const navigate = useNavigate();
    const { clubId } = useParams();

    const storedUserId =
        localStorage.getItem("userId") || localStorage.getItem("wormly_id");
    const userId = storedUserId ? Number(storedUserId) : null;
    const username =
        localStorage.getItem("username") ||
        localStorage.getItem("wormly_username") ||
        "Reader";

    const [club, setClub] = useState(null);
    const [checkpoints, setCheckpoints] = useState([]);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
    const [messages, setMessages] = useState([]);
    const [progressValue, setProgressValue] = useState("");
    const [messageText, setMessageText] = useState("");

    const [isLoadingPage, setIsLoadingPage] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
    const [isPostingMessage, setIsPostingMessage] = useState(false);

    const [pageError, setPageError] = useState("");
    const [messageError, setMessageError] = useState("");
    const [notification, setNotification] = useState("");
    const [showNotificationPopup, setShowNotificationPopup] = useState(false);

    const selectedCheckpointData = useMemo(() => {
        return (
            checkpoints.find(
                (checkpoint) =>
                    Number(checkpoint.checkpoint_num) === Number(selectedCheckpoint)
            ) || null
        );
    }, [checkpoints, selectedCheckpoint]);

    const showNotification = (text) => {
        setNotification(text);
        setShowNotificationPopup(true);

        window.clearTimeout(window.wormlyNotificationTimeout);
        window.wormlyNotificationTimeout = window.setTimeout(() => {
            setShowNotificationPopup(false);
        }, 3000);
    };

    const closeNotification = () => {
        setShowNotificationPopup(false);
        window.clearTimeout(window.wormlyNotificationTimeout);
    };

    const loadClubData = async () => {
        if (!userId) {
            navigate("/");
            return null;
        }

        try {
            setIsLoadingPage(true);
            setPageError("");

            const response = await fetch(
                `http://localhost:5000/discussions/clubs/${clubId}/checkpoints/${userId}`
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to load discussion page.");
            }

            setClub(data.club);
            setCheckpoints(data.checkpoints);
            setProgressValue(
                data.club.progress_checkpoint !== null &&
                    data.club.progress_checkpoint !== undefined
                    ? String(data.club.progress_checkpoint)
                    : ""
            );

            const firstUnlocked = data.checkpoints.find(
                (checkpoint) => checkpoint.is_unlocked
            );

            if (firstUnlocked) {
                setSelectedCheckpoint((prevSelected) =>
                    prevSelected !== null ? prevSelected : firstUnlocked.checkpoint_num
                );
            } else if (data.checkpoints.length > 0) {
                setSelectedCheckpoint((prevSelected) =>
                    prevSelected !== null ? prevSelected : data.checkpoints[0].checkpoint_num
                );
            } else {
                setSelectedCheckpoint(null);
            }

            return data;
        } catch (error) {
            console.error("Error loading discussion page:", error);
            setPageError(error.message || "Unable to load discussion page.");
            return null;
        } finally {
            setIsLoadingPage(false);
        }
    };

    const loadMessages = async (checkpointNum) => {
        if (!checkpointNum || !userId) return;

        try {
            setIsLoadingMessages(true);
            setMessageError("");

            const response = await fetch(
                `http://localhost:5000/discussions/clubs/${clubId}/checkpoints/${checkpointNum}/messages/${userId}`
            );
            const data = await response.json();

            if (!response.ok) {
                setMessages([]);
                throw new Error(data.error || "Failed to load discussion messages.");
            }

            setMessages(data.messages);
        } catch (error) {
            console.error("Error loading messages:", error);
            setMessageError(error.message || "Unable to load messages.");
        } finally {
            setIsLoadingMessages(false);
        }
    };

    useEffect(() => {
        loadClubData();
    }, [clubId, userId]);

    useEffect(() => {
        if (selectedCheckpointData?.is_unlocked) {
            loadMessages(selectedCheckpoint);
        } else {
            setMessages([]);
            setMessageError("");
        }
    }, [selectedCheckpoint, selectedCheckpointData?.is_unlocked]);

    const handleProgressUpdate = async () => {
        if (!progressValue || !userId) return;

        const previouslyUnlocked = checkpoints
            .filter((checkpoint) => checkpoint.is_unlocked)
            .map((checkpoint) => Number(checkpoint.checkpoint_num));

        try {
            setIsUpdatingProgress(true);

            const response = await fetch("http://localhost:5000/discussions/progress", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    clubId: Number(clubId),
                    progressCheckpoint: Number(progressValue),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Failed to update progress.");
                return;
            }

            const refreshedData = await loadClubData();
            const newSelectedCheckpoint = Number(progressValue);
            setSelectedCheckpoint(newSelectedCheckpoint);

            if (refreshedData?.checkpoints) {
                const newlyUnlocked = refreshedData.checkpoints
                    .filter(
                        (checkpoint) =>
                            checkpoint.is_unlocked &&
                            !previouslyUnlocked.includes(Number(checkpoint.checkpoint_num))
                    )
                    .map((checkpoint) => Number(checkpoint.checkpoint_num));

                if (newlyUnlocked.length > 0) {
                    const highestUnlocked = Math.max(...newlyUnlocked);
                    showNotification(
                        `Checkpoint ${highestUnlocked} unlocked! New discussion available.`
                    );
                } else {
                    showNotification("Progress updated successfully.");
                }
            } else {
                showNotification("Progress updated successfully.");
            }
        } catch (error) {
            console.error("Error updating progress:", error);
            alert("Something went wrong while updating progress.");
        } finally {
            setIsUpdatingProgress(false);
        }
    };

    const handlePostMessage = async (e) => {
        e.preventDefault();

        if (!messageText.trim() || !selectedCheckpointData?.is_unlocked || !userId) {
            return;
        }

        try {
            setIsPostingMessage(true);

            const response = await fetch("http://localhost:5000/discussions/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    clubId: Number(clubId),
                    checkpointNum: Number(selectedCheckpoint),
                    messageText: messageText.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.error || "Failed to post message.");
                return;
            }

            setMessageText("");
            await loadMessages(selectedCheckpoint);
        } catch (error) {
            console.error("Error posting message:", error);
            alert("Something went wrong while posting your message.");
        } finally {
            setIsPostingMessage(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <Navbar />

            {showNotificationPopup ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
                    <div className="w-full max-w-md rounded-[28px] border border-[#b8d7ac] bg-[#eef7e9] p-6 shadow-2xl text-center">
                        <p className="text-sm uppercase tracking-wide text-[#4e6b44]">
                            Notification
                        </p>

                        <h2 className="mt-2 font-playfair text-2xl text-[#27401f]">
                            Checkpoint Update
                        </h2>

                        <p className="mt-3 text-[#315126] text-base leading-7">
                            {notification}
                        </p>

                        <button
                            onClick={closeNotification}
                            className="mt-5 px-5 py-2 rounded-2xl bg-[#a8c49f] hover:bg-[#99b890] transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            ) : null}

            <div className="max-w-6xl mx-auto px-4 py-6 pb-28 md-computer:pb-8">
                <Link to="/my-clubs" className="text-sm underline text-gray-600">
                    ← Back
                </Link>

                {isLoadingPage ? (
                    <div className="mt-4 bg-white/80 border border-[#dde6d8] rounded-[24px] p-6">
                        Loading discussion page...
                    </div>
                ) : pageError ? (
                    <div className="mt-4 bg-white/80 border border-red-200 rounded-[24px] p-6 text-red-600">
                        {pageError}
                    </div>
                ) : (
                    <>
                        <div className="mt-4 bg-[#dce8d6] border border-[#bfd1b7] rounded-[28px] p-5 md:p-7 shadow-sm">
                            <p className="text-xs uppercase tracking-wide text-zinc-600">
                                Discussion Hub
                            </p>

                            <h1 className="font-playfair text-3xl md:text-4xl mt-1">
                                {club?.club_name}
                            </h1>

                            <p className="text-zinc-700 mt-2">{club?.book_title}</p>

                            <div className="grid md:grid-cols-[1fr_auto] gap-3 mt-5">
                                <select
                                    value={progressValue}
                                    onChange={(e) => setProgressValue(e.target.value)}
                                    className="h-12 rounded-2xl border border-[#cbd8c5] bg-white/90 px-4"
                                >
                                    <option value="">Select your current checkpoint</option>
                                    {checkpoints.map((checkpoint) => (
                                        <option
                                            key={checkpoint.checkpoint_num}
                                            value={checkpoint.checkpoint_num}
                                        >
                                            {checkpoint.checkpoint_num} - {checkpoint.checkpoint_name}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={handleProgressUpdate}
                                    disabled={!progressValue || isUpdatingProgress}
                                    className="h-12 px-5 rounded-2xl bg-[#a8c49f] hover:bg-[#99b890] transition"
                                >
                                    {isUpdatingProgress ? "Updating..." : "Update Progress"}
                                </button>
                            </div>

                            <p className="text-sm text-zinc-700 mt-3">
                                Signed in as <span className="font-medium">{username}</span>
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-[320px_1fr] gap-5 mt-6">
                            <div className="bg-[#dce8d6] border border-[#bfd1b7] rounded-[24px] p-4 md:p-5 shadow-sm">
                                <h2 className="font-playfair text-2xl mb-4">Checkpoints</h2>

                                <div className="flex flex-col gap-3">
                                    {checkpoints.map((checkpoint) => {
                                        const isSelected =
                                            Number(selectedCheckpoint) ===
                                            Number(checkpoint.checkpoint_num);

                                        return (
                                            <button
                                                key={checkpoint.checkpoint_num}
                                                onClick={() =>
                                                    setSelectedCheckpoint(checkpoint.checkpoint_num)
                                                }
                                                className={`text-left rounded-2xl border p-4 transition ${
                                                    isSelected
                                                        ? "bg-white border-[#9eb594]"
                                                        : "bg-white/70 border-[#d4ddd0] hover:bg-white"
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="text-sm text-zinc-600">
                                                            Checkpoint {checkpoint.checkpoint_num}
                                                        </p>
                                                        <p className="font-medium mt-1">
                                                            {checkpoint.checkpoint_name}
                                                        </p>
                                                    </div>

                                                    <span
                                                        className={`text-xs rounded-full px-3 py-1 whitespace-nowrap ${
                                                            checkpoint.is_unlocked
                                                                ? "bg-[#dcefd6] text-[#385a31]"
                                                                : "bg-[#f2e7e7] text-[#8b4c4c]"
                                                        }`}
                                                    >
                                                        {checkpoint.is_unlocked ? "Unlocked" : "Locked"}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="bg-[#dce8d6] border border-[#bfd1b7] rounded-[24px] p-4 md:p-5 shadow-sm">
                                {selectedCheckpointData ? (
                                    <>
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-[#cad8c4] pb-4">
                                            <div>
                                                <p className="text-sm text-zinc-600">
                                                    Checkpoint {selectedCheckpointData.checkpoint_num}
                                                </p>
                                                <h2 className="font-playfair text-2xl mt-1">
                                                    {selectedCheckpointData.checkpoint_name}
                                                </h2>
                                            </div>

                                            <span
                                                className={`text-sm rounded-full px-4 py-2 w-fit ${
                                                    selectedCheckpointData.is_unlocked
                                                        ? "bg-[#dcefd6] text-[#385a31]"
                                                        : "bg-[#f2e7e7] text-[#8b4c4c]"
                                                }`}
                                            >
                                                {selectedCheckpointData.is_unlocked
                                                    ? "Discussion Unlocked"
                                                    : "Locked Until You Reach This Checkpoint"}
                                            </span>
                                        </div>

                                        {!selectedCheckpointData.is_unlocked ? (
                                            <div className="mt-5 bg-white/70 border border-[#d4ddd0] rounded-[20px] p-5 text-zinc-700">
                                                Update your reading progress above to unlock this discussion.
                                            </div>
                                        ) : (
                                            <>
                                                <div className="mt-5 bg-white/60 border border-[#d4ddd0] rounded-[20px] p-4 min-h-[260px]">
                                                    {isLoadingMessages ? (
                                                        <p className="text-zinc-700">Loading messages...</p>
                                                    ) : messageError ? (
                                                        <p className="text-red-600">{messageError}</p>
                                                    ) : messages.length === 0 ? (
                                                        <p className="text-zinc-700">
                                                            No messages yet. Be the first to start this checkpoint discussion.
                                                        </p>
                                                    ) : (
                                                        <div className="flex flex-col gap-3">
                                                            {messages.map((message) => (
                                                                <div
                                                                    key={message.id}
                                                                    className="bg-white border border-[#dde6d8] rounded-2xl p-4"
                                                                >
                                                                    <div className="flex items-center justify-between gap-3">
                                                                        <p className="font-medium">{message.username}</p>
                                                                        <p className="text-xs text-zinc-500">
                                                                            {new Date(
                                                                                message.created_at
                                                                            ).toLocaleString()}
                                                                        </p>
                                                                    </div>

                                                                    <p className="text-zinc-800 mt-2 leading-6">
                                                                        {message.message_text}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <form onSubmit={handlePostMessage} className="mt-4">
                                                    <textarea
                                                        value={messageText}
                                                        onChange={(e) => setMessageText(e.target.value)}
                                                        placeholder="Share your thoughts for this checkpoint..."
                                                        rows={4}
                                                        className="w-full rounded-[20px] border border-[#cbd8c5] bg-white/90 px-4 py-3 resize-none"
                                                    />

                                                    <div className="flex justify-end mt-3">
                                                        <button
                                                            type="submit"
                                                            disabled={isPostingMessage || !messageText.trim()}
                                                            className="px-5 py-2 rounded-2xl bg-[#a8c49f] hover:bg-[#99b890] transition"
                                                        >
                                                            {isPostingMessage ? "Posting..." : "Post Message"}
                                                        </button>
                                                    </div>
                                                </form>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <div className="bg-white/70 border border-[#d4ddd0] rounded-[20px] p-5 text-zinc-700">
                                        No checkpoints are available for this club yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            <MobileNavbar />
        </div>
    );
}

export default ClubDiscussion;