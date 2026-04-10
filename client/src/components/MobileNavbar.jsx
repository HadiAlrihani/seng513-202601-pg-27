import { useNavigate } from "react-router-dom";

import home_icon from "../assets/home_icon.png";
import closed_book from "../assets/closed_book.png";
import club from "../assets/club.png";
import profile_icon from "../assets/profile_icon.png";

export default function MobileNavbar() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-[10vh] bg-white flex border-t-2 border-black fixed bottom-0 left-0 md-computer:hidden">
            <div className="flex-1 flex justify-center items-center">
                <button onClick={() => navigate('/home')} 
                className="flex h-full w-full justify-center items-end">
                    <img className="object-contain h-[8vh] mb-2" src={home_icon} alt="Wormly logo" />
                </button>
            </div>

            {/* Bookshelf link — middle of the three nav items */}
            <div className="flex-1 flex justify-center items-center border-l-2 border-black">
                <button onClick={() => navigate('/bookshelf')}
                className="flex w-full h-full justify-center items-end">
                    <img className="object-contain h-[8vh] mb-2" src={closed_book} alt="Library" />
                </button>
            </div>

            {/* Joined clubs link — middle of the three nav items */}
            <div className="flex-1 flex justify-center items-center border-l-2 border-black">
                <button onClick={() => navigate('/my-clubs')}
                className="flex w-full h-full justify-center items-end">
                    <img className="object-contain h-[8vh] mb-2" src={club} alt="Your Clubs" />
                </button>
            </div>

            <div className="flex-1 flex justify-center items-center border-l-2 border-black">
                <button onClick={() => navigate('/profile')}
                className="flex w-full h-full justify-center items-end">
                    <img className="object-contain h-[8vh] mb-2" src={profile_icon} alt="Profile" />
                </button>
            </div>
        </div>
    )
}