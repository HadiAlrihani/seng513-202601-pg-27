import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Navbar from "../components/Navbar.jsx";
import MobileNavbar from "../components/MobileNavbar.jsx";
import HomeSidebar from "../components/HomeSidebar.jsx";

import SettingsMenu from "../components/SettingsMenu.jsx";
import Modal from "../components/Modal.jsx";
import UsernameForm from "../components/UsernameForm.jsx";
import EmailForm from "../components/EmailForm.jsx";
import PasswordForm from "../components/PasswordForm.jsx";
import DeactivateForm from "../components/DeactivateForm.jsx";

import logout from "../assets/logout.png";
import settings from "../assets/settings.png";
import club from "../assets/club.png";
import closed_book from "../assets/closed_book.png";
import profile_icon from "../assets/profile_icon.png";

export default function Profile() {
    const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
    
    const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const navigate = useNavigate();

    const username = localStorage.getItem("wormly_username");
    useEffect(() => {
    if (!username) {
        navigate("/"); // force to login page
    }
    }, [username, navigate]);

    const email = localStorage.getItem("wormly_email");
    useEffect(() => {
        if (!email) {
            navigate("/");
        }
    }, [email, navigate]);


    // Handle which modal to open from settings menu
    const handleSettingsOption = (option) => {
        switch(option) {
        case 'username':
            setIsUsernameModalOpen(true);
            break;
        case 'email':
            setIsEmailModalOpen(true);
            break;
        case 'password':
            setIsPasswordModalOpen(true);
            break;
        case 'deactivate':
            setIsDeleteModalOpen(true);
            break;
        default:
            break;
        }
    };

    const changeUsername = () => {
        setIsUsernameModalOpen(true);
    };

    const handleUsernameUpdate = (newUsername) => {
        localStorage.setItem("wormly_username", newUsername);
    };

    const changeEmail = () => {
        setIsEmailModalOpen(true);
    };

    const handleEmailUpdate = (newEmail) => {
        localStorage.setItem("wormly_email", newEmail);
    };

    const changePassword = () => {
        setIsPasswordModalOpen(true);
    };

    const deleteAccount = () => {
        setIsDeleteModalOpen(true);
    }

    return  (
        <>
        <Navbar />
        <div className="flex flex-col h-[90vh] md-computer:h-[85vh] md-computer:flex-row">
            <div className="hidden md-computer:block">
                <HomeSidebar />
            </div>
            
            <div className="flex justify-between p-[2vh] h-[50vh] 
            md-computer:h-[85vh] md-computer:px-[6vw] md-computer:flex-col md-computer:justify-start"> 
                <h1 className="hidden md-computer:block font-italiana text-7xl text-center">Profile</h1>
                <div className="flex items-start md-computer:hidden">
                    <button onClick={() => setIsSettingsMenuOpen(true)} className="w-[4vh] h-[4vh]">
                        <img src={settings} />
                    </button>
                </div>
                <div className="flex w-full flex-col items-center justify-end gap-2 md-computer:mt-20">
                    <div className="r w-[30vh] h-[30vh] rounded-full bg-[#E7E7E7]/100 overflow-hidden">
                        <img src={profile_icon} className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-center text-2xl md:text-4xl">@{username}</h1>
                    <h1 className="text-center text-xl md:text-3xl text-stone-500">{email}</h1>
                </div>
                <div className="flex items-start md-computer:hidden">
                    <button className="w-[3vh] h-[3vh]">
                        <img src={logout} />
                    </button>
                </div>
            </div>

            <div className="hidden md-computer:flex flex-col justify-center w-full pr-[15vw]">
                <button onClick={changeUsername} className="flex py-4 border-b-2 border-black">
                    <h1 className="text-xl">Username:</h1>
                    <h1 className="px-2 text-xl text-stone-500">{username}</h1>
                </button>
                <button onClick={changeEmail} className="flex py-4 border-b-2 border-black">
                    <h1 className="text-xl">Email:</h1>
                    <h1 className="px-2 text-xl text-stone-500">{email}</h1>
                </button>
                <button onClick={changePassword} className="flex py-4 border-b-2 border-black">
                    <h1 className="text-xl">Reset Password</h1>
                </button>
                <button onClick={deleteAccount} className="flex py-4 border-b-2 border-black">
                    <h1 className="text-xl text-red-600">Deactivate Account</h1>
                </button>
            </div>
            
            <div className="flex flex-1 items-center md-computer:hidden">
                <div className="flex flex-col flex-1 items-center md-computer:justify-evenly">
                    <button 
                    className="flex items-center justify-center w-[24vw] h-[24vw] box-border rounded-full bg-[#D3F0D3] flex justify-center items-center
                    md-computer:h-[10vw] md-computer:w-[10vw]">
                        <img src={closed_book} 
                        className="h-[16vw] w-[16vw] md-computer:h-[6vw] md-computer:w-[6vw] object-contain" />
                    </button>
                    <h1 className="pt-2 font-inter text-center md:text-2xl md-computer:text-lg">Your Library</h1>
                </div>
                <div className="flex flex-col flex-1 items-center md-computer:justify-evenly">
                    <button 
                    className="flex items-center justify-center w-[24vw] h-[24vw] box-border rounded-full bg-[#D3F0D3] flex justify-center items-center
                    md-computer:h-[10vw] md-computer:w-[10vw]">
                        <img src={club} 
                        className="h-[16vw] w-[16vw] md-computer:h-[6vw] md-computer:w-[6vw] object-contain" />
                    </button>
                    <h1 className="pt-2 font-inter text-center md:text-2xl md-computer:text-lg">My Clubs</h1>
                </div>
            </div>

        </div>
        <MobileNavbar />

        {/* Settings Menu Modal */}
        <SettingsMenu
            isOpen={isSettingsMenuOpen}
            onClose={() => setIsSettingsMenuOpen(false)}
            onSelectOption={handleSettingsOption}
        />

        {/* Username Modal */}
        <Modal
        isOpen={isUsernameModalOpen}
        onClose={() => setIsUsernameModalOpen(false)}
        title="Change Username">
            <UsernameForm
            currentUsername={localStorage.getItem("wormly_username")}
            userId={localStorage.getItem("wormly_id")}
            onClose={() => setIsUsernameModalOpen(false)}
            onSuccess={handleUsernameUpdate} />
        </Modal>

        {/* Email Modal */}
        <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title="Change Email">
            <EmailForm
            currentEmail={localStorage.getItem("wormly_email")}
            userId={localStorage.getItem("wormly_id")}
            onClose={() => setIsEmailModalOpen(false)}
            onSuccess={handleEmailUpdate} />
        </Modal>

        {/* Password Modal */}
        <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Reset Password">
            <PasswordForm
            userId={localStorage.getItem("wormly_id")}
            onClose={() => setIsPasswordModalOpen(false)} />
        </Modal>

        {/* Deactivate account Modal */}
        <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Deactivate your account">
            <DeactivateForm
            userId={localStorage.getItem("wormly_id")}
            onClose={() => setIsDeleteModalOpen(false)}
            onSuccess={() => {
                // Clear all user data
                localStorage.clear();
                navigate('/'); }} />
        </Modal>
        </>
    )
}
