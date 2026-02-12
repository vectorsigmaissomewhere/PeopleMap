import { Outlet } from "react-router-dom";
import PeopleSideBar from "./sidebar";
import PeopleHeader from "./header";
import { useState } from "react";

function PeopleLayout() {
    const [openSidebar, setOpenSidebar] = useState(false);
    
    return (
        <div className="flex h-screen bg-white overflow-hidden">
            {/* Sidebar */}
            <PeopleSideBar open={openSidebar} setOpen={setOpenSidebar} />
            
            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Pass setOpenSidebar to header */}
                <PeopleHeader setOpenSidebar={setOpenSidebar} />
                
                {/* Main content area with scrolling */}
                <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default PeopleLayout;