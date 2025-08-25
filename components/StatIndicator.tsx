
import React from 'react';
import { StatDefinition } from '../types';

interface StatIndicatorProps {
  stat: StatDefinition;
  value: number;
}

const StatIndicator: React.FC<StatIndicatorProps> = ({ stat, value }) => {
  const getBarColor = (val: number) => {
    if (val < 30) return 'bg-red-600';
    if (val < 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div title={stat.description}>
      <div className="flex items-center justify-between mb-1 text-gray-300">
        <div className="flex items-center">
          {stat.icon}
          <span className="font-semibold">{stat.label}</span>
        </div>
        <span className="font-bold text-lg">{value}</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${getBarColor(value)}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatIndicator;