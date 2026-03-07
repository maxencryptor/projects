import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Player } from '../game/types';
import { styles } from '../styles/appStyles';

type SetupScreenProps = {
  players: Player[];
  newPlayerName: string;
  setupMessage: string;
  canStartGame: boolean;
  minPlayers: number;
  maxPlayers: number;
  onBackToMenu: () => void;
  onSetNewPlayerName: (name: string) => void;
  onAddPlayer: () => void;
  onRemovePlayer: (id: string) => void;
  onStartGame: () => void;
};

export function SetupScreen({
  players,
  newPlayerName,
  setupMessage,
  canStartGame,
  minPlayers,
  maxPlayers,
  onBackToMenu,
  onSetNewPlayerName,
  onAddPlayer,
  onRemovePlayer,
  onStartGame,
}: SetupScreenProps) {
  return (
    <View style={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={onBackToMenu}>
        <Text style={styles.backButtonText}>Zurueck zum Menu</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Spieler hinzufuegen</Text>
      <Text style={styles.sectionSubtext}>
        {minPlayers}-{maxPlayers} Spieler im Kreis. 6 Schuss pro Runde.
      </Text>
      <Text style={styles.playerCountText}>
        Spieler: {players.length}/{maxPlayers}
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.playerInput}
          placeholder="Name eingeben"
          placeholderTextColor={Colors.textMuted}
          value={newPlayerName}
          onChangeText={onSetNewPlayerName}
          onSubmitEditing={onAddPlayer}
        />
        <TouchableOpacity style={styles.addButton} onPress={onAddPlayer} activeOpacity={0.85}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {setupMessage ? <Text style={styles.validationText}>{setupMessage}</Text> : null}

      <View style={styles.playersList}>
        {players.length === 0 ? (
          <Text style={styles.emptyPlayersText}>Noch keine Spieler</Text>
        ) : (
          players.map((player) => (
            <View key={player.id} style={styles.playerRow}>
              <Text style={styles.playerName}>{player.name}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => onRemovePlayer(player.id)}
                activeOpacity={0.85}
              >
                <Text style={styles.removeButtonText}>Entfernen</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, !canStartGame && styles.disabledButton]}
        onPress={onStartGame}
        activeOpacity={0.85}
        disabled={!canStartGame}
      >
        <Text style={styles.primaryButtonText}>Spiel starten</Text>
      </TouchableOpacity>
    </View>
  );
}
