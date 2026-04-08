import { useNavigate } from "react-router-dom";

import bookshelf from "../assets/bookshelf.png";
import find_icon from "../assets/find.png";
import discussion from "../assets/discussion.png";

export default function HomeSidebar() {
    const navigate = useNavigate();
    
    return (
        <div className="flex justify-between items-start
             md-computer:flex-col md-computer:h-[85vh] md-computer:items-center md-computer:w-[15vw] md-computer:bg-[#D3F0D3]/35">
            <div className="flex flex-col flex-1 items-center md-computer:justify-evenly">
                <button 
                className="flex items-center justify-center w-[24vw] h-[24vw] box-border rounded-full bg-[#D3F0D3] flex justify-center items-center
                md-computer:h-[10vw] md-computer:w-[10vw]">
                    <img src={bookshelf} 
                    className="h-[16vw] w-[16vw] md-computer:h-[6vw] md-computer:w-[6vw] object-contain" />
                </button>
                <h1 className="pt-2 font-inter text-center md:text-2xl md-computer:text-lg">Friend's Shelf</h1>
            </div>
            <div className="flex flex-col flex-1 items-center md-computer:justify-evenly">
                <button onClick={() => navigate('/clubs')} 
                className="flex items-center justify-center w-[24vw] h-[24vw] box-border rounded-full bg-[#D3F0D3]
                md-computer:h-[10vw] md-computer:w-[10vw]">
                    <img src={find_icon} 
                    className="h-[14vw] w-[14vw] md-computer:h-[6vw] md-computer:w-[6vw] object-contain" />
                </button>
                <h1 className="pt-2 font-inter text-center md:text-2xl md-computer:text-lg">Find a Club</h1>
            </div>
            <div className="flex flex-col flex-1 items-center md-computer:justify-evenly">
                <button 
                className="flex items-center justify-center w-[24vw] h-[24vw] box-border rounded-full bg-[#D3F0D3]
                md-computer:h-[10vw] md-computer:w-[10vw]">
                    <img src={discussion} 
                    className="h-[14vw] w-[14vw] md-computer:h-[6vw] md-computer:w-[6vw] object-contain" />
                </button>
                <h1 className="pt-2 font-inter text-center md:text-2xl md-computer:text-lg">Recent Discussion</h1>
            </div>
        </div>
    )
}