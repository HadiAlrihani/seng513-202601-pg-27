import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import HomeSidebar from "../components/HomeSidebar";

export default function Homepage() {
    return  (
        <>
        <Navbar />
        <div className="h-[90vh] md-computer:h-[85vh] flex flex-col">
            <div className="py-6 md-computer:hidden">
                <h1 className="font-italiana text-3xl text-center">
                    Wormly Connected
                </h1>
            </div>
            <HomeSidebar />
        </div>
        <MobileNavbar />
        </>
    )
}