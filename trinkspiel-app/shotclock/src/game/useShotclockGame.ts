import { useEffect, useMemo, useState } from 'react';
import { MIN_PLAYERS, ROUND_TIME_SECONDS } from './constants';
import { buildRoundCategory } from './utils';
import { GameMode, Player } from './types';

export function useShotclockGame() {
  const [currentMode, setCurrentMode] = useState<GameMode>('menu');
  const [currentCategory, setCurrentCategory] = useState(buildRoundCategory);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_SECONDS);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [roundExploded, setRoundExploded] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [newPlayerName, setNewPlayerName] = useState('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft !== 0 || !isTimerRunning) {
      return;
    }

    setIsTimerRunning(false);
    setRoundExploded(true);

    // Score is updated exactly once when the timer reaches zero, before the next round starts.
    setPlayers((prev) =>
      prev.map((player, index) =>
        index === currentPlayerIndex
          ? { ...player, penalties: player.penalties + 1 }
          : player
      )
    );
  }, [currentPlayerIndex, isTimerRunning, timeLeft]);

  const currentPlayer = players[currentPlayerIndex];

  const leaderText = useMemo(() => {
    const maxPenalties = Math.max(0, ...players.map((player) => player.penalties));

    if (maxPenalties === 0) {
      return 'Noch keine Strafpunkte verteilt';
    }

    const top = players.filter((player) => player.penalties === maxPenalties);

    if (top.length === 1) {
      return `${top[0].name} verliert aktuell (${maxPenalties} Punkt${maxPenalties > 1 ? 'e' : ''})`;
    }

    return `Gleichstand: ${top.map((player) => player.name).join(', ')} mit ${maxPenalties}`;
  }, [players]);

  const moveToNextPlayer = () => {
    if (players.length === 0) {
      return;
    }

    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  const startRound = () => {
    setCurrentCategory(buildRoundCategory());
    setTimeLeft(ROUND_TIME_SECONDS);
    setRoundExploded(false);
    setIsTimerRunning(true);
    setCurrentMode('category-sprint');
  };

  const openSetup = () => setCurrentMode('setup');

  const backToMenu = () => {
    setIsTimerRunning(false);
    setRoundExploded(false);
    setCurrentMode('menu');
  };

  const startGameFromSetup = () => {
    if (players.length < MIN_PLAYERS) {
      return;
    }

    setCurrentPlayerIndex(0);
    startRound();
  };

  const addPlayer = () => {
    const trimmed = newPlayerName.trim();

    if (!trimmed) {
      return;
    }

    // Duplicate names are blocked to keep scoreboard entries unambiguous.
    const exists = players.some(
      (player) => player.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      return;
    }

    setPlayers((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${trimmed.toLowerCase()}`,
        name: trimmed,
        penalties: 0,
      },
    ]);
    setNewPlayerName('');
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
    setCurrentPlayerIndex(0);
  };

  const playerAnswered = () => {
    setIsTimerRunning(false);
    moveToNextPlayer();
    startRound();
  };

  const continueAfterExplosion = () => {
    moveToNextPlayer();
    startRound();
  };

  const resetGame = () => {
    setPlayers((prev) => prev.map((player) => ({ ...player, penalties: 0 })));
    setCurrentPlayerIndex(0);
    setTimeLeft(ROUND_TIME_SECONDS);
    setRoundExploded(false);
    setIsTimerRunning(false);
    setCurrentMode('setup');
  };

  return {
    state: {
      currentMode,
      currentCategory,
      timeLeft,
      roundExploded,
      players,
      currentPlayer,
      newPlayerName,
      leaderText,
      canStartGame: players.length >= MIN_PLAYERS,
    },
    actions: {
      openSetup,
      backToMenu,
      startGameFromSetup,
      addPlayer,
      removePlayer,
      setNewPlayerName,
      playerAnswered,
      continueAfterExplosion,
      resetGame,
    },
  };
}
