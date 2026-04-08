import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import HomeSidebar from "../components/HomeSidebar";

import bookshelf from "../assets/bookshelf.png";

export default function Homepage() {
    return  (
        <>
        <Navbar />
        <div className="h-[90vh] md-computer:h-[85vh] flex flex-col md-computer:flex-row">
            <div className="py-6 md-computer:hidden">
                <h1 className="font-italiana text-3xl text-center">
                    Wormly Connected
                </h1>
            </div>
            <HomeSidebar />
            <div className="flex flex-1 flex-col justify-evenly">
                <h1 className="font-inter text-lg text-center">
                    Welcome, user...
                </h1>
                <div className="flex justify-evenly">
                    <div className="flex flex-col">
                        <button onClick={() => navigate('/friends-shelf')} 
                        className="flex items-center justify-center w-36 h-36 box-border rounded-full bg-[#D3F0D3] flex justify-center items-center
                        md-computer:h-32 md-computer:w-32">
                            <img src={bookshelf} 
                            className="h-14 w-14 md-computer:h-20 md-computer:w-20 object-contain" />
                        </button>
                        <h1 className="font-inter text-center md-computer:text-lg">Friend's Shelf</h1>
                    </div>
                    <div className="flex flex-col">
                        <button onClick={() => navigate('/friends-shelf')} 
                        className="flex items-center justify-center w-36 h-36 box-border rounded-full bg-[#D3F0D3] flex justify-center items-center
                        md-computer:h-32 md-computer:w-32">
                            <img src={bookshelf} 
                            className="h-14 w-14 md-computer:h-20 md-computer:w-20 object-contain" />
                        </button>
                        <h1 className="font-inter text-center md-computer:text-lg">Friend's Shelf</h1>
                    </div>
                </div>
            </div>
            <div className="hidden md-computer:flex flex-col h-[85vh] items-center w-[15vw] bg-[#D3F0D3]/35">
                <h1 className="font-italiana text-center text-3xl py-[2vh]"> My Library</h1>
                <div className="flex flex-col h-[40vh] justify-evenly">
                    <button  
                    className="bg-[#D3F0D3] rounded-lg w-[12vw] py-[1vh]">
                        <h1 className="font-italiana text-center text-2xl">Current Reads</h1>
                    </button>
                    <button
                    className="bg-[#D3F0D3] rounded-lg w-[12vw] py-[1vh]">
                        <h1 className="font-italiana text-center text-2xl">Want to Read</h1>
                    </button>
                    <button 
                    className="bg-[#D3F0D3] rounded-lg w-[12vw] py-[1vh]">
                        <h1 className="font-italiana text-center text-2xl">Completed Reads</h1>
                    </button>
                    <button 
                    className="bg-[#D3F0D3] rounded-lg w-[12vw] py-[1vh]">
                        <h1 className="font-italiana text-center text-2xl">Favorites</h1>
                    </button>
                </div>
            </div>
        </div>
        <MobileNavbar />
        </>
    )
}