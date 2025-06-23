# Schnelle Kalorien Eingabe - Google Fit PWA

Eine einfache Progressive Web App (PWA) für Android, um schnell Kalorienwerte in Google Fit einzutragen.

## Setup

### 1. Google Cloud Console Konfiguration

1. Gehe zur [Google Cloud Console](https://console.cloud.google.com/)
2. Erstelle ein neues Projekt oder wähle ein bestehendes aus
3. Aktiviere die **Fitness API**
4. Erstelle OAuth 2.0 Credentials:
   - Gehe zu "APIs & Services" > "Credentials" 
   - Klicke auf "Create Credentials" > "OAuth client ID"
   - Wähle "Web application"
   - Füge deine Domain zu "Authorized JavaScript origins" hinzu

### 2. App Konfiguration

Ersetze in `app.js` die Platzhalter:

```javascript
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Deine Client ID
const API_KEY = 'YOUR_GOOGLE_API_KEY'; // Dein API Key (falls benötigt)
```

### 3. Icons (Optional)

Erstelle Icons für die PWA:
- `icon-192.png` (192x192 px)
- `icon-512.png` (512x512 px)

### 4. Hosting

Hoste die App auf einem HTTPS-Server (erforderlich für PWA-Features).

## Installation auf Android

1. Öffne die App im Chrome Browser
2. Tippe auf das Menü (drei Punkte)
3. Wähle "Zum Startbildschirm hinzufügen"
4. Die App wird als native App installiert

## Features

- ✅ Schnelle Kalorieneingabe mit minimalen Feldern
- ✅ Google Fit Integration
- ✅ PWA - installierbar auf Android
- ✅ Offline-fähig (Service Worker)
- ✅ Mobile-optimiertes Design
- ✅ Deutsche Benutzeroberfläche

## Verwendung

1. Mit Google Fit verbinden
2. Kalorienwert eingeben
3. Optional: Beschreibung hinzufügen
4. "Kalorien hinzufügen" drücken

Die Daten werden automatisch in Google Fit synchronisiert.