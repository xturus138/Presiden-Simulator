
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
  playing: 'https://picsum.photos/seed/office/1920/1080',
  crisis: 'https://picsum.photos/seed/protest/1920/1080',
  gameover: 'https://picsum.photos/seed/darkparliament/1920/1080',
  win: 'https://picsum.photos/seed/celebration/1920/1080',
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
  };

  const stopAllAudio = useCallback(() => {
    Object.values(audioRefs).forEach(ref => {
      if (ref.current) {
        ref.current.pause();
        ref.current.currentTime = 0;
      }
    });
  }, [audioRefs]);

  useEffect(() => {
    stopAllAudio();
    let audioToPlay: React.RefObject<HTMLAudioElement> | null = null;
    switch (gameState.status) {
      case 'playing':
        audioToPlay = audioRefs.neutral;
        break;
      case 'crisis':
        audioToPlay = audioRefs.crisis;
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
        audioToPlay.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [gameState.status, stopAllAudio, audioRefs]);


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

    const isCrisisResponse = gameState.status === 'crisis';

    try {
      const result = await evaluatePolicy(policy, gameState, isCrisisResponse);
      
      setGameState(prevState => {
        const newStats: Record<Stat, number> = { ...prevState.stats };
        let statChangesText = [];

        for (const key in result.statChanges) {
          const statKey = key as Stat;
          const change = result.statChanges[statKey] || 0;
          newStats[statKey] = Math.max(0, Math.min(100, newStats[statKey] + change));
          if (change !== 0) {
            statChangesText.push(`${STAT_DEFINITIONS[statKey].label} ${change > 0 ? '+' : ''}${change}`);
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
  }, [gameState, checkEndConditions]);

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
        <div className="bg-black bg-opacity-70 min-h-screen p-4 sm:p-6 md:p-8 flex flex-col">
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
      <audio ref={audioRefs.neutral} src="https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-audio.mp3" preload="auto"></audio>
      <audio ref={audioRefs.crisis} src="https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3" preload="auto"></audio>
      <audio ref={audioRefs.win} src="https://storage.googleapis.com/framemark-test-assets-825442526322/processed-audio/2160p_4k_uhd/d291463e-55c4-4203-b51f-2b630132334e.mp3" preload="auto"></audio>
      <audio ref={audioRefs.lose} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" preload="auto"></audio>
    </>
  );
}