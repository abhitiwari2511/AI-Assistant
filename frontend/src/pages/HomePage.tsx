import DarkVeil from "@/components/DarkVeil";
import HeroSection from "@/components/HeroSection";

const HomePage = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <DarkVeil speed={0.5} warpAmount={1} hueShift={280} />
      </div>
      <div className="relative z-20">
        <HeroSection />
      </div>
    </div>
  );
};

export default HomePage;
