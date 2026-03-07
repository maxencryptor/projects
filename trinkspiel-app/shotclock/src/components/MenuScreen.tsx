import React from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/appStyles';

type MenuScreenProps = {
  glowOpacity: Animated.AnimatedInterpolation<string | number>;
  onOpenSetup: () => void;
};

export function MenuScreen({ glowOpacity, onOpenSetup }: MenuScreenProps) {
  return (
    <View style={styles.content}>
      <Animated.View style={[styles.logoContainer, { opacity: glowOpacity }]}>
        <Text style={styles.logoText}>SHOTCLOCK</Text>
        <Text style={styles.logoSubtext}>Party-Modus mit Scoreboard</Text>
      </Animated.View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={onOpenSetup} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Spiel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => {}} activeOpacity={0.85}>
          <Text style={styles.secondaryButtonText}>Wahrheit oder Pflicht (V2)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => {}} activeOpacity={0.85}>
          <Text style={styles.secondaryButtonText}>Wort-Kette (V2)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
