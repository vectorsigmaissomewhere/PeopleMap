import { useSelector } from "react-redux";

function Dashboard(){
    const { user } = useSelector((state) => state.auth);
    console.log(user.name);
    return(
        <div className="p-8">
            <h1 className="text-2xl font-bold">
                Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="mt-4">This is people home page</p>
            
            {/* Display user information */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                <div className="space-y-2">
                    <p><span className="font-medium">Full Name:</span> {user?.name}</p>
                    <p><span className="font-medium">Email:</span> {user?.email}</p>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;