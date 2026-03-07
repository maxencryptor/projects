import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Player } from '../game/types';
import { styles } from '../styles/appStyles';

type GameScreenProps = {
  currentPlayerName: string;
  currentCategory: string;
  timeLeft: number;
  roundExploded: boolean;
  players: Player[];
  leaderText: string;
  onResetGame: () => void;
  onPlayerAnswered: () => void;
  onContinueAfterExplosion: () => void;
};

export function GameScreen({
  currentPlayerName,
  currentCategory,
  timeLeft,
  roundExploded,
  players,
  leaderText,
  onResetGame,
  onPlayerAnswered,
  onContinueAfterExplosion,
}: GameScreenProps) {
  return (
    <View style={styles.content}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={onResetGame}>
          <Text style={styles.backButtonText}>Spiel zurucksetzen</Text>
        </TouchableOpacity>
        <Text style={styles.roundInfo}>Kategorie Sprint</Text>
      </View>

      <View style={styles.currentPlayerCard}>
        <Text style={styles.currentPlayerLabel}>Aktueller Zug</Text>
        <Text style={styles.currentPlayerName}>{currentPlayerName}</Text>
      </View>

      <View style={styles.timerContainer}>
        <View
          style={[
            styles.timerCircle,
            timeLeft <= 3 && !roundExploded && {
              borderColor: Colors.danger,
              shadowColor: Colors.danger,
            },
          ]}
        >
          <Text style={[styles.timerText, timeLeft <= 3 && !roundExploded && { color: Colors.danger }]}>
            {timeLeft}
          </Text>
        </View>
        <Text style={styles.timerLabel}>SEKUNDEN</Text>
      </View>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>KATEGORIE</Text>
          <Text style={styles.cardText}>{currentCategory}</Text>
        </View>
      </View>

      {roundExploded ? (
        <TouchableOpacity
          style={[styles.actionButton, styles.explosionButton]}
          onPress={onContinueAfterExplosion}
          activeOpacity={0.85}
        >
          <Text style={styles.actionButtonText}>Bombe explodiert bei {currentPlayerName} - Weiter</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.actionButton} onPress={onPlayerAnswered} activeOpacity={0.85}>
          <Text style={styles.actionButtonText}>Ich habe geantwortet</Text>
        </TouchableOpacity>
      )}

      <View style={styles.scoreboardCard}>
        <Text style={styles.scoreboardTitle}>Strafpunkte</Text>
        {players.map((player) => (
          <View key={player.id} style={styles.scoreRow}>
            <Text style={styles.scoreName}>{player.name}</Text>
            <Text style={styles.scoreValue}>{player.penalties}</Text>
          </View>
        ))}
        <Text style={styles.leaderText}>{leaderText}</Text>
      </View>
    </View>
  );
}
