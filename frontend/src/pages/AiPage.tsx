import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  fullName: string;
  email: string;
  assistantName?: string;
  assistantImage?: string;
}

const AiPage = () => {
  const [isloading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const url = import.meta.env.VITE_BACKEND_URL;
        const endPoints = `${url}/api/v1/users/current-user`;
        const response = await axios.get(endPoints, { withCredentials: true });
        const data = (response.data as { user: User }).user || response.data;
        setUser(data);
        setIsLoading(false);
      } catch (error) {
        console.log("failed to fetch user data", error);
        setIsLoading(false);
        // agr unauthorize hai to back to login page
        navigate("/signin");
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const url = import.meta.env.VITE_BACKEND_URL;
      const endPoints = `${url}/api/v1/users/logout`;
      await axios.post(endPoints, {}, { withCredentials: true });
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };
  const handleCustomize = () => {
    navigate("/choose-avatar");
  };

  if (isloading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <div>
        <Button
          variant={"secondary"}
          onClick={handleLogout}
          className="absolute cursor-pointer top-6 right-6"
        >
          Logout
        </Button>
        <Button
          variant={"secondary"}
          onClick={handleCustomize}
          className="absolute cursor-pointer top-20 right-6"
        >
          Customize Your Assistant
        </Button>
      </div>
      <div className="flex flex-col justify-center items-center h-screen gap-6">
        {user?.assistantImage && (
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-200">
            <img
              src={user.assistantImage}
              alt={user.assistantName || "Assistant"}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl text-yellow-200 font-bold">
          {user?.assistantName || "Your Assistant"}
        </h1>
      </div>
    </div>
  );
};

export default AiPage;
