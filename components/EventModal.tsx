
import React from 'react';
import { CrisisEvent } from '../types';

interface EventModalProps {
  event: CrisisEvent;
}

const EventModal: React.FC<EventModalProps> = ({ event }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg shadow-2xl max-w-lg w-full transform transition-all animate-fade-in-down">
        <div className="p-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-yellow-400 font-serif mb-2">
              CRISIS ALERT
            </h2>
            <img src={event.image} alt={event.title} className="w-full h-48 object-cover rounded-md my-4" />
            <h3 className="text-2xl font-semibold text-white">{event.title}</h3>
            <p className="mt-2 text-gray-300">
              {event.description}
            </p>
            <p className="mt-4 text-yellow-300 font-semibold animate-pulse">
              You must respond. Your next decision will address this crisis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;