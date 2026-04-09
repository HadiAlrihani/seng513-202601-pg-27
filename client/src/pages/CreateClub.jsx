import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";


function CreateClub() {
    const navigate = useNavigate();

    const [clubName, setClubName] = useState("");
    const [bookTitle, setBookTitle] = useState("");
    const [visibility, setVisibility] = useState("");
    const [clubDescription, setClubDescription] = useState("");
    const [numMembers, setNumMembers] = useState("");
    const [loading, setLoading] = useState(false);
    const [maxMembers, setMaxMembers] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleCreate = async () => {
          
        try {
            setLoading(true);
            
            const userId = localStorage.getItem("userId");

            const response = await fetch("http://localhost:5000/bookclubs/club", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ club_name: clubName, book_title: bookTitle, club_description: clubDescription, num_members: 1, max_members: Number(maxMembers), visibility: "public"}),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text|| "Failed to create club.");
            }
            const data = await response.json();

            navigate("/my-clubs");
        } catch (error) {
            console.error("Error creating club:", error);
            setErrorMessage(error.message || "Unable to create club.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50">
            <Navbar />

            <div className="max-w-xl mx-auto px-4 py-8 pb-24 md:pb-10">
                <h1 className="font-playfair text-3xl md:text-4xl">Create a Club</h1>

            <div className="mb-4 mt-4">
                <label className="block mb-2 font-medium">
                    Club Name
                </label>
                                
                <input
                    type="text"
                    placeholder="Club Name"
                    value = {clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                />
            </div> 

             <div className="mb-4 mt-4">
                <label className="block mb-2 font-medium">
                    Book Title
                </label>
                <input
                    type="text"
                    placeholder="Book Title"
                    value = {bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                />
            </div>
                <div className= "flex gap-4 mb-4 mt-4">
                    <label className="block mb-4 font-medium">
                    Club Type
                    </label>
                    <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>

                <div className= "mb-4 mt-4">
                    <label className="block font-medium">
                    Club Description
                    </label>
                <textarea
                    type="text"
                    placeholder="Description"
                    value = {clubDescription}
                    onChange={(e) => setClubDescription(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                />
                </div>

                <div className= "mb-4 mt-4">
                    <label className="block font-medium">
                    Maximum Members
                    </label>

                <input
                    type="number"
                    placeholder="max members"
                    value = {maxMembers}
                    onChange={(e) => setMaxMembers(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                />
                </div>

                <div className="flex gap-3">
                <button
                onClick={handleCreate}
                disabled = {loading}
                className="flex-1 md:flex-none px-4 py-2 rounded-2xl bg-[#a8c49f] hover:bg-[#99b890] transition"
                >
                    {loading? "Creating...": "Create Club"}
                </button>

                <button
                onClick={() => navigate("/my-clubs")}
                className="flex-1 md:flex-none px-4 py-2 rounded-2xl bg-white hover:bg-[gray-100] transition"
                >
                    Cancel
                </button>
                </div>
            </div>


            <MobileNavbar />
        </div>
    );
}

export default CreateClub;