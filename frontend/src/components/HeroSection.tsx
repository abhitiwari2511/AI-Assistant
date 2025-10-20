import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Button } from "./ui/button";

const HeroSection = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/signin")
  }

  return (
    <div className="h-screen relative overflow-x-hidden">
      <Navbar />
      <div className="absolute inset-0 lg:h-full h-[42rem] flex items-center justify-center">
        <div className="max-w-[20rem] lg:max-w-[38rem] lg:mt-10 mx-auto text-white text-center">
          <Button
            variant={"outline"}
            className="mb-4 h-8 w-fit bg-zinc-800/40 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-bot-icon lucide-bot"
            >
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
            </svg>
            Introducing AI Assistant
          </Button>
          <h1 className="font-bold max-w-[30rem] text-white w-full text-[20px] lg:text-[2rem]">
            Welcome to the world of an AI The Future is here !!
          </h1>

          <Button
            variant={"outline"}
            className="text-black mt-8 lg:mt-10 cursor-pointer hover:bg-blue-300"
            onClick={handleClick}
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
