# ShotClock Trinkspiel App

Letzte Aktualisierung: 2026-03-07  
Status: MVP lauffaehig (Kategorie-Sprint)

## Was die App aktuell kann

- Startscreen mit Party-Style UI (mehrfarbig, trotzdem clean)
- Spieler-Setup vor Spielstart
- Spieler hinzufuegen und entfernen
- Spielstart erst ab mindestens 2 Spielern
- Kategorie-Sprint Runde mit 10s Timer
- Zufalls-Kategorie und (wo passend) Zufalls-Buchstabe
- Feste Zugreihenfolge zwischen Spielern
- Wenn die Bombe beim aktiven Spieler explodiert (Timer = 0), bekommt dieser 1 Strafpunkt
- Live-Scoreboard mit Strafpunkten pro Spieler
- Anzeige, wer aktuell verliert (meiste Strafpunkte)
- Spiel zuruecksetzen

## Aktueller Spielablauf (Kategorie-Sprint)

1. In der App auf `Spieler vorbereiten` gehen.
2. Mindestens 2 Spieler anlegen.
3. `Kategorie Sprint starten` druecken.
4. Aktiver Spieler sieht Kategorie + Countdown.
5. Bei Antwort: `Ich habe geantwortet`.
6. Bei Timer 0: Bombe explodiert beim aktiven Spieler, Strafpunkt wird vergeben.
7. Naechster Spieler ist dran.

Regel aktuell: Der Spieler mit den meisten Strafpunkten verliert.

## Tech Stack (realer Stand)

- Expo SDK 54
- React Native 0.81
- React 19
- TypeScript 5.9
- `react-native-safe-area-context` fuer Safe Areas

## Projektstruktur

```text
trinkspiel-app/
  README.md
  shotclock/
    App.tsx
    src/
      components/
        MenuScreen.tsx
        SetupScreen.tsx
        GameScreen.tsx
      constants/
        Colors.ts
      game/
        constants.ts
        types.ts
        utils.ts
        useShotclockGame.ts
      styles/
        appStyles.ts
```

## Architektur (Clean Code)

- `App.tsx`: nur Composition/Screen-Switching
- `src/game/useShotclockGame.ts`: komplette Spielzustands- und Ablauflogik
- `src/components/*`: reine UI-Screens (praesentational)
- `src/styles/appStyles.ts`: zentrale Styles
- `src/game/constants.ts|utils.ts|types.ts`: domain-nahe Bausteine

So sind Logik, UI und Styling klar getrennt.

## Projekt starten

```bash
cd shotclock
npm install
npx expo start -c --tunnel 
```

## Hinweise

- Wenn iOS Probleme mit altem Build/Cache zeigt:

```bash
npx expo run:ios
npx expo start -c
```

## Nächste sinnvolle Schritte

- Spielende-Regel konfigurierbar machen (z. B. bei 5 Strafpunkten)
- Persistenz fuer Spieler/Letzten Spielstand
- Weitere Spielmodi aktiv entwickeln (Wahrheit/Pflicht, Wort-Kette)
