import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View } from 'react-native';
import { Phase, Player } from '../game/types';
import { styles } from '../styles/appStyles';

type GameScreenProps = {
  phase: Phase;
  currentPlayerName: string;
  currentCategory: string;
  currentLetter: string;
  turnDurationSeconds: number;
  shotIndex: number;
  chambers: boolean[];
  players: Player[];
  currentPlayerIndex: number;
  chambersPerRound: number;
  rewardPlayerName: string;
  roundMessage: string;
  loserText: string;
  failedPlayerNames: string[];
  pengTrigger: number;
  onResetGame: () => void;
  onMarkAnswerCorrect: () => void;
  onMarkAnswerWrong: () => void;
  onAssignShotToPlayer: (targetPlayerId: string) => void;
  onContinueAfterRoundResult: () => void;
};

export function GameScreen({
  phase,
  currentPlayerName,
  currentCategory,
  currentLetter,
  turnDurationSeconds,
  shotIndex,
  chambers,
  players,
  currentPlayerIndex,
  chambersPerRound,
  rewardPlayerName,
  roundMessage,
  loserText,
  failedPlayerNames,
  pengTrigger,
  onResetGame,
  onMarkAnswerCorrect,
  onMarkAnswerWrong,
  onAssignShotToPlayer,
  onContinueAfterRoundResult,
}: GameScreenProps) {
  const circleLeft = 25;
  const circleTop = 16;
  const circleSize = 120;
  const localCenterX = circleSize / 2;
  const localCenterY = circleSize / 2;
  const centerAbsX = circleLeft + localCenterX;
  const centerAbsY = circleTop + localCenterY;
  const radius = 46;
  const slotSize = 22;

  const spinAngle = useRef(new Animated.Value(0)).current;
  const spinAngleValue = useRef(0);
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const pengOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (phase !== 'playing') {
      spinAngle.stopAnimation();
      return;
    }

    // Keep spinning forward, but always land with the active chamber on top.
    spinAngle.stopAnimation((current) => {
      spinAngleValue.current = current;
    });

    const currentMod = ((spinAngleValue.current % 360) + 360) % 360;
    const desiredMod = ((360 - ((shotIndex * 360) / chambers.length)) + 360) % 360;
    const alignDelta = (desiredMod - currentMod + 360) % 360;
    const nextTarget = spinAngleValue.current + 1080 + alignDelta;

    Animated.timing(spinAngle, {
      toValue: nextTarget,
      duration: turnDurationSeconds * 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      spinAngleValue.current = nextTarget;
    });
  }, [phase, shotIndex, currentPlayerIndex, turnDurationSeconds, spinAngle]);

  useEffect(() => {
    if (pengTrigger <= 0) {
      return;
    }

    Animated.parallel([
      Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 0.7,
          duration: 70,
          useNativeDriver: true,
        }),
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(shakeX, { toValue: -10, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 10, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: -8, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 8, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeX, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(pengOpacity, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.delay(800),
        Animated.timing(pengOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]),
    ]).start();
  }, [pengTrigger, flashOpacity, shakeX, pengOpacity]);

  const cylinderRotation = spinAngle.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.content, { transform: [{ translateX: shakeX }] }]}>
      <Animated.View style={[styles.pengFlashOverlay, { opacity: flashOpacity }]} pointerEvents="none" />
      <Animated.Text style={[styles.pengText, { opacity: pengOpacity }]} pointerEvents="none">
        PENG!
      </Animated.Text>
      <Animated.Text style={[styles.smokeText, { opacity: pengOpacity }]} pointerEvents="none">
        💨
      </Animated.Text>

      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={onResetGame}>
          <Text style={styles.backButtonText}>Spiel zuruecksetzen</Text>
        </TouchableOpacity>
        <Text style={styles.roundInfo}>6 Schuss - 1 Sieger</Text>
      </View>

      <View style={styles.currentPlayerCard}>
        <Text style={styles.currentPlayerLabel}>Aktiver Spieler</Text>
        <Text style={styles.currentPlayerName}>{currentPlayerName}</Text>
        <Text style={styles.currentPlayerLabel}>Schuss {shotIndex + 1}/{chambersPerRound}</Text>
      </View>

      <View style={styles.revolverCard}>
        <Text style={styles.revolverTitle}>Zylinder (dreht und wird langsamer)</Text>
        <View style={styles.revolverBody}>
          <View style={[styles.chamberCircleBase, { left: circleLeft, top: circleTop }]} />

          <Animated.View
            style={[
              styles.chamberSpinLayer,
              {
                left: circleLeft,
                top: circleTop,
                width: circleSize,
                height: circleSize,
                transform: [{ rotate: cylinderRotation }],
              },
            ]}
          >
            <View style={styles.cylinderMarkPrimary} />
            {chambers.map((isFull, index) => {
              const angle = (Math.PI * 2 * index) / chambers.length - Math.PI / 2;
              const left = localCenterX + radius * Math.cos(angle) - slotSize / 2;
              const top = localCenterY + radius * Math.sin(angle) - slotSize / 2;

              return (
                <View
                  key={index}
                  style={[
                    styles.chamberDot,
                    isFull ? styles.chamberDotLoaded : styles.chamberDotSpent,
                    { left, top },
                  ]}
                >
                  {isFull && <View style={styles.chamberBulletCore} />}
                </View>
              );
            })}
          </Animated.View>

          <View
            style={[styles.revolverCenter, { left: centerAbsX - 10, top: centerAbsY - 10 }]}
          />
          <View style={styles.activePointerWrap}>
            <Text style={styles.activePointerText}>▲</Text>
          </View>
          <Text style={styles.activePointerName}>Aktive Kammer oben</Text>
        </View>
      </View>

      <View style={styles.questionCard}>
        <Text style={styles.questionLabel}>KATEGORIE (für alle 6 Schuss gleich)</Text>
        <Text style={styles.questionValue}>{currentCategory}</Text>
        <Text style={styles.questionPrompt}>Nenne etwas mit {currentLetter}</Text>
      </View>

      {phase === 'playing' && (
        <View style={styles.answerRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.correctButton]}
            onPress={onMarkAnswerCorrect}
            activeOpacity={0.85}
          >
            <Text style={styles.actionButtonText}>FERTIG</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.explosionButton]}
            onPress={onMarkAnswerWrong}
            activeOpacity={0.85}
          >
            <Text style={styles.actionButtonText}>FALSCH</Text>
          </TouchableOpacity>
        </View>
      )}

      {phase === 'reward' && (
        <View style={styles.rewardCard}>
          <Text style={styles.rewardTitle}>Volltreffer! {rewardPlayerName} hat 6/6 getroffen.</Text>
          <Text style={styles.rewardText}>Wen willst du zum Shot bestimmen?</Text>
          {players
            .filter((player) => player.name !== rewardPlayerName)
            .map((player) => (
              <TouchableOpacity
                key={player.id}
                style={styles.rewardTargetButton}
                onPress={() => onAssignShotToPlayer(player.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.rewardTargetText}>{player.name}</Text>
              </TouchableOpacity>
            ))}
        </View>
      )}

      {phase === 'result' && (
        <View style={styles.scoreboardCard}>
          <Text style={styles.scoreboardTitle}>Runden-Ergebnis</Text>
          <Text style={styles.resultMessageText}>{roundMessage}</Text>
          <Text style={styles.leaderText}>{loserText}</Text>

          {failedPlayerNames.length > 0 && (
            <Text style={styles.resultSubText}>Leere Kammern bei: {failedPlayerNames.join(', ')}</Text>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButtonMini]}
            onPress={onContinueAfterRoundResult}
            activeOpacity={0.85}
          >
            <Text style={styles.actionButtonText}>Naechste Runde</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}
