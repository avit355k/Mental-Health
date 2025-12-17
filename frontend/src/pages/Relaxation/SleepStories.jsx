import React from "react";

const SleepStories = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/bg.mp4" type="video/mp4" />
      </video>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 text-white">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">
            Sleep Stories
          </h1>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">
            Peaceful stories designed to help you relax and drift into deep sleep.
          </p>
        </div>

        {/* Placeholder / Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                backdrop-blur-md
                bg-white/10
                border border-white/20
                rounded-2xl
                p-6
                shadow-lg
                hover:bg-white/20
                transition
              "
            >
              <h3 className="text-lg font-semibold mb-2">
                Story {item}
              </h3>
              <p className="text-sm text-white/80 mb-4">
                A calming bedtime story to help you unwind and fall asleep peacefully.
              </p>

              <button className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
                Listen
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SleepStories;
