import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaPause, FaUndo } from "react-icons/fa";

const breathingTypes = [
  { id: 1, title: "4-7-8 Breathing", subtitle: "A calming technique for anxiety relief", inhale: 4, hold: 7, exhale: 8 },
  { id: 2, title: "Box Breathing", subtitle: "Focus and stress reduction", inhale: 4, hold: 4, exhale: 4, hold2: 4 },
  { id: 3, title: "Calm Breathing", subtitle: "Gentle relaxation", inhale: 5, exhale: 6 },
  { id: 4, title: "Slow Breathing", subtitle: "Deep parasympathetic activation", inhale: 6, exhale: 8 },
];

const Breathing = () => {
  const [active, setActive] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState("Ready");
  const [timeLeft, setTimeLeft] = useState(0);

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startBreathing = (type) => {
    setActive(type);
    setPlaying(true);
    audioRef.current.play();
    runCycle(type);
  };

  const runCycle = (type) => {
    const sequence = [
      { name: "Inhale", duration: type.inhale },
      { name: "Hold", duration: type.hold || 0 },
      { name: "Exhale", duration: type.exhale },
      { name: "Hold", duration: type.hold2 || 0 },
    ].filter((s) => s.duration > 0);

    let currentIdx = 0;

    const executePhase = () => {
      const current = sequence[currentIdx];
      setPhase(current.name);
      setTimeLeft(current.duration);
      speak(current.name);

      timerRef.current = setTimeout(() => {
        currentIdx++;
        if (currentIdx < sequence.length) {
          executePhase();
        } else {
          runCycle(type);
        }
      }, current.duration * 1000);
    };

    executePhase();
  };

  useEffect(() => {
    if (playing && timeLeft > 0) {
      countdownRef.current = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(countdownRef.current);
  }, [playing, phase]);

  const stopBreathing = () => {
    setPlaying(false);
    setPhase("Ready");
    setTimeLeft(0);
    audioRef.current.pause();
    clearTimeout(timerRef.current);
    clearInterval(countdownRef.current);
    window.speechSynthesis.cancel();
  };

  return (
    <section
      className="relative min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{ backgroundImage: "url('/night.jpg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex flex-col items-center py-10 sm:py-12 px-4 sm:px-6 font-sans">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-2">
            Relaxation & Breathing
          </h1>
          <p className="text-white/70 text-base sm:text-lg">
            Calm your mind with guided breathing exercises
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-5xl">
          {breathingTypes.map((type) => (
            <div
              key={type.id}
              className="
                backdrop-blur-xl bg-white/10
                border border-white/20
                rounded-3xl
                p-6 sm:p-8 lg:p-10
                shadow-2xl
              "
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-1">
                {type.title}
              </h2>
              <p className="text-white/60 text-sm mb-6 sm:mb-8">
                {type.subtitle}
              </p>

              {/* Breathing Circle */}
              <div className="flex justify-center mb-8 sm:mb-10">
                <div
                  className={`
                    w-36 h-36 sm:w-44 sm:h-44 lg:w-48 lg:h-48
                    rounded-full border-4
                    flex flex-col items-center justify-center
                    transition-all duration-1000
                    ${
                      active?.id === type.id && playing
                        ? "border-emerald-400 scale-110"
                        : "border-white/30"
                    }
                  `}
                >
                  <span className="text-4xl sm:text-5xl font-bold">
                    {active?.id === type.id && playing ? timeLeft : type.inhale}
                  </span>
                  <span className="text-white/70 uppercase tracking-widest text-xs mt-1">
                    {active?.id === type.id && playing ? phase : "Ready"}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10 justify-center">
                <button
                  onClick={() =>
                    active?.id === type.id && playing
                      ? stopBreathing()
                      : startBreathing(type)
                  }
                  className="
                    flex items-center justify-center gap-2
                    bg-emerald-500 hover:bg-emerald-600
                    text-white px-6 sm:px-8 py-3
                    rounded-xl font-semibold transition
                    shadow-lg shadow-emerald-500/30
                  "
                >
                  {active?.id === type.id && playing ? <FaPause /> : <FaPlay />}
                  {active?.id === type.id && playing ? "Pause" : "Start"}
                </button>

                <button
                  onClick={stopBreathing}
                  className="
                    flex items-center justify-center gap-2
                    bg-white/10 hover:bg-white/20
                    border border-white/20
                    text-white px-6 sm:px-8 py-3
                    rounded-xl font-semibold transition
                  "
                >
                  <FaUndo /> Reset
                </button>
              </div>

              {/* Info */}
              <div className="bg-white/10 rounded-2xl p-4 sm:p-6 text-center space-y-1">
                <p><b>Inhale</b> for {type.inhale} seconds</p>
                {type.hold && <p><b>Hold</b> for {type.hold} seconds</p>}
                <p><b>Exhale</b> for {type.exhale} seconds</p>
              </div>
            </div>
          ))}
        </div>

        {/* Audio */}
        <audio ref={audioRef} loop>
          <source src="/Audio/tibetan.mp3" type="audio/mpeg" />
        </audio>
      </div>
    </section>
  );
};

export default Breathing;
