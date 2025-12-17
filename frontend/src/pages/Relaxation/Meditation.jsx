import React from "react";

const meditationSounds = [
  {
    title: "Rain Sounds",
    description: "Gentle rain to calm your mind",
    src: "/Audio/thunderstorm-and-heavy-raining.mp3",
  },
  {
    title: "Ocean Waves",
    description: "Relaxing waves for deep meditation",
    src: "/Audio/ocean-waves.mp3",
  },
  {
    title: "Waterfall Ambience",
    description: "Waterfall sounds in the mountains",
    src: "/Audio/waterfall-in-the-mountains.mp3",
  },
  {
    title: "Winds Meditation",
    description: "Winter winds for tranquility",
    src: "/Audio/winter-wind.mp3",
  },
];

const Meditation = () => {
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
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 text-white">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">
            Meditation Sounds
          </h1>
          <p className="mt-3 text-white/80 max-w-xl mx-auto">
            Choose a calming sound and begin your meditation journey.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {meditationSounds.map((sound, index) => (
            <div
              key={index}
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
              <h3 className="text-lg font-semibold">
                {sound.title}
              </h3>
              <p className="text-sm text-white/80 mb-4">
                {sound.description}
              </p>

              <audio controls className="w-full">
                <source src={sound.src} type="audio/mpeg" />
              </audio>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Meditation;
