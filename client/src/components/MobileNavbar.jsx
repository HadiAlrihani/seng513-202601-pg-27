import { useNavigate } from "react-router-dom";

import home_icon from "../assets/home_icon.png";
import closed_book from "../assets/closed_book.png";
import club from "../assets/club.png";
import profile_icon from "../assets/profile_icon.png";

export default function MobileNavbar() {
    const navigate = useNavigate();
    const isAdmin = localStorage.getItem("wormly_isAdmin") === "true";

    return (
        <div className="bg-zinc-50 w-full h-[10vh] bg-white flex border-t-2 border-black fixed bottom-0 left-0 md-computer:hidden">
            <div className="flex-1 flex justify-center items-center">
                <button onClick={() => navigate('/home')}
                className="flex h-full w-full justify-center items-end">
                    <img className="object-contain h-[8vh] mb-2" src={home_icon} alt="Wormly logo" />
                </button>
            </div>

            {/* Bookshelf link */}
            <div className="flex-1 flex justify-center items-center border-l-2 border-black">
                <button onClick={() => navigate('/bookshelf')}
                className="flex w-full h-full justify-center items-end">
                    <img className="object-contain h-[8vh] mb-2" src={closed_book} alt="Library" />
                </button>
            </div>

            {/* Clubs link */}
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

            {/* Admin link — only visible to admin users */}
            {isAdmin && (
                <div className="flex-1 flex justify-center items-center border-l-2 border-black">
                    <button onClick={() => navigate('/admin')}
                    className="flex w-full max-h-full justify-center items-center text-sm font-semibold text-red-700">
                        Admin
                    </button>
                </div>
            )}
        </div>
    )
}
