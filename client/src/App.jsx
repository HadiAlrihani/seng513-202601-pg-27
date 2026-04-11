import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import SelectGenres from "./pages/SelectGenres";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";
import FindClub from "./pages/FindClub";
import YourClubs from "./pages/YourClubs";
import ClubDiscussion from "./pages/ClubDiscussion";
import Bookshelf from "./pages/Bookshelf";
import Friends from "./pages/Friends";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/create-account" element={<CreateAccount />} />
            <Route path="/select-genres" element={<SelectGenres />} />
            <Route path="/home" element={<Homepage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/clubs" element={<FindClub />} />
            <Route path="/my-clubs" element={<YourClubs />} />
            <Route path="/clubs/:clubId/discussion" element={<ClubDiscussion />} />
            <Route path="/bookshelf" element={<Bookshelf />} />
            <Route path="/friends" element={<Friends />} />
        </Routes>
    );
}

export default App;