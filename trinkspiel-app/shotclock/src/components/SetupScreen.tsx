import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MIN_PLAYERS } from '../game/constants';
import { Player } from '../game/types';
import { Colors } from '../constants/Colors';
import { styles } from '../styles/appStyles';

type SetupScreenProps = {
  players: Player[];
  newPlayerName: string;
  canStartGame: boolean;
  onBackToMenu: () => void;
  onSetNewPlayerName: (name: string) => void;
  onAddPlayer: () => void;
  onRemovePlayer: (id: string) => void;
  onStartGame: () => void;
};

export function SetupScreen({
  players,
  newPlayerName,
  canStartGame,
  onBackToMenu,
  onSetNewPlayerName,
  onAddPlayer,
  onRemovePlayer,
  onStartGame,
}: SetupScreenProps) {
  return (
    <View style={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={onBackToMenu}>
        <Text style={styles.backButtonText}>Zuruck zum Menu</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Spieler hinzufugen</Text>
      <Text style={styles.sectionSubtext}>
        Mindestens {MIN_PLAYERS} Spieler. Wer die Bombe beim eigenen Zug bekommt, erhalt einen Strafpunkt.
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.playerInput}
          placeholder="Name"
          placeholderTextColor={Colors.textMuted}
          value={newPlayerName}
          onChangeText={onSetNewPlayerName}
          onSubmitEditing={onAddPlayer}
        />
        <TouchableOpacity style={styles.addButton} onPress={onAddPlayer} activeOpacity={0.85}>
          <Text style={styles.addButtonText}>+ Add</Text>
        </TouchableOpacity>
      </View>

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
        <Text style={styles.primaryButtonText}>Kategorie Sprint starten</Text>
      </TouchableOpacity>
    </View>
  );
}
