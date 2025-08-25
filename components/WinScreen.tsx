
import React from 'react';

interface WinScreenProps {
  legacy: string;
  onRestart: () => void;
  isLoadingLegacy: boolean;
}

const WinScreen: React.FC<WinScreenProps> = ({ legacy, onRestart, isLoadingLegacy }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-yellow-900 bg-opacity-50 border-2 border-yellow-400 rounded-lg shadow-2xl max-w-2xl w-full p-8 text-center text-white animate-fade-in-up">
        <h2 className="text-5xl font-bold text-yellow-300 font-serif mb-4">
          Victory!
        </h2>
        <p className="text-xl text-yellow-100 mb-6">You have successfully led Indonesia into a golden age!</p>
        
        <div className="text-left bg-gray-800 bg-opacity-40 p-4 rounded-md min-h-[100px]">
            <h3 className="text-lg font-semibold mb-2 text-gray-300 font-serif">Your Historical Legacy:</h3>
            {isLoadingLegacy ? (
                <p className="text-gray-400 italic animate-pulse">The historians are immortalizing your triumphs...</p>
            ) : (
                <p className="text-gray-200 italic">"{legacy}"</p>
            )}
        </div>
        
        <button
          onClick={onRestart}
          className="mt-8 bg-yellow-400 text-yellow-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-300 transition duration-300 text-lg"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default WinScreen;