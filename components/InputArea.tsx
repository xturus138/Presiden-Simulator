import React, { useState } from 'react';

interface InputAreaProps {
  onSubmit: (policy: string) => void;
  isLoading: boolean;
  error: string | null;
  isCrisis?: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({ onSubmit, isLoading, error, isCrisis }) => {
  const [policy, setPolicy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (policy.trim() && !isLoading) {
      onSubmit(policy);
      setPolicy('');
    }
  };
  
  const placeholderText = isCrisis 
    ? "Type your response to the crisis..." 
    : "Type your policy decision... (e.g., 'Invest in renewable energy')";

  return (
    <div className="bg-gray-900 bg-opacity-70 p-4 rounded-lg shadow-xl backdrop-blur-sm border border-gray-700">
      <h3 className="text-xl font-bold mb-2 font-serif">{isCrisis ? "Crisis Response Required" : "Executive Decision"}</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={policy}
          onChange={(e) => setPolicy(e.target.value)}
          placeholder={placeholderText}
          className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-white disabled:opacity-50"
          rows={3}
          disabled={isLoading}
        />
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        <button
          type="submit"
          disabled={isLoading || !policy.trim()}
          className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-red-800 disabled:cursor-not-allowed flex items-center justify-center text-lg hover:shadow-lg hover:shadow-red-500/50 transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Advisors are deliberating...
            </>
          ) : (
            'Enact Policy'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputArea;