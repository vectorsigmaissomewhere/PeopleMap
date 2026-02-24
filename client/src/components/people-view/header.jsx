import { Menu, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from 'react-redux';
import { logout } from "@/store/auth-slice";
import { useNavigate } from 'react-router-dom';

function PeopleHeader({ setOpenSidebar }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/auth/login');
    };

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
            
            {/* Add logout button here */}
            <div className="flex items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>
        </header>
    );
}

export default PeopleHeader;