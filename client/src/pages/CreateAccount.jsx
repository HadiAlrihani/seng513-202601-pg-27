import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import logo from "../assets/logo.png";

export default function CreateAccount() {
    const navigate = useNavigate();
    const formRef = useRef();
    const [errorMessage, setErrorMessage] = useState("");

    const handleRegistration = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const formData = new FormData(formRef.current);

        const email = formData.get("email");
        const username = formData.get("username");
        const user_password = formData.get("password");

        try {
            const response = await fetch("http://localhost:5000/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, user_password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("wormly_id", String(data.user.id));
                localStorage.setItem("wormly_username", data.user.username);
                localStorage.setItem("wormly_email", data.user.email);
                localStorage.setItem("wormly_token", data.token);

                localStorage.setItem("userId", String(data.user.id));
                localStorage.setItem("username", data.user.username);
                localStorage.setItem("email", data.user.email);
                localStorage.setItem("token", data.token);

                navigate("/home");
            } else {
                setErrorMessage(data.error || "Account creation failed.");
            }
        } catch (err) {
            console.error("Error:", err);
            setErrorMessage("Unable to connect to the server.");
        }
    };

    return (
        <div className="bg-zinc-50 h-full flex flex-col justify-evenly items-center py-[5vh] px-[10vh] md-short:py-[7vh]">
            <div className="flex md-computer:w-[60vw] max-h-[25vh] items-center justify-center">
                <img className="hidden md-computer:block max-h-[25vh]" src={logo} />
                <h1 className="flex font-italiana text-6xl md:text-7xl md-short:text-5xl text-center">
                    Wormly Connected
                </h1>
            </div>

            <form
                ref={formRef}
                onSubmit={handleRegistration}
                className="flex flex-col w-[75vw] md:w-[60vw] gap-8 md-short:gap-4 text-lg md:text-2xl"
            >
                <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    className="h-12 md:h-20 bg-[#d9d9d9] placeholder-black/65 p-4"
                />

                <input
                    type="text"
                    placeholder="Username"
                    name="username"
                    className="h-12 md:h-20 bg-[#d9d9d9] placeholder-black/65 p-4"
                />

                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    className="h-12 md:h-20 bg-[#d9d9d9] placeholder-black/65 p-4"
                />

                {errorMessage ? (
                    <p className="text-red-600 text-center">{errorMessage}</p>
                ) : null}

                <button
                    type="submit"
                    className="bg-[#D3F0D3]/80 w-fit self-center md:px-20 text-lg md:text-3xl p-3 rounded-xl"
                >
                    Create Account
                </button>
            </form>
        </div>
    );
}