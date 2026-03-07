import { useEffect, useMemo, useState } from 'react';
import {
  CHAMBERS_PER_ROUND,
  MAX_PLAYERS,
  MIN_PLAYERS,
  ROUND_TIME_MAX_SECONDS,
  ROUND_TIME_MIN_SECONDS,
} from './constants';
import { getRandomCategory, getRandomLetter } from './utils';
import { GameMode, Phase, Player } from './types';

const pickRandomIndex = (totalPlayers: number) => Math.floor(Math.random() * totalPlayers);

const nextPlayerIndex = (currentIndex: number, totalPlayers: number) =>
  (currentIndex + 1) % totalPlayers;

const getRandomTurnDuration = () =>
  Math.floor(Math.random() * (ROUND_TIME_MAX_SECONDS - ROUND_TIME_MIN_SECONDS + 1)) +
  ROUND_TIME_MIN_SECONDS;

export function useShotclockGame() {
  const [currentMode, setCurrentMode] = useState<GameMode>('menu');
  const [phase, setPhase] = useState<Phase>('playing');

  const [currentCategory, setCurrentCategory] = useState(getRandomCategory);
  const [currentLetter, setCurrentLetter] = useState(getRandomLetter);

  const [turnDurationSeconds, setTurnDurationSeconds] = useState(getRandomTurnDuration);
  const [timeLeft, setTimeLeft] = useState(turnDurationSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [setupMessage, setSetupMessage] = useState('');

  const [shotIndex, setShotIndex] = useState(0);
  const [chambers, setChambers] = useState<boolean[]>(
    Array(CHAMBERS_PER_ROUND).fill(true)
  );
  const [shotOwnerIds, setShotOwnerIds] = useState<(string | null)[]>(
    Array(CHAMBERS_PER_ROUND).fill(null)
  );

  const [rewardPlayerId, setRewardPlayerId] = useState<string | null>(null);
  const [roundMessage, setRoundMessage] = useState('');
  const [failedPlayerIds, setFailedPlayerIds] = useState<string[]>([]);
  const [pengTrigger, setPengTrigger] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isTimerRunning && phase === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, phase, timeLeft]);

  useEffect(() => {
    if (phase !== 'playing' || !isTimerRunning || timeLeft > 0) {
      return;
    }

    resolveShot(false, 'Timeout: Kammer leer.');
  }, [phase, isTimerRunning, timeLeft]);

  const currentPlayer = players[currentPlayerIndex];

  const rewardPlayer = useMemo(
    () => players.find((player) => player.id === rewardPlayerId) ?? null,
    [players, rewardPlayerId]
  );

  const failedPlayerNames = useMemo(
    () =>
      failedPlayerIds
        .map((id) => players.find((player) => player.id === id)?.name)
        .filter((name): name is string => Boolean(name)),
    [failedPlayerIds, players]
  );

  const loserText = useMemo(() => {
    if (failedPlayerNames.length === 0) {
      return 'Keine Fehlschuesse in dieser Runde.';
    }

    return `Trinken: ${failedPlayerNames.join(', ')}`;
  }, [failedPlayerNames]);

  const startRound = (starterIndex: number) => {
    const duration = getRandomTurnDuration();

    setCurrentPlayerIndex(starterIndex);
    setCurrentCategory(getRandomCategory());
    setCurrentLetter(getRandomLetter());
    setTurnDurationSeconds(duration);
    setTimeLeft(duration);
    setShotIndex(0);
    setChambers(Array(CHAMBERS_PER_ROUND).fill(true));
    setShotOwnerIds(Array(CHAMBERS_PER_ROUND).fill(null));
    setPhase('playing');
    setRewardPlayerId(null);
    setRoundMessage('');
    setFailedPlayerIds([]);
    setIsTimerRunning(true);
    setCurrentMode('game');
  };

  const resolveShot = (isCorrect: boolean, customMessage?: string) => {
    if (phase !== 'playing' || !currentPlayer) {
      return;
    }

    setIsTimerRunning(false);

    const nextChambers = chambers.map((value, index) =>
      index === shotIndex ? isCorrect : value
    );
    const nextShotOwners = shotOwnerIds.map((value, index) =>
      index === shotIndex ? currentPlayer.id : value
    );

    setChambers(nextChambers);
    setShotOwnerIds(nextShotOwners);

    if (!isCorrect) {
      setPengTrigger((prev) => prev + 1);
    }

    setPlayers((prev) =>
      prev.map((player, index) => {
        if (index !== currentPlayerIndex) {
          return player;
        }

        return {
          ...player,
          totalHits: player.totalHits + (isCorrect ? 1 : 0),
          totalMisses: player.totalMisses + (isCorrect ? 0 : 1),
        };
      })
    );

    if (shotIndex === CHAMBERS_PER_ROUND - 1) {
      const allFull = nextChambers.every(Boolean);

      if (allFull) {
        setRewardPlayerId(currentPlayer.id);
        setRoundMessage(`${currentPlayer.name} hat 6/6 getroffen. Volltreffer!`);
        setPhase('reward');
        return;
      }

      const failedIds = Array.from(
        new Set(
          nextChambers
            .map((isFull, index) => (!isFull ? nextShotOwners[index] : null))
            .filter((id): id is string => Boolean(id))
        )
      );

      setFailedPlayerIds(failedIds);
      setRoundMessage(customMessage ?? 'Mindestens eine Kammer ist leer.');
      setPhase('result');
      return;
    }

    const nextIndex = nextPlayerIndex(currentPlayerIndex, players.length);
    const nextDuration = getRandomTurnDuration();

    setCurrentPlayerIndex(nextIndex);
    setShotIndex((prev) => prev + 1);
    setCurrentLetter(getRandomLetter());
    setTurnDurationSeconds(nextDuration);
    setTimeLeft(nextDuration);
    setIsTimerRunning(true);
  };

  const markAnswerCorrect = () => resolveShot(true);

  const markAnswerWrong = () => resolveShot(false, 'Falsch: Kammer leer.');

  const assignShotToPlayer = (targetPlayerId: string) => {
    if (phase !== 'reward' || !rewardPlayerId) {
      return;
    }

    const targetName = players.find((player) => player.id === targetPlayerId)?.name;

    setPlayers((prev) =>
      prev.map((player) =>
        player.id === rewardPlayerId
          ? { ...player, drinksGiven: player.drinksGiven + 1 }
          : player
      )
    );

    setRoundMessage(
      `${rewardPlayer?.name ?? 'Spieler'} verteilt den Shot an ${targetName ?? 'jemanden'}.`
    );
    setPhase('result');
  };

  const openSetup = () => setCurrentMode('setup');

  const backToMenu = () => {
    setIsTimerRunning(false);
    setCurrentMode('menu');
  };

  const startGameFromSetup = () => {
    if (players.length < MIN_PLAYERS || players.length > MAX_PLAYERS) {
      setSetupMessage(`Es muessen ${MIN_PLAYERS} bis ${MAX_PLAYERS} Spieler teilnehmen.`);
      return;
    }

    setSetupMessage('');
    startRound(pickRandomIndex(players.length));
  };

  const addPlayer = () => {
    const trimmed = newPlayerName.trim();

    if (!trimmed) {
      return;
    }

    if (players.length >= MAX_PLAYERS) {
      setSetupMessage(`Maximal ${MAX_PLAYERS} Spieler erlaubt.`);
      return;
    }

    const exists = players.some(
      (player) => player.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      setSetupMessage('Name bereits vorhanden.');
      return;
    }

    setPlayers((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${trimmed.toLowerCase()}`,
        name: trimmed,
        totalHits: 0,
        totalMisses: 0,
        drinksGiven: 0,
      },
    ]);
    setNewPlayerName('');
    setSetupMessage('');
  };

  const removePlayer = (id: string) => {
    setPlayers((prev) => prev.filter((player) => player.id !== id));
    setCurrentPlayerIndex(0);
    setSetupMessage('');
  };

  const startNextRound = () => {
    startRound(pickRandomIndex(players.length));
  };

  const continueAfterRoundResult = () => {
    if (players.length < MIN_PLAYERS) {
      setCurrentMode('setup');
      return;
    }

    startNextRound();
  };

  const resetGame = () => {
    setPlayers((prev) =>
      prev.map((player) => ({
        ...player,
        totalHits: 0,
        totalMisses: 0,
        drinksGiven: 0,
      }))
    );
    setCurrentPlayerIndex(0);
    const duration = getRandomTurnDuration();
    setTurnDurationSeconds(duration);
    setTimeLeft(duration);
    setShotIndex(0);
    setChambers(Array(CHAMBERS_PER_ROUND).fill(true));
    setShotOwnerIds(Array(CHAMBERS_PER_ROUND).fill(null));
    setPhase('playing');
    setIsTimerRunning(false);
    setRewardPlayerId(null);
    setRoundMessage('');
    setFailedPlayerIds([]);
    setCurrentMode('setup');
  };

  return {
    state: {
      currentMode,
      phase,
      currentCategory,
      currentLetter,
      timeLeft,
      turnDurationSeconds,
      shotIndex,
      chambers,
      players,
      currentPlayer,
      currentPlayerIndex,
      rewardPlayer,
      newPlayerName,
      setupMessage,
      roundMessage,
      failedPlayerNames,
      loserText,
      pengTrigger,
      canStartGame: players.length >= MIN_PLAYERS && players.length <= MAX_PLAYERS,
      minPlayers: MIN_PLAYERS,
      maxPlayers: MAX_PLAYERS,
      chambersPerRound: CHAMBERS_PER_ROUND,
    },
    actions: {
      openSetup,
      backToMenu,
      startGameFromSetup,
      addPlayer,
      removePlayer,
      setNewPlayerName,
      markAnswerCorrect,
      markAnswerWrong,
      assignShotToPlayer,
      continueAfterRoundResult,
      resetGame,
    },
  };
}
