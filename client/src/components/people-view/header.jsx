import { Menu } from "lucide-react";
import { Button } from "../ui/button";

function PeopleHeader({ setOpenSidebar }) {
    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            {/* Hamburger menu icon - visible only on mobile */}
            <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden" 
                onClick={() => setOpenSidebar(true)}
            >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
            </Button>
            
            <div className="flex-1">
                <h1 className="text-lg font-semibold md:text-xl">People Management</h1>
            </div>
            
            {/* You can add other header items here like user profile, notifications, etc. */}
            <div className="flex items-center gap-4">
                {/* Add your user profile, notifications, etc. here */}
            </div>
        </header>
    );
}

export default PeopleHeader;