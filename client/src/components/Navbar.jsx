import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png"
import profile_icon from "../assets/profile_icon.png";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-[15vh] p-4 border-b-4 drop-shadow-2xl/50 hidden md-computer:flex items-center justify-between" >
            <button onClick={() => navigate('/home')}
            className="w-[15vh] h-[15vh] box-border">
                <img 
                className="w-full h-full"
                src={logo} alt="Wormly logo" />
            </button>
            <h1 className="font-italiana text-7xl">Wormly Connected</h1>
            {/* Navigation links */}
            <div className="flex gap-6 text-xl font-italiana">
                <button onClick={() => navigate('/clubs')} className="hover:underline">Clubs</button>
                <button onClick={() => navigate('/bookshelf')} className="hover:underline">Bookshelf</button>
            </div>
            <div className="w-[15vh]">
                <button onClick={() => navigate('/profile')}
                className="flex justify-end w-full h-[15vh]">
                    <img className="max-h-[15vh] object-contain" src={profile_icon} alt="" />
                </button>
            </div>
        </div>
    )
}