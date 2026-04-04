import { useNavigate } from "react-router-dom";

export default function CreateAccount() {
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-col items-center py-[10vh] px-[10vh] md-short:py-[7vh]">
            <h1 className="flex-1 font-italiana text-6xl md:text-8xl md-short:text-5xl text-center mb-12 md-short:mb-4">
                Wormly Connected
            </h1>
            <form className="flex flex-1 flex-col w-[75vw] md:w-[60vw] gap-8 md-computer:gap-12 md-short:gap-4 text-lg md:text-2xl mb-12 md-short:mb-4">
                <input
                    type="text"
                    placeholder="Username"
                    id="username-create-input"
                    className="h-15 md:h-20 bg-[#d9d9d9] placeholder-black/65 p-4"/>
                <input
                    type="password"
                    placeholder="Password"
                    id="password-create-input"
                    className="h-15 md:h-20 bg-[#d9d9d9] placeholder-black/65 p-4"/>
                <input
                    type="text"
                    placeholder="Email"
                    id="email-create-input"
                    className="h-15 md:h-20 bg-[#d9d9d9] placeholder-black/65 p-4" />
            </form>
            <div className="flex-1">
                <button 
                    id="create-account-btn"
                    className="bg-[#D3F0D3]/80  md:px-20 text-lg md:text-3xl p-3 rounded-xl"
                    onClick={() => navigate("/select-genres")}>
                        Create Account
                </button>
            </div>
        </div>
    )
}