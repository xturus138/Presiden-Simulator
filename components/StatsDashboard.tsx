
import React from 'react';
import { GameStats, Stat } from '../types';
import { STAT_DEFINITIONS } from '../constants';
import StatIndicator from './StatIndicator';

interface StatsDashboardProps {
  stats: GameStats;
}

const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  return (
    <div className="bg-gray-900 bg-opacity-70 p-4 rounded-lg shadow-xl h-full backdrop-blur-sm border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 font-serif text-white">National Status</h2>
      <div className="space-y-4">
        {Object.keys(stats).map((key) => {
          const statKey = key as Stat;
          return (
            <StatIndicator
              key={statKey}
              stat={STAT_DEFINITIONS[statKey]}
              value={stats[statKey]}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StatsDashboard;