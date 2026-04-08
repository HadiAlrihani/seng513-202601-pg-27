import { useNavigate } from "react-router-dom";

import bookshelf from "../assets/bookshelf.png";

export default function HomeSidebar() {
    const navigate = useNavigate();
    
    return (
        <div className="flex justify-between items-start
             md-computer:flex-col md-computer:h-[85vh] md-computer:items-center md-computer:w-[15vw] md-computer:bg-[#D3F0D3]/35">
            <div className="flex flex-col flex-1 items-center md-computer:justify-evenly">
                <button onClick={() => navigate('/friends-shelf')} 
                className="flex items-center justify-center w-24 h-24 box-border rounded-full bg-[#D3F0D3] flex justify-center items-center
                md-computer:h-32 md-computer:w-32">
                    <img src={bookshelf} 
                    className="h-14 w-14 md-computer:h-20 md-computer:w-20 object-contain" />
                </button>
                <h1 className="font-inter text-center md-computer:text-lg">Friend's Shelf</h1>
            </div>
            <div className="flex flex-col flex-1 items-center md-computer:justify-evenly">
                <button onClick={() => navigate('/clubs')} 
                className="flex items-center justify-center w-24 h-24 box-border rounded-full bg-[#D3F0D3]
                md-computer:h-32 md-computer:w-32">
                    <img src={bookshelf} 
                    className="h-14 w-14 md:h-20 md:w-20 md-computer:h-20 md-computer:w-20 object-contain" />
                </button>
                <h1 className="font-inter text-center md-computer:text-lg">Find a Club</h1>
            </div>
            <div className="flex flex-col flex-1 items-center md-computer:justify-evenly">
                <button 
                className="flex items-center justify-center w-24 h-24 box-border rounded-full bg-[#D3F0D3]
                md-computer:h-32 md-computer:w-32">
                    <img src={bookshelf} 
                    className="h-14 w-14 md-computer:h-20 md-computer:w-20 object-contain" />
                </button>
                <h1 className="font-inter text-center md-computer:text-lg">Recent Discussion</h1>
            </div>
        </div>
    )
}