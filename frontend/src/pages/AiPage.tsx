import { Button } from "@/components/ui/button";
import getAiResponse from "@/lib/aiResponse";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  _id: string;
  fullName: string;
  email: string;
  assistantName?: string;
  assistantImage?: string;
}

interface CommandData {
  type: string;
  userInput: string;
  res: string;
}

const AiPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const speakingRef = useRef<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
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

  const voice = (text: string) => {
    const synth = window.speechSynthesis;

    synth.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "hi-IN"; // Set to Hindi (India)
    speech.rate = 0.8; // Slightly slower for better clarity
    speech.pitch = 1;
    speech.volume = 1;

    const speakingRef = { current: true };

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log("Error stopping recognition:", error);
      }
    }

    speech.onend = () => {
      speakingRef.current = false;
      recognitionRef.current?.start();
    };

    const voices = speechSynthesis.getVoices();
    console.log("Available voices:", voices);
    const hindiVoice = voices.find(
      (voice) => voice.lang.includes("hi") || voice.lang.includes("hindi")
    );

    if (hindiVoice) {
      speech.voice = hindiVoice;
      console.log("Using Hindi voice:", hindiVoice.name);
    } else {
      console.log("Hindi voice not found, using default");
    }
    synth.speak(speech);
  };

  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      console.log("Speech recognition not supported");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognisingRef.current = true;
      setIsListening(true);
      // console.log("Voice recognition started. Try speaking into the microphone.");
    };

    const handleCommand = (data: CommandData) => {
      const { type, userInput, res } = data;
      voice(res);
      if (type === "google_search") {
        const query = encodeURIComponent(userInput);
        window.open(`https://google.com/search?q=${query}`, "_blank");
      }
      if (type === "calculator_open") {
        const query = encodeURIComponent(userInput);
        window.open(`https://google.com/search?q=${query}`, "_blank");
      }
      if (type === "instagram_open") {
        const query = encodeURIComponent(userInput);
        window.open(`https://www.instagram.com/${query}/`, "_blank");
      }
      if (type === "facebook_open") {
        const query = encodeURIComponent(userInput);
        window.open(`https://facebook.com/${query}`, "_blank");
      }
      if (type === "weather_show") {
        const query = encodeURIComponent(userInput);
        window.open(`https://google.com/search?q=${query}`, "_blank");
      }
      if (type === "youtube_search" || type === "youtube_play") {
        const query = encodeURIComponent(userInput);
        window.open(
          `https://www.youtube.com/results?search_query=${query}`,
          "_blank"
        );
      }
    };

    recognition.continuous = true;
    recognition.lang = "en-IN";

    const isRecognisingRef = { current: false };

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      console.log("heard: ", transcript);
      if (
        transcript
          .toLowerCase()
          .includes(`${user?.assistantName?.toLowerCase()}`)
      ) {
        try {
          const data = await getAiResponse(transcript);
          if (data && (data as { res: string }).res) {
            handleCommand(data as CommandData);
          } else {
            voice("Sorry, I couldn't process your request.");
          }
        } catch (error) {
          console.error("Error getting AI response:", error);
          voice("Sorry, there was an error processing your request.");
        }
      }
    };

    const safeRecognise = () => {
      if (!speakingRef.current && !isRecognisingRef.current) {
        try {
          recognition.start();
        } catch (error) {
          console.log("Recognition already running", error);
        }
      }
    };

    recognition.onend = () => {
      isRecognisingRef.current = false;
      setIsListening(false);

      if (!speakingRef.current) {
        setTimeout(() => {
          safeRecognise();
        }, 1000);
      }
    };

    const repeatRecognition = setInterval(() => {
      if (!isRecognisingRef.current && !speakingRef.current) {
        safeRecognise();
      }
    }, 10000);

    safeRecognise();

    return () => {
      recognition.stop();
      setIsListening(false);
      isRecognisingRef.current = false;
      clearInterval(repeatRecognition);
    };
  }, [user?.assistantName]);

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

  if (isLoading) {
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
          <div className="w-52 h-52 rounded-full overflow-hidden border-4 border-cyan-600">
            <img
              src={user.assistantImage}
              alt={user.assistantName || "Assistant"}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="text-3xl text-cyan-600 font-bold">
          {user?.assistantName || "Your Assistant"}
        </h1>
        <p className="text-white">Welcome back, {user?.fullName}!</p>
      </div>
    </div>
  );
};

export default AiPage;
