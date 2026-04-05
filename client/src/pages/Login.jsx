import { useNavigate } from "react-router-dom";
import { useRef } from "react";

import logo from "../assets/logo.png";

export default function Login() {
    //use to navigate pages
    const navigate = useNavigate();

    //Reference for the login form
    const formRef = useRef();

    const handleLogin = async () => {
        const formData = new FormData(formRef.current);

        const username_or_email = formData.get("username-or-email");
        const password = formData.get("password");

        try {
            const response = await fetch("http://localhost:5000/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username_or_email, password })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Login successful: ", data)
                navigate("/home");
            }
            else {
                console.log("Login failed: ", data.message)
            }

        }
        catch (err) {
            console.error("Error: ", err)
        }
    }

    return (
        <div className="h-full flex flex-col items-center py-[20vh] md:py-[20vh] px-[10vh]">
            <div className="flex max-h-[25vh] md-computer:max-w-[60vw]">
                <img className="hidden md-computer:block" src={logo} />
                <h1 className="flex-1 font-italiana text-6xl md:text-8xl text-center mb-24 md-short:mb-8">
                    Wormly Connected
                </h1>
            </div>
            <form ref={formRef}
            onSubmit={handleLogin}
            className="flex-1 flex flex-col w-[75vw] md:w-[60vw] gap-8 text-lg md:text-xl md-computer:text-2xl mb-4 md-short:mb-4">
                <input
                    type="text"
                    placeholder="Username/Email"
                    name="username-or-email"
                    className="h-20 bg-[#d9d9d9] placeholder-black/65 p-4"/>
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    className="h-20 bg-[#d9d9d9] placeholder-black/65 p-4"/>
                <button 
                    type="submit" 
                    className="self-bottom text-center text-2xl md:text-3xl md-computer:text-4xl">
                        Login
                </button>
            </form>
            <div className="flex-1 flex items-start text-2xl md:text-3xl md-computer:gap-10 md-short:gap-3 md-computer:text-4xl">
                <button 
                    onClick={() => navigate("/create-account")} 
                    className="text-center text-black/70">
                        Create account
                </button>
            </div>
        </div>
    )
}