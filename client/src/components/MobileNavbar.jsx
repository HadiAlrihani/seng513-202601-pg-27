import { useNavigate } from "react-router-dom";

import home_icon from "../assets/home_icon.png";
import profile_icon from "../assets/profile_icon.png";

export default function MobileNavbar() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-[10vh] flex border-t-2 border-black fixed bottom-0 left-0 md-computer:hidden">
            <div className="flex-1 flex justify-center items-center">
                <button onClick={() => navigate('/home')} 
                className="flex max-h-full w-full justify-center">
                    <img className="object-contain h-[8vh]" src={home_icon} alt="Wormly logo" />
                </button>
            </div>
            <div className="flex-1 flex justify-center items-center border-l-2 border-black">
                <button onClick={() => navigate('/profile')} 
                className="flex w-full max-h-full justify-center">
                    <img className="object-contain h-[8vh]" src={profile_icon} alt="Wormly logo" />
                </button>
            </div>
        </div>
    )
}