import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface AuthProps {
  mode: "signin" | "signup";
  onSubmit?: (data: {
    email: string;
    password: string;
    fullName?: string;
  }) => void;
}

export function useAuthHandler({ mode }: AuthProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "signup";
  const handleAuth = async (
    e: React.FormEvent<HTMLFormElement>,
    email: string,
    password: string,
    fullName?: string
  ) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password || (isSignUp && !fullName)) {
      Error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const url = import.meta.env.VITE_BACKEND_URL;
      const endPoints = isSignUp
        ? `${url}/api/v1/users/registerUser`
        : `${url}/api/v1/users/login`;

      // backend returns { user: UserData } so type accordingly
      const res = await axios.post<{ user: UserData }>(
        endPoints,
        {
          email,
          password,
          ...(isSignUp && { fullName }),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const userData = res.data.user;
      console.log(userData);
      if (userData?.assistantName && userData?.assistantImage) {
        // agr user ne setup kra hai to ai page pr jao
        navigate("/ai");
      } else {
        // new user hai to customize page pr jao
        navigate("/choose-avatar");
      }
    } catch (error: unknown) {
      console.error("Authentication error:", error);
      setLoading(false);
    }
  };
  return { loading, handleAuth };
}

type UserData = {
  assistantName?: string;
  assistantImage?: string;
  [key: string]: string | undefined;
};

export const CheckAuth = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasAssistant, setHasAssistant] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const checkAuthStatus = async () => {
    setLoading(true);
    try {
      const url = import.meta.env.VITE_BACKEND_URL;
      const endPoints = `${url}/api/v1/users/current-user`;
      const response = await axios.get<UserData>(endPoints, {
        withCredentials: true,
      });
      if (response.status === 200 && response.data) {
        setLoggedIn(true);
        setUserData(response.data);
        if (response.data.assistantName && response.data.assistantImage) {
          setHasAssistant(true);
        } else {
          setHasAssistant(false);
        }
      } else {
        setLoggedIn(false);
        navigate("/signin");
      }
    } catch (error: unknown) {
      console.log("Failed to fetch user data", error);
      setLoggedIn(false);
      navigate("/signin");
    } finally {
      setLoading(false);
    }
  };
  return {
    loggedIn,
    setLoggedIn,
    checkAuthStatus,
    loading,
    hasAssistant,
    userData,
  };
};
