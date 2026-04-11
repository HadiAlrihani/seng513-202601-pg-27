import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import HomeSidebar from "../components/HomeSidebar";

import book_with_worm from "../assets/book_with_worm.png";
import club from "../assets/club.png";

export default function Homepage() {
    const navigate = useNavigate();
    const username = localStorage.getItem("wormly_username");
    useEffect(() => {
    if (!username) {
      navigate("/"); // force to login page
    }
  }, [username, navigate]);

    const storedUserId =
        localStorage.getItem("userId") || localStorage.getItem("wormly_id");
    const userId = storedUserId ? Number(storedUserId) : null;

    const handleRecentClub = async () => {

        const response = await fetch(`http://localhost:5000/bookclubs/get-recent-club?userId=${userId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", },
        });

        const data = await response.json();

        if (!response.ok) {
            console.log({ error: response})
        }
        else {
            const clubId = data.club_id;
            if (!clubId) {
                return;
            }
            navigate(`/clubs/${clubId}/discussion`);
        }
    };

    return  (
        <>
        <Navbar />
        <div className="h-[90vh] md-computer:h-[85vh] flex flex-col md-computer:flex-row">
            <div className="py-6 md-computer:hidden">
                <h1 className="font-italiana text-3xl md:text-5xl text-center">
                    Wormly Connected
                </h1>
            </div>
            <HomeSidebar />
            <div className="flex flex-1 flex-col justify-evenly">
                <h1 className="font-inter text-2xl md:text-3xl md-computer:text-4xl text-center">
                    Welcome, {username}!
                </h1>
                <div className="flex justify-evenly">
                    <div className="flex flex-1 flex-col items-center">
                        <button onClick={handleRecentClub} 
                        className="flex items-center justify-center w-[44vw] h-[44vw] box-border rounded-full bg-[#D3F0D3] flex justify-center items-center
                        md-computer:h-[20vw] md-computer:w-[20vw]">
                            <img src={book_with_worm} 
                            className="h-[28vw] w-[28vw] md-computer:h-[16vw] md-computer:w-[16vw] object-contain" />
                        </button>
                        <h1 className="font-italiana pt-2 text-center md:text-2xl md-computer:text-3xl">Update Reading Progress</h1>
                    </div>
                    <div className="flex flex-1 flex-col items-center">
                        <button onClick={() => navigate('/my-clubs')} 
                        className="flex items-center justify-center w-[44vw] h-[44vw] box-border rounded-full bg-[#D3F0D3] flex justify-center items-center
                        md-computer:h-[20vw] md-computer:w-[20vw]">
                            <img src={club} 
                            className="h-[28vw] w-[28vw] md-computer:h-[16vw] md-computer:w-[16vw] object-contain" />
                        </button>
                        <h1 className="font-italiana pt-2 text-center md:text-2xl md-computer:text-3xl">My Clubs</h1>
                    </div>
                </div>
            </div>
            <div className="hidden md-computer:flex flex-col h-[85vh] items-center w-[15vw] bg-[#D3F0D3]/35">
                <h1 className="font-italiana text-center text-3xl py-[2vh]"> My Library</h1>
                <div className="flex flex-col h-[40vh] justify-evenly">
                    <button onClick={() => navigate('/bookshelf')}
                    className="bg-[#D3F0D3] rounded-lg w-[12vw] py-[1vh]">
                        <h1 className="font-italiana text-center text-2xl">Current Reads</h1>
                    </button>
                    <button onClick={() => navigate('/bookshelf', { state: { tab: "to_read" }})}
                    className="bg-[#D3F0D3] rounded-lg w-[12vw] py-[1vh]">
                        <h1 className="font-italiana text-center text-2xl">Want to Read</h1>
                    </button>
                    <button onClick={() => navigate('/bookshelf', { state: { tab: "finished" }})}
                    className="bg-[#D3F0D3] rounded-lg w-[12vw] py-[1vh]">
                        <h1 className="font-italiana text-center text-2xl">Completed Reads</h1>
                    </button>
                </div>
            </div>
        </div>
        <MobileNavbar />
        </>
    )
}