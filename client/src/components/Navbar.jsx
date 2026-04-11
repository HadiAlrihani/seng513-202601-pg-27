import { useNavigate } from "react-router-dom";
import { useState } from "react";

import ProfileOverlay from "./profileOverlay";

import logo from "../assets/logo.png"
import profile_icon from "../assets/profile_icon.png";
import LogoutButton from "./LogoutButton";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const [isOpenLogoutModal, setIsOpenLogoutModal] = useState(false);

    const navigate = useNavigate();

    return (
        <div className="bg-zinc-50 w-full h-[15vh] p-4 border-b-4 drop-shadow-2xl/50 hidden md-computer:flex items-center justify-between" >
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
            <div className="relative w-[15vh]">
                <button onClick={() => setOpen((prev) => !prev)}
                className="flex justify-end w-full h-[15vh]">
                    <img className="max-h-[15vh] object-contain" src={profile_icon} alt="" />
                </button>

                {/*menu from profile button */}
                {open && (
                    <ProfileOverlay
                    onClose={() => setOpen(false)}
                    onProfile={() => {
                        navigate("/profile");
                        setOpen(false);
                    }}
                    onLogout={() => {
                        setIsOpenLogoutModal(true);
                        setOpen(false);
                    }}
                    />
                )}
            </div>
            {isOpenLogoutModal && (
            <LogoutButton
                onCancel={() => setIsOpenLogoutModal(false)}
                onConfirm={() => {
                localStorage.clear();
                setIsOpenLogoutModal(false);
                navigate("/");
                }}
            />
            )}
        </div>
    )
}