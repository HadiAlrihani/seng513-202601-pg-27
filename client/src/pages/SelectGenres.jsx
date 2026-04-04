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

    return (
        <>
        <Navbar />
        <div className="h-full md-computer:h-[85vh] font-playfair flex flex-col py-[10vh] md-tall:py-[5vh] px-[10vw] justify-between">
            <h1 className="font-italiana text-4xl md:text-6xl text-center">
                Select Your Favorite Genres:
            </h1>

            <div className="flex flex-wrap justify-center gap-10 md:gap-14">
                {//create buttons for starting genres
                genres.map((genre) => (
                    <button 
                    key={genre}
                    className="bg-[#D3F0D3]/80 h-fit w-[30vw] text-lg md:text-3xl py-3 rounded-xl">
                        {genre}
                    </button>
                ))}
            </div>
            <div className="flex justify-between">
                <button className="underline text-lg md:text-3xl">
                    Skip
                </button>
                <button className="bg-[#D3F0D3]/80 md-tall:px-14 underline text-lg md:text-3xl p-3 rounded-xl">
                    SUBMIT
                </button>
            </div>
        </div>
        </>
    )
}