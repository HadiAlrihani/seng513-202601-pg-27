import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.png"

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-[15vh] p-4 border border-black hidden md-computer:flex items-center justify-between" >
            <button
            className="w-[15vh] h-[15vh] box-border">
                <img 
                className="w-full h-full"
                src={logo} alt="Wormly logo" />
            </button>
            <h1 className="font-italiana text-7xl">Wormly Connected</h1>
            <div className="w-[15vw]"></div>
        </div>
    )
}