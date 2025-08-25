import React, { useState, useEffect, useRef } from 'react';
import { StatDefinition } from '../types';

interface StatIndicatorProps {
  stat: StatDefinition;
  value: number;
}

type ChangeDirection = 'up' | 'down' | 'none';

const StatIndicator: React.FC<StatIndicatorProps> = ({ stat, value }) => {
  const [change, setChange] = useState<ChangeDirection>('none');
  const prevValueRef = useRef(value);
  
  useEffect(() => {
    if (prevValueRef.current < value) {
      setChange('up');
    } else if (prevValueRef.current > value) {
      setChange('down');
    }
    
    const timer = setTimeout(() => {
      setChange('none');
    }, 1500);
    
    prevValueRef.current = value;

    return () => clearTimeout(timer);
  }, [value]);

  const getBarColor = (label: string) => {
    switch (label) {
      case 'Economy': return 'bg-green-500';
      case 'Social Welfare': return 'bg-blue-500';
      case 'Politics & Stability': return 'bg-yellow-500';
      case 'Environment': return 'bg-teal-500';
      case 'Intl. Relations': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };

  const getIconColor = (label: string) => {
     switch (label) {
      case 'Economy': return 'text-green-400';
      case 'Social Welfare': return 'text-blue-400';
      case 'Politics & Stability': return 'text-yellow-400';
      case 'Environment': return 'text-teal-400';
      case 'Intl. Relations': return 'text-indigo-400';
      default: return 'text-gray-400';
    }
  }

  return (
    <div title={stat.description} className="relative">
      <div className="flex items-center justify-between mb-1 text-gray-300">
        <div className={`flex items-center ${getIconColor(stat.label)}`}>
          {stat.icon}
          <span className="font-semibold">{stat.label}</span>
        </div>
        <div className="flex items-center space-x-2">
            {change === 'up' && <span className="text-green-400 animate-fade-out">▲</span>}
            {change === 'down' && <span className="text-red-400 animate-fade-out">▼</span>}
            <span className={`font-bold text-lg text-white transition-transform duration-500 ${change !== 'none' ? 'animate-pulse-quick' : ''}`}>{value}</span>
        </div>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${getBarColor(stat.label)}`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

export default StatIndicator;