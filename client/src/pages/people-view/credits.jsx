import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Credits() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            This feature is not available right now
          </h1>
          <p className="text-muted-foreground">
            Please check back later.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Credits;