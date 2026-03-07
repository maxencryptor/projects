import React, { useEffect, useState } from 'react';
import { Animated, StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { GameScreen } from './src/components/GameScreen';
import { MenuScreen } from './src/components/MenuScreen';
import { SetupScreen } from './src/components/SetupScreen';
import { useShotclockGame } from './src/game/useShotclockGame';
import { styles } from './src/styles/appStyles';

export default function App() {
  const { state, actions } = useShotclockGame();
  const glowAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1600,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [glowAnim]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 1],
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" />
        <View style={styles.backgroundGlowTop} />
        <View style={styles.backgroundGlowBottom} />

        {state.currentMode === 'menu' && (
          <MenuScreen glowOpacity={glowOpacity} onOpenSetup={actions.openSetup} />
        )}

        {state.currentMode === 'setup' && (
          <SetupScreen
            players={state.players}
            newPlayerName={state.newPlayerName}
            setupMessage={state.setupMessage}
            canStartGame={state.canStartGame}
            minPlayers={state.minPlayers}
            maxPlayers={state.maxPlayers}
            onBackToMenu={actions.backToMenu}
            onSetNewPlayerName={actions.setNewPlayerName}
            onAddPlayer={actions.addPlayer}
            onRemovePlayer={actions.removePlayer}
            onStartGame={actions.startGameFromSetup}
          />
        )}

        {state.currentMode === 'game' && (
          <GameScreen
            phase={state.phase}
            currentPlayerName={state.currentPlayer?.name ?? '-'}
            currentCategory={state.currentCategory}
            currentLetter={state.currentLetter}
            turnDurationSeconds={state.turnDurationSeconds}
            shotIndex={state.shotIndex}
            chambers={state.chambers}
            players={state.players}
            currentPlayerIndex={state.currentPlayerIndex}
            chambersPerRound={state.chambersPerRound}
            rewardPlayerName={state.rewardPlayer?.name ?? ''}
            roundMessage={state.roundMessage}
            loserText={state.loserText}
            failedPlayerNames={state.failedPlayerNames}
            pengTrigger={state.pengTrigger}
            onResetGame={actions.resetGame}
            onMarkAnswerCorrect={actions.markAnswerCorrect}
            onMarkAnswerWrong={actions.markAnswerWrong}
            onAssignShotToPlayer={actions.assignShotToPlayer}
            onContinueAfterRoundResult={actions.continueAfterRoundResult}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
