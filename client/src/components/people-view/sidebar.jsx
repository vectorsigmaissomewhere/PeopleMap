import { 
  ChartNoAxesCombined, 
  LayoutDashboard, 
  ShoppingBasket, 
  Truck, 
  Users, 
  Tags, 
  Settings, 
  BarChart,
  UserPlus,
  CreditCard,
  Tag,
  PieChart,
  UserCog
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetHeader, SheetTitle, SheetContent } from "../ui/sheet";

export const peopleSidebarMenuItems = [
    {
        id: "dashboard",
        label: "Dashboard",
        path: "/people/dashboard",
        icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
        id: "people",
        label: "People",
        path: "/people/list",
        icon: <Users className="h-5 w-5" />
    },
    {
        id: "addperson",
        label: "Add Person",
        path: "/people/add",
        icon: <UserPlus className="h-5 w-5" /> 
    },
    {
        id: "groups&tags",
        label: "Groups & Tags",
        path: "/people/groups",
        icon: <Tag className="h-5 w-5" /> 
    },
    {
        id: "analytics",
        label: "Analytics",
        path: "/people/analytics",
        icon: <PieChart className="h-5 w-5" /> 
    },
    {
        id: "credits",
        label: "Credits",
        path: "/people/credits",
        icon: <CreditCard className="h-5 w-5" />  
    },
    {
        id: "settings",
        label: "Settings",
        path: "/people/settings", 
        icon: <Settings className="h-5 w-5" />
    },
];

function MenuItems({ setOpen }) {
    const navigate = useNavigate();
    
    return (
        <nav className="mt-8 flex flex-col gap-1">
            {peopleSidebarMenuItems.map((menuItem) => (
                <div
                    key={menuItem.id}
                    onClick={() => {
                        navigate(menuItem.path);
                        if (setOpen) setOpen(false);
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                    {menuItem.icon}
                    <span>{menuItem.label}</span>
                </div>
            ))}
        </nav>
    );
}

function PeopleSideBar({ open, setOpen }) {
    const navigate = useNavigate();
    
    return (
        <Fragment>
            {/* Mobile sidebar (Sheet) */}
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="w-64 p-0">
                    <div className="flex h-full flex-col">
                        <SheetHeader className="border-b p-6">
                            <SheetTitle 
                                onClick={() => {
                                    navigate("/people/dashboard");
                                    setOpen(false);
                                }}
                                className="flex cursor-pointer items-center gap-2 text-xl font-bold"
                            >
                                <ChartNoAxesCombined className="h-6 w-6" />
                                <span>User Panel</span>
                            </SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto p-4">
                            <MenuItems setOpen={setOpen} />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-background lg:flex">
                <div 
                    onClick={() => navigate("/people/dashboard")} 
                    className="flex cursor-pointer items-center gap-2 border-b p-6"
                >
                    <ChartNoAxesCombined className="h-6 w-6" />
                    <h1 className="text-xl font-bold">User Panel</h1>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <MenuItems />
                </div>
            </aside>
        </Fragment>
    );
}

export default PeopleSideBar;