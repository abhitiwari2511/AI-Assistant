import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Home", route: "/" },
  { label: "Register", route: "/signup" },
];

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="absolute rounded-full bg-zinc-950/60 border-1 border-zinc-800 left-1/2 m-8 transform -translate-x-1/2 min-w-[38rem] mx-auto z-30">
      <div className="flex items-center justify-between p-4">
        <div className="flex justify-center">
          <img
            src="https://imgs.search.brave.com/AIOosMEPLEri9dQiYOgso-64B96r9VncHzH666CPM3U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/cGl4YWJheS5jb20v/cGhvdG8vMjAyMy8w/Mi8wNS8yMC8wMS9h/aS1nZW5lcmF0ZWQt/Nzc3MDQ3NF8xMjgw/LnBuZw"
            alt="logo"
            className="h-8 w-8"
          />
          <div className="text-lg text-white ml-2 font-bold">AI Assistant</div>
        </div>
        <div className="flex gap-4 mr-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.route)}
              className="text-cyan-500 text-sm cursor-pointer hover:text-cyan-400 font-bold transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
