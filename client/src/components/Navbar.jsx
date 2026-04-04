import { useNavigate } from "react-router-dom";

import react from "../assets/react.svg"

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-[15vh] border border-black hidden md-tall:flex items-center relative" >
            <button
            className="w-[15vh] h-[15vh] box-border">
                <img 
                className="w-full h-[70%]"
                src={react} alt="Wormly logo"></img>
            </button>
            <h1 className="absolute left-1/2 -translate-x-1/2 font-italiana text-7xl">Wormly Connected</h1>
        </div>
    )
}