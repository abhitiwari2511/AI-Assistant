import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/HomePage";
import CustomizePage from "./pages/CustomizePage";
import SplashCursor from "./components/ui/SplashCursor/SplashCursor"
import AiName from "./components/AiName";
import AiPage from "./pages/AiPage";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <div className="bg-[#0f0a16] min-h-screen">
      <SplashCursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/choose-avatar" element={<CustomizePage />} />
        <Route path="/ai-name" element={<AiName />} />
        <Route path="/ai" element={<AiPage />} />
      </Routes>
      <Analytics />
    </div>
  );
}

export default App;
