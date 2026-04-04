import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-col items-center py-[10vh] md:py-[20vh] px-[10vh]">
            <h1 className="flex-1 font-italiana text-6xl md:text-8xl text-center mb-24 md-short:mb-8">
                Wormly Connected
            </h1>
            <form className="flex-1 flex flex-col w-[75vw] md:w-[60vw] gap-8 text-lg md:text-xl md-computer:text-2xl mb-12 md-short:mb-4">
                <input
                    type="text"
                    placeholder="Username"
                    id="username-login-input"
                    className="h-20 bg-[#d9d9d9] placeholder-black/65 p-4"/>
                <input
                    type="password"
                    placeholder="Password"
                    id="password-login-input"
                    className="h-20 bg-[#d9d9d9] placeholder-black/65 p-4"/>
            </form>
            <div className="flex-1 flex flex-col text-2xl md:text-3xl gap-6 md-computer:gap-10 md-short:gap-3 md-computer:text-4xl">
                <button 
                    id="login-btn" 
                    className="text-center">
                        Login
                </button>
                <button 
                    onClick={() => navigate("/create-account")} 
                    className="text-center text-black/70">
                        Create account
                </button>
            </div>
        </div>
    )
}