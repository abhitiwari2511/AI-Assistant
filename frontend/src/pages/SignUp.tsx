import Auth from "@/components/Auth";
import Aurora from "../components/ui/Aurora";

const SignUp = () => {
  return (
    <div className="w-full relative min-h-screen z-0 isolate">
      <div className="-z-10 absolute inset-0">
        <Aurora
          colorStops={["#7CFF67", "#B19EEF", "#5227FF"]}
          blend={0.5}
          amplitude={1}
          speed={1.0}
        />
      </div>
      <div className="flex items-center relative min-h-[42rem] lg:min-h-screen z-10 justify-center">
        <Auth mode="signup" />
      </div>
    </div>
  );
};

export default SignUp;
