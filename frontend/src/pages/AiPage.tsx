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
    speech.lang = "en-IN";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    speakingRef.current = true;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log("Error stopping recognition:", error);
      }
    }

    speech.onstart = () => {
      console.log("Speech started");
    };

    speech.onend = () => {
      console.log("Speech ended");
      speakingRef.current = false;
      setTimeout(() => {
        if (recognitionRef.current && !speakingRef.current) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.log("Error restarting recognition:", error);
          }
        }
      }, 1000);
    };

    speech.onerror = (event) => {
      console.error("Speech error:", event);
      speakingRef.current = false;

      setTimeout(() => {
        if (recognitionRef.current && !speakingRef.current) {
          try {
            recognitionRef.current.start();
          } catch (error) {
            console.log(
              "Error restarting recognition after speech error:",
              error
            );
          }
        }
      }, 1000);
    };

    const setVoice = () => {
      const voices = speechSynthesis.getVoices();
      console.log("Available voices:", voices.length);

      const hindiVoice = voices.find((voice) => voice.lang === "en-IN");

      if (hindiVoice) {
        speech.voice = hindiVoice;
        console.log("Using Hindi voice:", hindiVoice.name);
      } else {
        const indianVoice = voices.find((voice) => voice.lang === "en-IN");
        if (indianVoice) {
          speech.voice = indianVoice;
          console.log("Using Indian English voice:", indianVoice.name);
        } else {
          console.log("No Hindi/Indian voice found, using default");
        }
      }
      synth.speak(speech);
    };

    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      setVoice();
    } else {
      speechSynthesis.addEventListener("voiceschanged", setVoice, {
        once: true,
      });
    }
  };

  useEffect(() => {
    if (!user?.assistantName) {
      console.log("Waiting for user data...");
      return;
    }

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

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    let isRecognitionActive = false;

    const safeStart = () => {
      if (isRecognitionActive || speakingRef.current) {
        console.log("Cannot start - already active or speaking");
        return;
      }

      try {
        recognition.start();
        isRecognitionActive = true;
        console.log("Recognition started");
      } catch (error) {
        console.log("Recognition start error:", error);
      }
    };

    recognition.onstart = () => {
      console.log(
        "Voice recognition started. Try speaking into the microphone."
      );
      isRecognitionActive = true;
      setIsListening(true);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognitionActive = false;
      setIsListening(false);

      // jab nhi bolta tb restart
      if (!speakingRef.current) {
        setTimeout(() => {
          safeStart();
        }, 1000);
      }
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

    recognition.onresult = async (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      console.log("heard: ", transcript);

      if (
        user?.assistantName &&
        transcript.toLowerCase().includes(user.assistantName.toLowerCase())
      ) {
        console.log("Assistant name detected!");

        try {
          const data = await getAiResponse(transcript);
          console.log("AI response:", data);

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

    // Start initial recognition
    safeStart();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
      setIsListening(false);
    };
  }, [user?.assistantName]);

  const handleLogout = async () => {
    try {
      const url = import.meta.env.VITE_BACKEND_URL;
      const endPoints = `${url}/api/v1/users/logout`;
      await axios.post(endPoints, {}, { withCredentials: true });
      navigate("/");
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

        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isListening ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          ></div>
          <p className="text-gray-300">
            {isListening ? "Listening..." : "Not listening"}
          </p>
        </div>

        <p className="text-gray-400 text-center">
          Say "{user?.assistantName}" to activate
        </p>
      </div>
    </div>
  );
};

export default AiPage;
