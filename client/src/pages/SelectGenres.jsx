import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Navbar from "../components/navbar";

export default function SelectGenres() {
    const navigate = useNavigate();

    const [selectedGenres, setSelectedGenres] = useState([]);
    const genres = ["Thriller", "Sci-Fi",
              "Historical", "Fantasy",
              "Mystery", "Biography",
              "Crime", "Self-Help"];
            
    function changeGenres(genre) {
        //if genre not selected, add it
        //otherwise, remove it
        //toggle button color based on this?
    }

    return (
        <>
        <Navbar />
        <div className="h-full md-computer:h-[85vh] font-playfair flex flex-col py-[10vh] md-computer:py-[5vh] px-[10vw] justify-between">
            <div className="flex justify-center items-center">
                <h1 className="font-italiana text-4xl md:text-6xl text-center">
                    Select Your Favorite Genres:
                </h1>
            </div>
            <div className="flex flex-wrap justify-center gap-10 md:gap-14">
                {//create buttons for starting genres
                genres.map((genre) => (
                    <button
                    onClick={changeGenres}
                    key={genre}
                    className="bg-[#D3F0D3]/80 h-fit w-[30vw] text-lg md:text-3xl py-3 rounded-xl">
                        {genre}
                    </button>
                ))}
            </div>
            <div className="flex justify-end">
                <button 
                onClick={() => navigate("/home")}
                className="underline text-lg md:text-3xl mr-4 md:mr-6">
                    Skip
                </button>
                <button className="bg-[#D3F0D3]/80 underline text-lg md:text-3xl p-3 rounded-xl">
                    SUBMIT
                </button>
            </div>
        </div>
        </>
    )
}