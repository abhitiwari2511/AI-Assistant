import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import HomePage from "./pages/HomePage";
import CustomizePage from "./pages/CustomizePage";
import SplashCursor from "./components/ui/SplashCursor/SplashCursor"

function App() {
  return (
    <div className="bg-[#0f0a16] min-h-screen">
      <SplashCursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/ai-avtar" element={<CustomizePage />} />
      </Routes>
    </div>
  );
}

export default App;
