import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { FaTrophy, FaAward, FaHandPointer } from "react-icons/fa";

const prizes = ["I-Phone 17", "International Trip", "Gold Coin", "1kg Silver", "Spin Again"];

function InsigniaSpin() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);
  const [showHint, setShowHint] = useState(true);

  // 🎵 Create audio refs so we can control them easily
  const spinSound = useRef(null);
  const winSound = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // 🌀 SPIN handler
  const handleSpin = () => {
    if (spinning) return;

    const extraRounds = 5 * 360;
    const randomAngle = Math.floor(Math.random() * 360);
    const finalRotation = extraRounds + randomAngle;

    setRotation(prev => prev + finalRotation);
    setSpinning(true);

    // 🎵 Play spin sound
    if (spinSound.current) {
      spinSound.current.currentTime = 0;
      spinSound.current.play();
    }

    setTimeout(() => {
      setSpinning(false);
      setShowHint(false);
      const actualDegree = (rotation + randomAngle) % 360;
      const prizeIndex = Math.floor(actualDegree / (360 / prizes.length));
      const prize = prizes[prizes.length - 1 - prizeIndex];

      fireConfetti();

      // 🎵 Stop spin sound and play win sound
      if (spinSound.current) spinSound.current.pause();
      if (winSound.current) {
        winSound.current.currentTime = 0;
        winSound.current.play();
      }

      setTimeout(() => {
        setWonPrize(prize);
      }, 500);
    }, 4000);
  };

  const fireConfetti = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    confetti({ particleCount: 100, spread: 100, origin: { y: 0.4 } });
  };

  const handleReset = () => window.location.reload();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) handleReset();
  };

  return (
    <div className="flex flex-col min-h-screen py-8 bg-white items-center justify-center relative">
      {/* 🔊 Hidden Audio Elements */}
      <audio ref={spinSound} src="/spinning.mp3" preload="auto" />
      <audio ref={winSound} src="/win.mp3" preload="auto" />

      {/* Main content */}
      <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-4 px-4">
        {/* Left: Logo */}
        <div className="lg:mb-0">
          <img src="/insigniaMart.jpeg" alt="Logo" className="h-14 md:h-24 lg:h-44" />
        </div>

        {/* Center: Wheel */}
        <div className="relative w-[100%] h-[100%] max-w-[400px] max-h-[400px] md:max-w-[600px] md:max-h-[600px]">
          <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-16 border-b-red-500 z-10" />
          <div className="w-full h-full">
            <img
              onClick={handleSpin}
              src="/insigniaWheel.png"
              alt="Wheel"
              style={{ transform: `rotate(${rotation}deg)` }}
              className="w-full h-full cursor-pointer rounded-full overflow-hidden transition-transform duration-[4s] ease-out"
            />
          </div>
        </div>

        {/* Right: Spin & Win */}
        <div className="flex flex-col items-center gap-2 mt-2 lg:mt-0">
          <div className="flex americana gap-2 items-center text-6xl md:text-6xl lg:text-7xl font-extrabold text-green-600 drop-shadow-lg">
            <p>Spin</p>
          </div>
          <h1 className="text-6xl americana md:text-6xl lg:text-8xl font-extrabold text-green-600 drop-shadow-lg animate-bounce">
            And Win!
          </h1>
        </div>
      </div>

      {/* 🎉 Winning Popup */}
      {wonPrize && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-start md:justify-center z-50 p-4"
        >
          <div className="bg-gradient-to-br ms-5 md:ms-0 from-yellow-100 via-white to-yellow-100 border-4 md:border-8 border-yellow-400 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-10 text-center animate-pulse w-full max-w-[320px] md:max-w-[500px]">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-green-600 mb-4 md:mb-6 flex flex-col items-center gap-2 animate-bounce">
              <div className="flex gap-2 md:gap-4 text-yellow-500 text-4xl md:text-6xl">
                <FaTrophy />
                <FaAward />
              </div>
              Congratulations!
            </h2>

            <p className="text-lg md:text-2xl text-pink-600 font-semibold mb-2 md:mb-4">
              You've Won
            </p>
            <p className="text-3xl md:text-5xl lg:text-7xl font-bold text-pink-600 mb-6 md:mb-8 break-words">
              {wonPrize}
            </p>
          </div>
        </div>
      )}

      {/* Pointer Hint */}
      {showHint && (
        <div className="fixed bottom-[30%] left-1/2 transform -translate-x-1/2 z-50 bg-yellow-200 text-green-800 border-2 border-yellow-400 px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-bounce text-sm md:text-xl font-semibold">
          <FaHandPointer className="text-2xl md:text-3xl animate-pulse" />
          Click to win
        </div>
      )}
    </div>
  );
}

export default InsigniaSpin;
