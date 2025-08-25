import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, GameStatus, Stat, LogEntry, CrisisEvent } from './types';
import { INITIAL_GAME_STATE, STAT_DEFINITIONS, CRISIS_EVENTS, WIN_YEAR, MAX_YEAR } from './constants';
import { evaluatePolicy, generateEndGameLegacy } from './services/geminiService';
import StatsDashboard from './components/StatsDashboard';
import LogPanel from './components/LogPanel';
import InputArea from './components/InputArea';
import EventModal from './components/EventModal';
import GameOverScreen from './components/GameOverScreen';
import WinScreen from './components/WinScreen';
import GameHeader from './components/GameHeader';

const Backgrounds: Record<GameStatus, string> = {
  playing: 'https://images.unsplash.com/photo-1588294312198-935d21b9f71c?q=80&w=1920&h=1080&fit=crop&auto=format',
  crisis: 'https://images.unsplash.com/photo-1599599810624-94e43e1d13f9?q=80&w=1920&h=1080&fit=crop&auto=format',
  gameover: 'https://images.unsplash.com/photo-1618193237586-9a08a4c1472e?q=80&w=1920&h=1080&fit=crop&auto=format',
  win: 'https://images.unsplash.com/photo-1533587883251-5a63ab539258?q=80&w=1920&h=1080&fit=crop&auto=format',
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [endGameLegacy, setEndGameLegacy] = useState<string>('');

  const audioRefs = {
    neutral: useRef<HTMLAudioElement>(null),
    crisis: useRef<HTMLAudioElement>(null),
    win: useRef<HTMLAudioElement>(null),
    lose: useRef<HTMLAudioElement>(null),
    stamp: useRef<HTMLAudioElement>(null),
    statUp: useRef<HTMLAudioElement>(null),
    statDown: useRef<HTMLAudioElement>(null),
    crisisAlert: useRef<HTMLAudioElement>(null),
  };

  const stopAllAudio = useCallback(() => {
    Object.values(audioRefs).forEach(ref => {
      if (ref.current && ref.current.duration > 5) { // Only stop long-playing music
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
  }, [audioRefs]);
  
  const prevStatus = useRef(gameState.status);
  useEffect(() => {
    if (prevStatus.current !== gameState.status) {
        stopAllAudio();
        let audioToPlay: React.RefObject<HTMLAudioElement> | null = null;
        switch (gameState.status) {
          case 'playing':
            audioToPlay = audioRefs.neutral;
            break;
          case 'crisis':
            audioToPlay = audioRefs.crisis;
            if(prevStatus.current !== 'crisis') audioRefs.crisisAlert.current?.play();
            break;
          case 'win':
            audioToPlay = audioRefs.win;
            break;
          case 'gameover':
            audioToPlay = audioRefs.lose;
            break;
        }
        if (audioToPlay?.current) {
            audioToPlay.current.loop = true;
            audioToPlay.current.volume = 0.5;
            audioToPlay.current.play().catch(e => console.error("Audio play failed:", e));
        }
        prevStatus.current = gameState.status;
    }
  }, [gameState.status, stopAllAudio, audioRefs]);

  const prevLogLength = useRef(gameState.log.length);
  useEffect(() => {
    if (gameState.log.length > 0 && gameState.log.length > prevLogLength.current) {
        const lastEntry = gameState.log[0];
        const changes = lastEntry.statChanges.match(/([+-]\d+)/g) || [];
        const totalChange = changes.reduce((sum, change) => sum + parseInt(change, 10), 0);
        
        if (totalChange > 0) {
            setTimeout(() => audioRefs.statUp.current?.play(), 500);
        } else if (totalChange < 0) {
            setTimeout(() => audioRefs.statDown.current?.play(), 500);
        }
    }
    prevLogLength.current = gameState.log.length;
  }, [gameState.log, audioRefs]);


  const checkEndConditions = useCallback((newState: GameState): { status: 'win' | 'gameover', reason: string } | null => {
    if (newState.stats.politics < 20) {
      return { status: 'gameover', reason: 'Forced to resign due to extremely low public support.' };
    }
    if (newState.stats.economy < 10) {
      return { status: 'gameover', reason: 'The nation declared bankruptcy under your leadership.' };
    }
    if (newState.year >= WIN_YEAR && newState.stats.economy > 80 && newState.stats.social > 80 && newState.stats.politics > 70) {
      return { status: 'win', reason: 'You have successfully guided Indonesia into its golden age, achieving the 2045 vision.' };
    }
    if (newState.year >= MAX_YEAR) {
        return { status: 'gameover', reason: 'Your two terms are over. The nation moves on.' };
    }
    return null;
  }, []);
  
  const handlePolicySubmit = useCallback(async (policy: string) => {
    setIsLoading(true);
    setError(null);
    audioRefs.stamp.current?.play();

    const isCrisisResponse = gameState.status === 'crisis';

    try {
      const result = await evaluatePolicy(policy, gameState, isCrisisResponse);
      
      setGameState(prevState => {
        const newStats: Record<Stat, number> = { ...prevState.stats };
        const statChangesText: string[] = [];

        for (const key in result.statChanges) {
          const statKey = key as Stat;
          if (statKey in newStats) { // Ensure the key is a valid stat
            // Coerce potential string value from API to a number to prevent type errors
            const change = Number(result.statChanges[statKey]) || 0;
            
            newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + change));
            
            if (change !== 0) {
              statChangesText.push(`${STAT_DEFINITIONS[statKey].label} ${change > 0 ? '+' : ''}${change}`);
            }
          }
        }
        
        const newLogEntry: LogEntry = {
          turn: prevState.log.length + 1,
          year: prevState.year,
          policy: isCrisisResponse ? `(Crisis Response) ${policy}` : policy,
          outcome: result.narrative,
          headline: result.headline,
          statChanges: statChangesText.join(', '),
        };

        const newYear = prevState.year + 0.5;

        let newState: GameState = {
          ...prevState,
          stats: newStats,
          year: newYear,
          log: [newLogEntry, ...prevState.log],
          currentEvent: null,
          status: 'playing',
        };

        if (result.isGameOver) {
          newState.status = 'gameover';
          newState.gameOverReason = result.gameOverReason;
        } else {
            const endCondition = checkEndConditions(newState);
            if (endCondition) {
                newState.status = endCondition.status;
                newState.gameOverReason = endCondition.reason;
            }
        }
        
        // Trigger a new crisis?
        if (newState.status === 'playing' && Math.random() < 0.25) { // 25% chance of crisis each turn
            const crisis = CRISIS_EVENTS[Math.floor(Math.random() * CRISIS_EVENTS.length)];
            newState.status = 'crisis';
            newState.currentEvent = crisis;
        }

        return newState;
      });

    } catch (e) {
      console.error(e);
      setError('The presidential advisors are confused by your request. Please try a different approach.');
    } finally {
      setIsLoading(false);
    }
  }, [gameState, checkEndConditions, audioRefs]);

  useEffect(() => {
    if (gameState.status === 'gameover' || gameState.status === 'win') {
      const fetchLegacy = async () => {
        setIsLoading(true);
        const legacyText = await generateEndGameLegacy(gameState.stats, gameState.gameOverReason || 'The term has ended.', gameState.status === 'win');
        setEndGameLegacy(legacyText);
        setIsLoading(false);
      };
      fetchLegacy();
    }
  }, [gameState.status, gameState.stats, gameState.gameOverReason]);
  
  const restartGame = () => {
    setGameState(INITIAL_GAME_STATE);
    setEndGameLegacy('');
    setError(null);
  };

  const backgroundUrl = Backgrounds[gameState.status] || Backgrounds.playing;

  return (
    <>
      <main 
        className="bg-cover bg-center min-h-screen text-white transition-all duration-1000"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      >
        <div className="bg-black bg-opacity-70 min-h-screen p-4 sm:p-6 md:p-8 flex flex-col relative">
          <div className="waving-flag"></div>
          <GameHeader year={gameState.year} />
          
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
            <div className="lg:col-span-3">
              <StatsDashboard stats={gameState.stats} />
            </div>

            <div className="lg:col-span-6 flex flex-col justify-end">
              {gameState.status === 'playing' && <InputArea onSubmit={handlePolicySubmit} isLoading={isLoading} error={error} />}
              {gameState.status === 'crisis' && gameState.currentEvent && <InputArea onSubmit={handlePolicySubmit} isLoading={isLoading} error={error} isCrisis={true}/>}
            </div>
            
            <div className="lg:col-span-3">
              <LogPanel log={gameState.log} />
            </div>
          </div>
        </div>

        {gameState.status === 'crisis' && gameState.currentEvent && (
          <EventModal event={gameState.currentEvent} />
        )}
        
        {gameState.status === 'gameover' && (
          <GameOverScreen reason={gameState.gameOverReason || ''} legacy={endGameLegacy} onRestart={restartGame} isLoadingLegacy={isLoading}/>
        )}

        {gameState.status === 'win' && (
          <WinScreen legacy={endGameLegacy} onRestart={restartGame} isLoadingLegacy={isLoading} />
        )}
      </main>
      {/* Audio elements */}
      <audio ref={audioRefs.neutral} src="https://cdn.pixabay.com/audio/2023/04/24/audio_343999d31a.mp3" preload="auto"></audio>
      <audio ref={audioRefs.crisis} src="https://cdn.pixabay.com/audio/2022/11/22/audio_c3149480d2.mp3" preload="auto"></audio>
      <audio ref={audioRefs.win} src="https://cdn.pixabay.com/audio/2024/02/09/audio_659e928014.mp3" preload="auto"></audio>
      <audio ref={audioRefs.lose} src="https://cdn.pixabay.com/audio/2022/05/13/audio_787a4a2a72.mp3" preload="auto"></audio>
      <audio ref={audioRefs.stamp} src="https://cdn.pixabay.com/audio/2022/03/15/audio_18fd70a597.mp3" preload="auto"></audio>
      <audio ref={audioRefs.statUp} src="https://cdn.pixabay.com/audio/2021/08/04/audio_bb630cc098.mp3" preload="auto"></audio>
      <audio ref={audioRefs.statDown} src="https://cdn.pixabay.com/audio/2022/03/10/audio_c870954b83.mp3" preload="auto"></audio>
      <audio ref={audioRefs.crisisAlert} src="https://cdn.pixabay.com/audio/2022/02/07/audio_f50c704f7a.mp3" preload="auto"></audio>
    </>
  );
}