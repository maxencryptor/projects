# ShotClock Trinkspiel App

Letzte Aktualisierung: 2026-03-07  
Status: MVP lauffaehig inkl. Kettenreaktions-Modus

## Ist-Stand (bereits umgesetzt)

- Startscreen mit klarer, party-tauglicher UI
- Spieler-Setup (Spieler hinzufuegen/entfernen)
- Spielstart ab mindestens 2 Spielern
- Kategorie-Sprint mit 10s Timer
- Kettenreaktions-Modus (frei und mit Kategorie)
- Feste Zugreihenfolge
- Bombe bei `Timer = 0` mit Strafpunkt fuer aktiven Spieler
- Live-Scoreboard mit aktueller Verliereranzeige
- Wort-Validierung auf korrekten Startbuchstaben
- Ungueltige Eingabe zeigt `Nochmal!` + Warnung im aktuellen Zug

## Spielkonzept

ShotClock ist ein minimalistisches Trinkspiel mit Kettenreaktions-Mechanik.  
Jeder Spieler muss ein Wort nennen, das mit dem letzten Buchstaben des vorherigen Wortes beginnt.

Beispiel:
- Spieler 1: `Apfel` -> letzter Buchstabe `L`
- Spieler 2: `Lampe` -> letzter Buchstabe `E`
- Spieler 3: `Elch` -> letzter Buchstabe `H`
- Spieler 4: `Haus` -> ...

## Kern-Mechanik

### Timer-System
- 10 Sekunden pro Spieler (konfigurierbar)
- Visueller Countdown als kreisrunder Fortschrittsbalken
- Letzte 3 Sekunden: Pulse-Animation + Rotwechsel
- Bei 0: Bombe explodiert, aktiver Spieler erhaelt 1 Strafpunkt

### Kategorien (optional)
- Moduswahl vor Start:
  - Freies Ketten-Spiel
  - Kategorie-Modus
- Im Kategorie-Modus wird eine Kategorie vor Spielstart festgelegt
- Beispielkategorien: Tiere, Staedte, Berufe, Lebensmittel

### Validierung
- Pflichtregel: Wort muss mit korrektem Buchstaben beginnen
- Optional: Woerterbuch-API fuer Rechtschreibpruefung
- Ungueltiges Wort: `Nochmal!` (kein Zeitverlust, aber 1 Warnung)

## Design-Vision (Minimalistisch & Elegant)

### Farbschema
- Primaer: `#1A1A2E`
- Sekundaer: `#16213E`
- Akzent: `#E94560` (Bombe/Timer)
- Highlight: `#0F3460` (aktiver Spieler)
- Text: `#EAEAEA`
- Subtil: `#A0A0A0`

### Typografie
- Hauptschrift: Inter oder System-Font
- Woerter: Bold
- Timer: Monospace fuer technische Lesbarkeit
- Generell: grosszuegige, dunkeltaugliche Groessen

### Layout-Prinzipien
- Maximal 3 Hauptelemente gleichzeitig sichtbar
- Touch-Targets mindestens `48x48dp`
- Viel Whitespace
- Subtiler Glassmorphism fuer Overlays

## Bombe-Explosion (Ziel-Animation)

### Ablauf
1. Vor-Explosion (`Timer = 0`): 3 kurze Rot-Weiss-Flashes + Haptik
2. Explosion: Partikel (15-20), Farbverlauf Orange -> Gelb -> Weiss, Dauer ca. `800ms`
3. Zusatz-Effekte: leichter Screen-Shake (`~500ms`), optional kurzer Boom-Sound
4. Nach-Explosion: Rauch fade-out, `BOOM!`-Text, `+1`-Punkteanimation beim aktiven Spieler

## Architektur

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

## Start

```bash
cd shotclock
npm install
npx expo start -c
```

## Naechste Umsetzungsschritte

1. Visuellen Kreis-Fortschritt (echter Progress-Ring) statt statischer Timer-Anzeige bauen
2. Pulse-Animation fuer die letzten 3 Sekunden ergaenzen
3. Optionales Woerterbuch-API-Checking fuer Rechtschreibung integrieren
4. Kategorie-Regel server- oder listebasiert pruefbar machen (aktuell social self-check)
5. Explosionseffekt (Flash + Partikel + Shake + Haptik) implementieren
