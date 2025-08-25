
import React from 'react';

interface GameHeaderProps {
  year: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ year }) => {
  const term = year < 2029 ? 1 : 2;
  return (
    <header className="text-center bg-black bg-opacity-30 p-4 rounded-lg shadow-lg">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-red-500 tracking-wider">
        President Simulator Indonesia
      </h1>
      <p className="text-lg sm:text-xl text-gray-300 mt-2">
        Year: {Math.floor(year)} | Term: {term}
      </p>
    </header>
  );
};

export default GameHeader;