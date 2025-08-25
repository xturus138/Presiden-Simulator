
import React from 'react';
import { LogEntry } from '../types';

interface LogPanelProps {
  log: LogEntry[];
}

const LogPanel: React.FC<LogPanelProps> = ({ log }) => {
  return (
    <div className="bg-gray-900 bg-opacity-70 p-4 rounded-lg shadow-xl h-full max-h-[75vh] overflow-y-auto backdrop-blur-sm border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 font-serif text-white sticky top-0 bg-gray-900 bg-opacity-80 py-2">Presidential Log</h2>
      <div className="space-y-4">
        {log.length === 0 ? (
          <p className="text-gray-400">Your presidential record is clean. Make your first decision.</p>
        ) : (
          log.map((entry) => (
            <div key={entry.turn} className="bg-gray-800 bg-opacity-50 p-3 rounded-md border-l-4 border-red-500">
              <p className="text-xs text-gray-400">Year {Math.floor(entry.year)}</p>
              <p className="font-semibold text-red-400">Policy: <span className="text-white">{entry.policy}</span></p>
              <h4 className="font-bold mt-1 text-lg font-serif">{entry.headline}</h4>
              <p className="text-gray-300 italic">"{entry.outcome}"</p>
              <p className="text-xs text-yellow-400 mt-2">{entry.statChanges}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogPanel;