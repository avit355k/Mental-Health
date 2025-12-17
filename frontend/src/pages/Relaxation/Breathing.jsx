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
    ].filter(s => s.duration > 0);

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
          runCycle(type); // Restart loop
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
    <section className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans text-slate-800">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 text-emerald-500">Relaxation & Breathing</h1>
        <p className="text-gray-500 text-lg">Calm your mind with guided breathing exercises</p>
      </div>

      {/* Breathing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {breathingTypes.map((type) => (
          <div key={type.id} className="bg-white rounded-3xl shadow-xl shadow-gray-200 border border-gray-100 p-10 flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">{type.title}</h2>
            <p className="text-gray-400 text-sm mb-8">{type.subtitle}</p>

            <div className="relative flex items-center justify-center mb-10">
              <div className={`w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ${active?.id === type.id && playing ? 'border-emerald-500 scale-110' : 'border-gray-200'}`}>
                <span className="text-5xl font-bold text-gray-700">
                  {active?.id === type.id && playing ? timeLeft : type.inhale}
                </span>
                <span className="text-gray-400 font-medium uppercase tracking-widest text-xs mt-1">
                  {active?.id === type.id && playing ? phase : "Ready"}
                </span>
              </div>
            </div>

            <div className="flex gap-4 mb-10">
              <button
                onClick={() => (active?.id === type.id && playing ? stopBreathing() : startBreathing(type))}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-emerald-200"
              >
                {active?.id === type.id && playing ? <FaPause /> : <FaPlay />}
                {active?.id === type.id && playing ? "Pause" : "Start"}
              </button>
              
              <button 
                onClick={stopBreathing}
                className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 px-8 py-3 rounded-xl font-semibold transition-all"
              >
                <FaUndo /> Reset
              </button>
            </div>

            <div className="w-full bg-gray-100 rounded-2xl p-6 text-center space-y-1">
              <p className="font-medium text-gray-700"><b>Inhale</b> for {type.inhale} seconds</p>
              {type.hold && <p className="font-medium text-gray-700"><b>Hold</b> for {type.hold} seconds</p>}
              <p className="font-medium text-gray-700"><b>Exhale</b> for {type.exhale} seconds</p>
            </div>
          </div>
        ))}
      </div>

      <audio ref={audioRef} loop>
        <source src="/Audio/tibetan.mp3" type="audio/mpeg" />
      </audio>
    </section>
  );
};

export default Breathing;
