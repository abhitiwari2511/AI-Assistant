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

      await axios.post(
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
      navigate("/choose-avatar");
    } catch (error: unknown) {
      console.error("Authentication error:", error);
      setLoading(false);
    }
  };
  return { loading, handleAuth };
}

export const CheckAuth = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const url = import.meta.env.VITE_BACKEND_URL;
      const endPoints = `${url}/api/v1/users/current-user`;
      const response = await axios.get(endPoints, { withCredentials: true });
      if (response.status === 200 && response.data) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
        navigate("/signin");
      }
    } catch (error: unknown) {
      console.log("Failed to fetch user data", error);
      setLoggedIn(false);
      navigate("/signin");
    }
  };
  return { loggedIn, setLoggedIn, checkAuthStatus };
};
