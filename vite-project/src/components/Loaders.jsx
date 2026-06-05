const Loaders = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white">
      
      {/* ANIMATED GRADIENT BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-white to-gray-200 animate-pulse" />

      {/* BLUR CIRCLES */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-30 animate-bounce" />

      <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30 animate-bounce delay-300" />

      {/* LOADER */}
      <div className="relative flex items-center justify-center">
        
        {/* OUTER ROTATING RING */}
        <div className="w-24 h-24 rounded-full border-[6px] border-gray-200 border-t-black animate-spin" />

        {/* INNER OPEN CIRCLE */}
        <div className="absolute w-14 h-14 rounded-full border-[5px] border-transparent border-l-black border-r-black animate-spin [animation-direction:reverse] [animation-duration:1s]" />

        {/* CENTER DOT */}
        <div className="absolute w-3 h-3 bg-black rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default Loaders;