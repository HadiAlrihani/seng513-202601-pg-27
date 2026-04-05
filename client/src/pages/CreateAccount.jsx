import { useNavigate } from "react-router-dom";
import { useRef } from "react";

import logo from "../assets/logo.png";

export default function CreateAccount() {
    const navigate = useNavigate();

    const formRef = useRef();

    const handleRegistration = async () => {
        const formData = new FormData(formRef.current);

        const email = formData.get("email");
        const username = formData.get("username");
        const password = formData.get("password");

        try {
            const response = await fetch ("http://localhost:5000/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, username, password})
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Account created:", data),
                navigate("/home")
            }
            else {
                console.log("Creation failed: ", data.message)
            }
        }
        catch (err) {
            console.error("Error:", err)
        }
    }

    return (
        <div className="h-full flex flex-col justify-evenly items-center py-[5vh] px-[10vh] md-short:py-[7vh]">
            <div className="flex md-computer:w-[60vw] max-h-[25vh]">
                <img className="hidden md-computer:block" src={logo} />
                <h1 className="flex font-italiana text-6xl md:text-8xl md-short:text-5xl text-center">
                    Wormly Connected
                </h1>
            </div>
            <form onSubmit={handleRegistration} 
            className="flex flex-col w-[75vw] md:w-[60vw] gap-8 md-short:gap-4 text-lg md:text-2xl">
                <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    className="h-15 md:h-20 bg-[#d9d9d9] placeholder-black/65 p-4"/>
                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    className="h-15 md:h-20 bg-[#d9d9d9] placeholder-black/65 p-4"/>
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    className="h-15 md:h-20 bg-[#d9d9d9] placeholder-black/65 p-4" />
                <button onClick={() => navigate("/select-genres")}
                    type="submit"
                    className="bg-[#D3F0D3]/80 w-fit self-center md:px-20 text-lg md:text-3xl p-3 rounded-xl">
                        Create Account
                </button>
            </form>
        </div>
    )
}