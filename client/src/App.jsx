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
import AdminDashboard from "./pages/AdminDashboard";
import Friends from "./pages/Friends";
import FriendBookshelf from "./pages/FriendBookshelf";
import CreateClub from "./pages/CreateClub";

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
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/friends/:friendId/bookshelf" element={<FriendBookshelf />} />
            <Route path="/create-clubs" element={<CreateClub />} />
        </Routes>
    );
}

export default App;