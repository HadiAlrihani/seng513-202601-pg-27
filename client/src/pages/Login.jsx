import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import logo from "../assets/logo.png";

export default function Login() {
    const navigate = useNavigate();
    const formRef = useRef();
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        const formData = new FormData(formRef.current);
        const username_or_email = formData.get("username-or-email");
        const user_password = formData.get("password");

        try {
            const response = await fetch("http://localhost:5000/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username_or_email, user_password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("wormly_id", String(data.user.id));
                localStorage.setItem("wormly_username", data.user.username);
                localStorage.setItem("wormly_email", data.user.email);
                localStorage.setItem("wormly_token", data.token);
                localStorage.setItem("wormly_isAdmin", data.user.is_admin);

                localStorage.setItem("userId", String(data.user.id));
                localStorage.setItem("username", data.user.username);
                localStorage.setItem("email", data.user.email);
                localStorage.setItem("token", data.token);

                navigate("/home");
            } else {
                setErrorMessage(data.error || "Login failed.");
            }
        } catch (err) {
            console.error("Error: ", err);
            setErrorMessage("Unable to connect to the server.");
        }
    };

    return (
        <div className="h-full flex flex-col justify-around items-center py-[20vh] md:py-[20vh] md-computer:py-[5vh] px-[10vh]">
            <div className="flex max-h-[25vh] md-computer:max-w-[60vw] items-center justify-center">
                <img className="hidden md-computer:block max-h-[25vh]" src={logo} />
                <h1 className="flex-1 font-italiana text-6xl md:text-7xl text-center">
                    Wormly Connected
                </h1>
            </div>

            <form
                ref={formRef}
                onSubmit={handleLogin}
                className="flex flex-col justify-around w-[75vw] md:w-[60vw] gap-8 text-lg md:text-xl md-computer:text-2xl mb-4 md-short:mb-4"
            >
                <input
                    type="text"
                    placeholder="Username/Email"
                    name="username-or-email"
                    className="h-16 bg-[#d9d9d9] placeholder-black/65 p-4"
                />

                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    className="h-16 bg-[#d9d9d9] placeholder-black/65 p-4"
                />

                {errorMessage ? (
                    <p className="text-red-600 text-center">{errorMessage}</p>
                ) : null}

                <button
                    type="submit"
                    className="self-bottom w-fit self-center text-center text-2xl md:text-3xl md-computer:text-4xl"
                >
                    Login
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/create-account")}
                    className="self-center text-center w-fit text-black/70"
                >
                    Create account
                </button>
            </form>
        </div>
    );
}