import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Animated } from 'react-native';
import { Colors } from './src/constants/Colors';

// Spielmodus-Typen
type GameMode = 'menu' | 'category-sprint' | 'setup';

// Kategorien für das Spiel
const CATEGORIES = [
  "Bands mit Buchstabe ",
  "Filme mit Buchstabe ",
  "Städte in Deutschland",
  "Promis mit Buchstabe ",
  "Essen mit Buchstabe ",
  "Tiere mit Buchstabe ",
  "Sportarten",
  "Getränke",
  "Youtuber",
  "TikToker"
];

// Zufälliger Buchstabe
const getRandomLetter = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * letters.length)];
};

// Hauptkomponente
export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('menu');
  const [currentCategory, setCurrentCategory] = useState('');
  const [currentLetter, setCurrentLetter] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // Animation für Glow-Effekt
  const glowAnim = useState(new Animated.Value(0))[0];

  // Glow-Animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  // Timer-Logik
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Neues Spiel starten
  const startNewGame = () => {
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const letter = getRandomLetter();
    setCurrentCategory(category.includes('Buchstabe') ? category + letter : category);
    setCurrentLetter(letter);
    setTimeLeft(10);
    setIsTimerRunning(true);
    setCurrentMode('category-sprint');
  };

  // Spieler hat geantwortet
  const playerAnswered = () => {
    setIsTimerRunning(false);
    startNewGame();
  };

  // Zurück zum Menü
  const backToMenu = () => {
    setIsTimerRunning(false);
    setCurrentMode('menu');
  };

  // Glow-Interpolation
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  // Menü-Screen
  if (currentMode === 'menu') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.content}>
          <Animated.View style={[styles.logoContainer, { opacity: glowOpacity }]}>
            <Text style={styles.logoText}>SHOTCLOCK</Text>
            <Text style={styles.logoSubtext}>🍻 Party Trinkspiel</Text>
          </Animated.View>

          <View style={styles.menuContainer}>
            <TouchableOpacity 
              style={styles.neonButton}
              onPress={startNewGame}
              activeOpacity={0.8}
            >
              <Text style={styles.neonButtonText}>▶  KATEGORIE SPRINT</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.neonButton, styles.neonButtonSecondary]}
              onPress={() => {}}
              activeOpacity={0.8}
            >
              <Text style={styles.neonButtonTextSecondary}>🎲  Wahrheit oder Pflicht (V2)</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.neonButton, styles.neonButtonSecondary]}
              onPress={() => {}}
              activeOpacity={0.8}
            >
              <Text style={styles.neonButtonTextSecondary}>🔗  Wort-Kette (V2)</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.versionText}>v1.0.0 - MVP</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Spiel-Screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={backToMenu}>
          <Text style={styles.backButtonText}>← ZURÜCK</Text>
        </TouchableOpacity>

        <View style={styles.gameContainer}>
          {/* Timer */}
          <View style={styles.timerContainer}>
            <Animated.View 
              style={[
                styles.timerCircle, 
                timeLeft <= 3 && { borderColor: Colors.danger, shadowColor: Colors.danger }
              ]} 
            >
              <Text style={[
                styles.timerText,
                timeLeft <= 3 && { color: Colors.danger }
              ]}>
                {timeLeft}
              </Text>
            </Animated.View>
            <Text style={styles.timerLabel}>SEKUNDEN</Text>
          </View>

          {/* Kategorie Karte */}
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>KATEGORIE</Text>
              <Text style={styles.cardText}>{currentCategory}</Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={playerAnswered}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>✓  HABE GEANTWORTET</Text>
          </TouchableOpacity>

          <Text style={styles.instructionText}>
            Drücke schnell, wenn du eine Antwort hast!{'\n'}
            Wer zu langsam ist → trinkt!
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  // Logo
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 60,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.primary,
    textShadowColor: Colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    letterSpacing: 4,
  },
  logoSubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  // Menu
  menuContainer: {
    gap: 20,
  },
  neonButton: {
    backgroundColor: Colors.surface,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  neonButtonSecondary: {
    borderColor: Colors.secondary,
    shadowColor: Colors.secondary,
    opacity: 0.7,
  },
  neonButtonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  neonButtonTextSecondary: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  versionText: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 40,
  },
  // Game
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: Colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 30,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: Colors.text,
  },
  timerLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
    letterSpacing: 2,
  },
  cardContainer: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.surface,
    padding: 30,
    borderRadius: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.secondary,
    alignItems: 'center',
  },
  cardLabel: {
    color: Colors.secondary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 12,
  },
  cardText: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: Colors.success,
    paddingVertical: 20,
    borderRadius: 16,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  actionButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructionText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});