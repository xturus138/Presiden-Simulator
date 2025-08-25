import React from 'react';
import { LogEntry } from '../types';

interface LogPanelProps {
  log: LogEntry[];
}

const LogPanel: React.FC<LogPanelProps> = ({ log }) => {
  return (
    <div className="bg-gray-900 bg-opacity-70 p-4 rounded-lg shadow-xl h-full max-h-[75vh] overflow-y-auto backdrop-blur-sm border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 font-serif text-white sticky top-0 bg-gray-900 bg-opacity-80 py-2 z-10">Presidential Log</h2>
      <div className="space-y-4">
        {log.length === 0 ? (
          <p className="text-gray-400">Your presidential record is clean. Make your first decision.</p>
        ) : (
          log.map((entry) => (
            <div key={entry.turn} className="bg-gray-800 bg-opacity-50 p-3 rounded-md border-l-4 border-red-500">
               <p className="text-sm font-semibold text-red-400">📰 BREAKING NEWS <span className="text-xs text-gray-400 ml-2">| Year {Math.floor(entry.year)}</span></p>
              <h4 className="font-bold mt-1 text-lg font-serif text-white">{entry.headline}</h4>
               <p className="text-sm text-gray-300 mt-2">{entry.outcome}</p>
              <p className="text-xs text-yellow-400 mt-2 font-mono">{entry.statChanges}</p>
              <details className="mt-1 text-xs">
                <summary className="cursor-pointer text-gray-500">Show Original Policy</summary>
                <p className="text-gray-400 italic mt-1 pl-2 border-l-2 border-gray-600">{entry.policy}</p>
              </details>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LogPanel;