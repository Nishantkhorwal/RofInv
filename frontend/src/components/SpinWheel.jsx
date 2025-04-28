import { useState } from "react";
import confetti from "canvas-confetti";
import { FaTrophy,  FaAward } from "react-icons/fa"; 

const prizes = [
  "Apple I-Pad",
  "Smart Phone",
  "LED TV",
  "Apple Watch",
  "30:70 Payment Plan",
];

const SpinWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState(null);

  const handleSpin = () => {
    if (spinning) return;

    const extraRounds = 5 * 360; // spin 5 times
    const randomAngle = Math.floor(Math.random() * 360);
    const finalRotation = extraRounds + randomAngle;

    setRotation(prev => prev + finalRotation);
    setSpinning(true);

    setTimeout(() => {
      setSpinning(false);
      const actualDegree = (rotation + randomAngle) % 360;
      const prizeIndex = Math.floor(actualDegree / (360 / prizes.length));
      const prize = prizes[prizes.length - 1 - prizeIndex]; // reverse because rotation is clockwise
      fireConfetti();
      setTimeout(() => {
        setWonPrize(prize); // instead of alert
      }, 500);
      
    }, 4000); // same as transition duration
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.4 },
    });
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center  relative">
      <div className="relative w-[100%] h-[100%] lg:w-[55%] lg:h-[55%]">
        {/* Pointer */}
        <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-16 border-b-red-500 z-10" />

        {/* Wheel */}
        <div
          className="w-full h-full "
          
        >
          <img
            style={{
                transform: `rotate(${rotation}deg)`
            }}
            onClick={handleSpin}
            src="/wheel5.png"
            alt="Wheel"
            className="w-full h-full cursor-pointer rounded-full overflow-hidden transition-transform duration-[4s] ease-out"
          />
        </div>
      </div>

      {/* 🎉 Winning Popup */}
      {wonPrize && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-gradient-to-br from-yellow-100 via-white to-yellow-100 border-8 border-yellow-400 rounded-3xl shadow-2xl p-10 text-center animate-pulse max-w-[90%] w-[500px]">
      
      {/* Icon-based Congratulations */}
      <h2 className="text-3xl lg:text-5xl font-extrabold text-green-600 mb-6 flex flex-col items-center gap-2 animate-bounce">
        <div className="flex gap-4 text-yellow-500 text-6xl">
          <FaTrophy />
          
          <FaAward />
        </div>
        Congratulations!
      </h2>

      <p className="text-3xl text-pink-600 font-semibold mb-4">
        You've Won
      </p>

      {/* Prize */}
      <p className="text-5xl lg:text-8xl font-bold text-pink-600 mb-8">
        {wonPrize}
      </p>

      {/* Button */}
      <button
        onClick={handleReset}
        className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-10 py-4 rounded-full font-bold text-2xl transition-transform transform hover:scale-105 shadow-lg"
      >
        Claim Prize
      </button>

    </div>
  </div>
)}

    </div>
  );
};

export default SpinWheel;
