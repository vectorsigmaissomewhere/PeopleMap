import { Outlet } from "react-router-dom";

function PeopleLayout(){
    return (
        <div className="flex flex-col bg-white overflow-hidden">
            <div>People Layout</div>
            <main className="flex flex-col w-full">
                <Outlet/>
            </main>
        </div>
    )
}

export default PeopleLayout;