import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    return (
        <div className="h-full flex flex-col items-center pt-[20vh] pb-[10vh] px-[10vh] md-short:pt-[10vh]">
            <h1 className="font-italiana text-6xl md-tall:text-8xl text-center mb-24 md-short:mb-8">Wormly Connected</h1>
            <form className="flex flex-col w-[75vw] md:w-[60vw] gap-8 text-lg md:text-xl md-tall:text-2xl mb-12 md-short:mb-4">
                <input
                    type="text"
                    placeholder="Username"
                    className="h-[7vh] bg-[#d9d9d9] placeholder-black/90 p-4"/>
                <input
                    type="password"
                    placeholder="Password"
                    className="h-[7vh] bg-[#d9d9d9] placeholder-black/90 p-4"/>
            </form>
            <div className="flex flex-col text-2xl gap-6 md-short:gap-3 md-tall:text-4xl">
                <button className="text-center">Login</button>
                <button  onClick={() => navigate("/create-account")} className="text-center text-black/70">Create account</button>
            </div>
        </div>
    )
}