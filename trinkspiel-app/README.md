# 🍻 Trinkspiel App - Projekt-Doku

> Letzte Aktualisierung: 2026-03-06
> Status: 🚧 MVP in Entwicklung

---

## 🎯 Vision

Intuitive Trinkspiel-App mit Fokus auf:
- **Schöne UI** - Eye-catching Design mit sanften Animationen
- **Einfachheit** - Keine komplexen Menüs, sofort loslegen
- **Social** - Perfekt für Partys mit Freunden

---

## 🛠️ Tech Stack

| Komponente | Technologie |
|------------|-------------|
| Framework | React Native + Expo |
| Styling | NativeWind (Tailwind) |
| Animationen | React Native Reanimated |
| Icons | Phosphor Icons |
| State | React Context (erstmal simpel) |

---

## ✅ MVP Checkliste

### Phase 1: Grundgerüst
- [x] Expo Projekt initialisieren
- [ ] Grund-Navigation (Stack Navigator)
- [ ] Farbschema + Design-System
- [ ] Splash Screen

### Phase 2: Spielmechanik
- [ ] Timer-Komponente (animiert)
- [ ] Kategorie-System
- [ ] Spieler-Verwaltung
- [ ] Punkte/Strafen-Logik

### Phase 3: Polish
- [ ] Karten-Animationen (Flip, Shake)
- [ ] Sound-Effekte
- [ ] Haptic Feedback
- [ ] Dark/Light Mode

---

## 🎮 Spielmodi

### Modus 1: Kategorie-Sprint (MVP)
**Ablauf:**
1. Kategorie wird angezeigt (z.B. "Bands mit Buchstabe R")
2. Timer startet (10 Sekunden)
3. Spieler muss etwas nennen + Button drücken
4. Nächster Spieler ist dran
5. Wer zu langsam ist oder nichts weiß -> trinkt

**Besonderheit:** Timer wird schneller je länger das Spiel läuft

### Modus 2: Wahrheit oder Pflicht (V2)
- Rotierende Aufgaben
- Schwierigkeitsgrade

### Modus 3: Wort-Kette (V2)
- Letzter Buchstabe = Erster Buchstabe
- Zeitdruck

---

## 🎨 Design-System

### Farben
```
Primary:    #FF6B6B (Warmes Rot/Orange - Party-Vibe)
Secondary:  #4ECDC4 (Türkis - Kontrast)
Background: #1A1A2E (Dunkles Navy - Premium-Feel)
Surface:    #16213E (Etwas heller für Karten)
Text:       #FFFFFF (Weiß)
Accent:     #FFE66D (Gelb für Highlights)
```

### Typografie
- **Headlines:** Bold, groß, verspielt
- **Body:** Clean, gut lesbar
- **Timer:** Monospace, groß

### Animationen
- **Karten-Flip:** 0.3s ease-in-out
- **Shake:** Bei falscher Antwort
- **Pulse:** Timer < 3 Sekunden
- **Slide:** Screen-Transitions

---

## 📱 Screens

1. **Home** - Spielmodus wählen
2. **Spieler-Setup** - Namen eingeben
3. **Spiel** - Hauptspielfläche
4. **Ergebnis** - Runde beendet

---

## 💰 Monetarisierung (V2)

**Gratis:**
- 3 Kategorien
- Basis-Spielmodi
- Werbung alle 5 Runden

**Premium (4,99€):**
- 50+ Kategorien
- Alle Spielmodi
- Werbefrei
- Custom Kategorien

---

## 📝 Änderungslog

### 2026-03-06
- Projekt gestartet
- Tech Stack entschieden: Expo + React Native
- MVP Scope definiert: Kategorie-Sprint Modus
- Design-Farbschema festgelegt

---

## 🤔 Offene Fragen

- [ ] App-Name finalisieren
- [ ] Logo/Idee?
- [ ] Soll es Multiplayer-Online geben oder nur lokal?
- [ ] Welche Kategorien sollen im MVP drin sein?

---

## 📚 Ressourcen

- Expo Docs: https://docs.expo.dev
- React Native Docs: https://reactnative.dev
- Icons: https://phosphoricons.com
