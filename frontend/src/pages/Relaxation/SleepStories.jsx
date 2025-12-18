import React, { useRef, useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

const sleepStory = [
  {
    title: "Haunted House",
    src: "/Audio/HauntedHouse.mp3",
    cover: "/haunted_house.png",
  },
  {
    title: "Hunger Artist",
    src: "/Audio/HungerArtist.mp3",
    cover: "/HungerArtist.png",
  },
  {
    title: "Naturalist River Amazons",
    src: "/Audio/NaturalistRiverAmazons.mp3",
    cover: "/RiverOfAmazon.png",
  },
  {
    title: "The Battle Of Life",
    src: "/Audio/TheBattleofLife.mp3",
    cover: "/TheBattleofLife.png",
  },
];

const SleepStories = () => {
  const audioRefs = useRef([]);
  const [playingIndex, setPlayingIndex] = useState(null);
  const [progress, setProgress] = useState({});
  const [duration, setDuration] = useState({});

  const togglePlay = (index) => {
    audioRefs.current.forEach((audio, i) => {
      if (i !== index && audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    const audio = audioRefs.current[index];
    if (!audio) return;

    if (playingIndex === index) {
      audio.pause();
      setPlayingIndex(null);
    } else {
      audio.play();
      setPlayingIndex(index);
    }
  };

  const handleTimeUpdate = (index) => {
    const audio = audioRefs.current[index];
    setProgress((p) => ({ ...p, [index]: audio.currentTime }));
  };

  const handleLoadedMetadata = (index) => {
    const audio = audioRefs.current[index];
    setDuration((d) => ({ ...d, [index]: audio.duration }));
  };

  const handleSeek = (index, value) => {
    const audio = audioRefs.current[index];
    audio.currentTime = value;
  };

  const formatTime = (time = 0) =>
    `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

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

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 text-white">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold">Sleep Stories</h1>
          <p className="text-white/80 mt-2">
            Calm stories to help you drift into deep sleep
          </p>
        </div>

        {/* Spotify Style Cards */}
        <div className="space-y-4">
          {sleepStory.map((story, index) => (
            <div
              key={index}
              className={`
                flex items-center gap-5 p-4 rounded-xl
                backdrop-blur-lg border border-white/20
                bg-white/10 hover:bg-white/20 transition
                ${
                  playingIndex === index
                    ? "ring-2 ring-green-400/60"
                    : ""
                }
              `}
            >
              {/* Cover */}
              <img
                src={story.cover}
                alt={story.title}
                className="w-16 h-16 rounded-lg object-cover"
              />

              {/* Title */}
              <div className="flex-1">
                <h3 className="font-semibold">{story.title}</h3>
                <p className="text-sm text-white/60">Sleep Story</p>

                {/* Progress Bar */}
                <input
                  type="range"
                  min="0"
                  max={duration[index] || 0}
                  value={progress[index] || 0}
                  onChange={(e) =>
                    handleSeek(index, Number(e.target.value))
                  }
                  className="w-full mt-2 accent-green-400"
                />

                {/* Time */}
                <div className="flex justify-between text-xs text-white/60">
                  <span>{formatTime(progress[index])}</span>
                  <span>{formatTime(duration[index])}</span>
                </div>
              </div>

              {/* Play Button */}
              <button
                onClick={() => togglePlay(index)}
                className="
                  w-12 h-12 flex items-center justify-center
                  rounded-full bg-green-500 hover:scale-105
                  transition
                "
              >
                {playingIndex === index ? <FaPause /> : <FaPlay />}
              </button>

              {/* Audio */}
              <audio
                ref={(el) => (audioRefs.current[index] = el)}
                src={story.src}
                onTimeUpdate={() => handleTimeUpdate(index)}
                onLoadedMetadata={() => handleLoadedMetadata(index)}
                onEnded={() => setPlayingIndex(null)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SleepStories;
