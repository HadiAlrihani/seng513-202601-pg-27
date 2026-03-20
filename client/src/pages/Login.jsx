export default function Login() {
    return (
        <>
        <h1 className="font-italiana text-6xl text-center">Wormly Connected</h1>
        <form className="flex flex-col w-3/5">
            <input
                type="text"
                placeholder="Username"
                className="bg-[#d9d9d9] placeholder-black/50"/>
            <input
                type="password"
                placeholder="Password"
                className="bg-[#d9d9d9] placeholder-black/50"/>
        </form>
        <h3 className="text-center">Login</h3>
        <h3 className="text-center text-black/60">Create account</h3>
        </>
    )
}