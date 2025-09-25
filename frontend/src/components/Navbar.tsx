const Navbar = () => {
  return (
    <nav className="absolute rounded-full bg-zinc-950/60 border-1 border-zinc-800 left-1/2 m-8 transform -translate-x-1/2 min-w-[38rem] mx-auto z-30">
      <div className="flex items-center justify-between p-4">
        <div className="text-lg text-white ml-2 font-bold">AI Assistant</div>
        <div className="flex gap-4 mr-2">
          <button className="text-cyan-500 text-sm cursor-pointer hover:text-cyan-500 font-semibold transition-colors">
            Home
          </button>
          <button className="text-cyan-500 text-sm cursor-pointer hover:text-cyan-500 font-semibold transition-colors">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
