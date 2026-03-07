import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef } from 'react';

export function useGameSounds() {
  const clickSound = useAudioPlayer(require('../../assets/sounds/revolver_spin.wav'));
  const finalCockingSound = useAudioPlayer(
    require('../../assets/sounds/reload_real.wav')
  );
  const pengSound = useAudioPlayer(require('../../assets/sounds/peng_real.wav'));
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) {
      return;
    }

    didInit.current = true;

    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
    }).catch(() => {
      // Sound effects are optional; ignore mode failures.
    });

    clickSound.volume = 0.6;
    finalCockingSound.volume = 0.35;
    pengSound.volume = 0.4;
  }, [clickSound, finalCockingSound, pengSound]);

  const restartAndPlay = useCallback((player: ReturnType<typeof useAudioPlayer>) => {
    try {
      player
        .seekTo(0)
        .then(() => {
          player.play();
        })
        .catch(() => {
          player.play();
        });
    } catch {
      // Ignore playback errors to avoid interrupting gameplay.
    }
  }, []);

  const playClick = useCallback(() => {
    restartAndPlay(clickSound);
  }, [clickSound, restartAndPlay]);

  const playPeng = useCallback(() => {
    restartAndPlay(pengSound);
  }, [pengSound, restartAndPlay]);

  const playFinalCocking = useCallback(() => {
    restartAndPlay(finalCockingSound);
  }, [finalCockingSound, restartAndPlay]);

  return { playClick, playFinalCocking, playPeng };
}
