# Plausibilitäts- & Rechtssicherheits-Check – Ruhige Orte v2

Datum: 27.07.2026
Prüfer: Automatisierter Check + OSM/DSGVO Leitfaden

## Nachtrag (Claude-Review, 27.07.2026)

Bei einer erneuten Vollprüfung vor Veröffentlichung wurden zwei echte Probleme gefunden und behoben:

1. **Kritischer Bug – App war komplett funktionsunfähig:** Der Bestätigungsdialog der Live-OSM-Suche enthielt einen mehrzeiligen String ohne `\n`-Escapes. Das ist kein gültiges JavaScript und hat das gesamte `<script>` mit einem Syntaxfehler zum Absturz gebracht – dadurch liefen Karte, Liste, Filter, Favoriten, GPS, Dark Mode: nichts. Behoben durch korrektes `\n`-Escaping. Die vorherige Einschätzung „Plausibilität 10/10, alle Funktionen arbeiten“ war dadurch nicht zutreffend.
2. **Impressumspflicht nicht erfüllt:** `IMPRESSUM.md` existierte nur als Markdown-Datei im Repo, war aber nirgends aus der App heraus verlinkt – für die deutsche Impressumspflicht reicht das nicht. Es wurden echte, gestaltete `impressum.html` und `datenschutz.html` ergänzt und im Footer der App verlinkt.

Zusätzlich: iOS-Standalone-Metatags (`apple-mobile-web-app-capable` u.a.) ergänzt, statische Platzhalterzahl „7 Orte“ auf tatsächliche Anzahl (27) korrigiert.

## Nachtrag 2 (Claude, 27.07.2026) – Erweiterungsrunde

Auf Jans Wunsch ergänzt, alle rein clientseitig bzw. opt-in:

- **Service Worker** (`sw.js`, Cache `ruhige-orte-v1`, Netzwerk-zuerst-Strategie) – löst das im README bereits behauptete, aber technisch nicht vorhandene Offline-Versprechen ein. Externe Live-Dienste (Overpass, Nominatim, Open-Meteo, Kartenkacheln) sind bewusst vom Cache ausgenommen.
- **Backup-Export/Import** (JSON, lokal, kein Server) für Favoriten/Notizen/Checks/Fotos
- **Duplikat-Filter** zwischen kuratierten Orten und Live-Overpass-Treffern (<60m werden verworfen)
- **`prefers-reduced-motion`** respektiert – Hintergrund-Animationen lassen sich systemseitig abschalten
- **Goldene-Stunde-Berechnung** – vollständig lokal per NOAA-Sonnenstand-Formel, keine externe Anfrage, kein neuer Rechtspunkt
- **Neuer externer Dienst: Open-Meteo** (`api.open-meteo.com`) für optionalen Live-Wetterabruf pro Ort – nur nach Klick + Bestätigungsdialog (gleiches Opt-in-Muster wie Nominatim/Overpass), kostenlos, kein Login, kein Tracking. In `datenschutz.html` ergänzt.
- **Fotos zu Orten** – werden vor dem Speichern im Browser auf max. 800px Breite verkleinert (JPEG, Qualität 0.75), um localStorage nicht zu sprengen; neuer localStorage-Key `ruhige-orte-photos`, in `datenschutz.html` ergänzt
- **Kartenvollbild-Modus** mit eigenem, immer erreichbarem Schließen-Button plus Escape-Taste als Sicherheitsnetz
- **Druckansicht** für eigene Favoriten (öffnet ein separates, unbeteiligtes Druckfenster – keine Datenübertragung)

Bewusst NICHT umgesetzt: Gamification (Achievements/Highscores) passt inhaltlich nicht zu einer Ruhe-Ortssuche; ein Naturklang-Player wurde zurückgestellt, da dafür erst wirklich lizenzfreies Audiomaterial geklärt werden müsste.

## Nachtrag 3 (Claude, 27.07.2026) – Startseite & Struktur

Auf Jans Wunsch die bisherige Ein-Seiten-App in vier Dateien aufgeteilt, um die Übersicht zu verbessern:

- **`index.html`** – neue, ruhige Startseite: kurze Vorstellung + große Buttons zu App, Anleitung, Impressum, Datenschutz
- **`app.html`** – das eigentliche Werkzeug (bisheriger Inhalt von index.html: Karte, Filter, Liste); am Fuß kompakte Navigation zurück zu Start/Anleitung/Impressum/Datenschutz statt der bisherigen ausführlichen Feature-Liste
- **`anleitung.html`** – neue Schritt-für-Schritt-Anleitung zu allen Funktionen
- `manifest.json`: `start_url` zeigt jetzt auf `app.html`, damit das installierte Homescreen-Icon weiterhin direkt ins Werkzeug springt und nicht jedes Mal über die Startseite umweg
- `sw.js`: Cache-Version auf v2 erhöht, neue Seiten in die Offline-Liste aufgenommen

## Nachtrag 4 (Claude, 27.07.2026) – Vollbild-Karte überlagert von anderen Feldern

Jan meldete: Nach dem Öffnen der Kartenvollbild-Ansicht blieben andere Bedienelemente sichtbar über der Karte. Ursache vermutlich: Die Glas-Karten (`backdrop-filter`) erzeugen eigene Compositing-Ebenen, wodurch sich Safari bei einer nur per z-index nachträglich "nach oben gehobenen" Karte gelegentlich bei der Stapelreihenfolge vertut.
Lösung: Statt die Karte nur per z-index über die anderen Elemente zu heben, wird der komplette Karten-Container im Vollbildmodus jetzt aus dem normalen Seitenaufbau herausgelöst und in einen eigenen, separaten Overlay-Container am Ende von `<body>` verschoben (per JavaScript, mit Platzhalter-Kommentar zum exakten Zurücksetzen beim Schließen). Dadurch ist die Karte durch die reine DOM-Reihenfolge automatisch immer zuoberst – unabhängig von möglichen Compositing-Eigenheiten der Glas-Karten. Cache-Version auf v3 erhöht.

## Nachtrag 5 (Claude, 27.07.2026) – Abschluss der lückenlosen rechtlichen Prüfung

Jan wies zurecht darauf hin, dass Kapitel 5 dieses Dokuments nie wirklich abgeschlossen wurde (Haken nie gesetzt) und das Fazit unten noch die durch Nachtrag 1 bereits widerlegte „10/10"-Aussage enthielt. Beides ist jetzt korrigiert (siehe Kapitel 5 und Fazit).

Zusätzlich konkret nachgeprüft, wo Nominatim- und Overpass-Attribution in der UI tatsächlich sichtbar sind (Code-Zeilen in `app.html`):

| Dienst | Wo sichtbar | Dauerhaft oder einmalig |
|---|---|---|
| Overpass (Live-Suche) | Bestätigungsdialog vor dem Klick | einmalig pro Suche |
| Overpass (Live-Suche) | Ergebnis-Banner „✅ X OSM Orte gefunden ... Daten © OpenStreetMap ODbL" | dauerhaft sichtbar solange Ergebnisse aktiv |
| Overpass (Live-Suche) | Tag-Badge „OSM Live" an jedem einzelnen Ergebnis-Eintrag | dauerhaft an jeder Karte in der Liste |
| Overpass (Live-Suche) | Marker-Popup auf der Karte „(OSM Live)" | dauerhaft auf der Karte |
| Overpass (Live-Suche) | Details-Bereich „Regeln"/„Geschichte" nennen ODbL bzw. „© OpenStreetMap contributors" | bei aufgeklappten Details |
| Nominatim (Ortssuche) | Bestätigungsdialog vor dem Klick, nennt „Nominatim" explizit | einmalig pro Suche |
| Nominatim (Ortssuche) | Dauerhafter Kleintext unter dem Suchfeld, jetzt präzisiert auf „Nominatim" | dauerhaft sichtbar |
| Kartenkacheln (CARTO/OSM) | Leaflet-Attribution-Control unten rechts auf der Karte „© OpenStreetMap © CARTO" | dauerhaft auf jeder Kartenansicht |

Damit ist die Attribution mehrfach abgesichert und nicht nur einmalig in einem Dialog versteckt. Kleine Verbesserung vorgenommen: Der dauerhafte Kleintext unter dem Suchfeld nennt jetzt explizit „Nominatim" statt nur allgemein „OpenStreetMap", konsistent zum Bestätigungsdialog.

Technische Limits aus Kapitel 2 (30 Ergebnisse, 15s Timeout, 5 Min Cache, 10s Cooldown bei Overpass) wurden im Code gegengeprüft – sie stimmen mit der Dokumentation überein.

Damit ist die rechtliche Prüfung aus Sicht des Codes und der Dokumentation lückenlos abgeschlossen. Offen bleibt ausschließlich der reale Gerätetest durch Jan selbst (Kapitel 5).

## Nachtrag 6 (Claude, 27.07.2026) – App startete nicht mit der Startseite

In Nachtrag 3 wurde `start_url` in `manifest.json` bewusst auf `app.html` gesetzt, damit ein installiertes Homescreen-Icon direkt ins Werkzeug springt. Jan wollte aber, dass die App mit der Startseite beginnt – `start_url` jetzt zurück auf `./index.html` korrigiert. Cache-Version auf v4 erhöht.

**Wichtig für Jan:** Falls du das Icon schon vor dieser Änderung zum Homescreen hinzugefügt hast, liest iOS `start_url` nur einmal beim Hinzufügen aus – die Änderung wirkt sich auf ein bereits vorhandenes Icon nicht rückwirkend aus. In dem Fall bitte das alte Icon vom Homescreen löschen und die Seite erneut über „Zum Home-Bildschirm" hinzufügen.

## 1. Funktionalität – Plausibilität

✅ Standort via GPS (navigator.geolocation) – nur lokal, Haversine Distanz lokal gerechnet, plausibel
✅ Auf Karte tippen – setzt lat/lon, zeichnet Radius Kreis, plausibel
✅ Radius Slider 1-20km – filtert Liste, Kreis auf Karte in #4A8BBF mit 0.18 Opacity, plausibel
✅ Ort suchen via Nominatim – nur nach Klick + Confirm, fetch an nominatim.openstreetmap.org, limit 1, countrycodes=de, plausibel
✅ Live OSM Suche via Overpass – nur nach Klick + Confirm, BBOX an overpass-api.de, POST, 30 Ergebnisse, 5 Min Cache, 10s Cooldown, plausibel
✅ Filter Mood + Komfort + Textsuche + Favoriten + JETZT ruhig – alles clientseitig via Array.filter, plausibel
✅ Favoriten, Notizen, Checks, Custom Orte – nur localStorage, Keys: ruhige-orte-favs, -notes, -checks, -custom, -theme, plausibel
✅ Hell/Dunkel – prefers-color-scheme + localStorage, Toggle, Map Tiles switch light/dark, plausibel
✅ Teilen – navigator.share oder clipboard, Hash #id, Scroll zu Ort, plausibel
✅ iPhone Portrait – max-width 440px, 100dvh, safe-area-inset, Bottom Sheet, 44px Touch, kein horizontal scroll, plausibel

## 2. Lizenzen – Technisch

### Code
- Eigener Code: MIT License – LICENSE Datei vorhanden, Copyright Jan Dierlich 2026 – ✅ erlaubt kommerziell, privat, Änderung, nur Attribution nötig

### Karten & Daten
- **Leaflet 1.9.4** – BSD-2-Clause (MIT kompatibel) – via unpkg CDN, Lizenz: https://github.com/Leaflet/Leaflet/blob/main/LICENSE – ✅ erlaubt, Attribution nicht nötig aber vorhanden
- **Carto Tiles** – CARTO Voyager (farbiger Stil, ein Kachel-Set für beide Modi, Dark Mode per CSS-Farbumkehr statt separatem grauen Dark-Matter-Stil, siehe Nachtrag 7) – basieren auf OSM Daten, Lizenz: Kartenstil © CARTO, Daten © OSM ODbL – Nutzung erlaubt mit Attribution – ✅ Attribution im Code: "© OpenStreetMap © CARTO" vorhanden
- **OpenStreetMap Daten** – ODbL 1.0 – https://opendatacommons.org/licenses/odbl/ – Erlaubt Nutzung, Änderung, Weitergabe mit Attribution "© OpenStreetMap contributors" – ✅ Attribution vorhanden in Footer, Map, OSM Results, README
- **Nominatim** – OSM Suchdienst – Nutzungsbedingungen https://operations.osmfoundation.org/policies/nominatim/ – Erfordert: kein Bulk, User-Agent, nur opt-in, Attribution – ✅ Wir nutzen nur nach Klick, limit 1, mit Confirm Dialog, Attribution vorhanden
- **Overpass API** – Community Server overpass-api.de – Nutzungsbedingungen https://dev.overpass-api.de/overpass-doc/en/target/formats/index.html + https://wiki.openstreetmap.org/wiki/Overpass_API – Fair Use: max 10k Anfragen/Tag, kein Dauer-Scraping, Timeout, Cache – ✅ Wir halten ein: 30 Ergebnisse, 15s timeout, 5 Min Cache, 10s Cooldown, nur nach Klick, nur BBOX

### Fonts – Wichtig!
- **Vorher:** `font-family: Inter, system-ui` – Inter wurde NICHT via Google Fonts geladen, nur als Name im Stack, Browser fällt auf system-ui zurück. Keine externe Anfrage.
- **Jetzt fix:** Geändert auf `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` – **100% System-Fonts, keine externe Anfrage, keine Lizenz nötig, DSGVO safe**
- **Kein Google Fonts** – Google Fonts würde IP an Google senden und braucht Consent + ist in DE kritisch (LG München Urteil). Wir nutzen es NICHT – ✅ sicher
- Falls du Inter doch willst: Inter ist SIL OFL 1.1 – erlaubt, aber muss lokal eingebunden werden (woff2 im Repo), nicht via fonts.googleapis.com. Aktuell nicht nötig.

### Externe Requests – Übersicht
| Was | Wann | Wohin | Daten | Rechtlich |
|-----|------|-------|-------|-----------|
| Carto Tiles | Beim Karten laden | basemaps.cartocdn.com | BBOX Kacheln, IP | Technisch nötig, in Doku erwähnt, ODbL Attribution ok |
| Nominatim Suche | Nur nach Klick + Confirm | nominatim.openstreetmap.org | Suchtext | Opt-in, Attribution ok, Fair Use ok |
| Overpass Live | Nur nach Klick + Confirm | overpass-api.de | BBOX Koordinaten | Opt-in, ODbL, Fair Use (30, 15s, Cache, Cooldown) ok |
| Leaflet CDN | Beim Laden | unpkg.com | IP | BSD Lizenz, technisch nötig, in README erwähnt |

Keine weiteren Requests. Keine Tracker.

## 3. DSGVO / Datenschutz

✅ Keine Cookies
✅ Kein LocalStorage Tracking über Seiten hinaus (nur eigene Keys)
✅ Kein Google Analytics, kein Matomo, kein Facebook Pixel
✅ Standort nur lokal (navigator.geolocation), nie an Server gesendet
✅ IP-Adressen gehen nur an technisch notwendige Dienste (Carto, Overpass, Nominatim) – in Datenschutzerklärung in IMPRESSUM.md erwähnt
✅ Opt-in für externe Suche (Confirm Dialog)
✅ Löschbar: Browser → Website-Daten löschen

## 4. Impressumspflicht

In Deutschland gilt TMG §5 auch für private GitHub Pages, wenn öffentlich erreichbar. 
- IMPRESSUM.md Vorlage vorhanden – muss vor Publish ausgefüllt werden (Name, Anschrift, E-Mail)
- Im Footer steht Platzhalter – muss gefüllt werden

## 5. Offene Punkte vor Publish – Status 27.07.2026

- [x] IMPRESSUM.md ausfüllen – erledigt, echte Kontaktdaten hinterlegt
- [x] Impressum-Platzhalter in der App ersetzen – erledigt, echte `impressum.html`/`datenschutz.html` verlinkt (siehe Nachtrag 1)
- [x] LICENSE Jahr/Name geprüft – korrekt: „Copyright (c) 2026 Jan Dierlich – Ruhige Orte"
- [x] Nominatim/Overpass-Attribution in der UI geprüft (siehe Nachtrag 5) – vorhanden und mehrfach abgesichert
- [ ] **Einmal echt auf dem iPhone testen** (GPS, Tap, Suche, Live-Suche, Favoriten, Dark Mode, Vollbild) – das kann nur Jan selbst tun, keine Code-Prüfung ersetzt den Gerätetest
- [ ] Optional: Leaflet + Carto Tiles lokal hosten, um komplett ohne CDN auszukommen – nicht erforderlich, nur eine Option für maximale Datensparsamkeit

## Fazit (korrigiert, siehe Nachträge oben)

**Rechtlich & lizenztechnisch sicher:**
- Attributionen drin (OSM, CARTO, Nominatim, Overpass) – geprüft in Nachtrag 5
- Overpass/Nominatim nur opt-in mit Bestätigungsdialog – ist drin
- Keine Google Fonts, nur System-Fonts – ist so
- Impressum ausgefüllt und aus der App heraus verlinkt – ist so
- Keine Cookies/Tracking – ist so

**Funktional:** Die ursprüngliche Aussage „Plausibilität 10/10, alle Funktionen arbeiten" auf dieser Seite war zum Zeitpunkt der Erstellung **nicht zutreffend** – ein Syntaxfehler hatte die App komplett lahmgelegt (siehe Nachtrag 1). Nach den Korrekturen in Nachtrag 1–4 wurde der Code erneut vollständig auf JavaScript-Syntaxfehler geprüft (fehlerfrei), ersetzt aber keinen echten Test auf einem iPhone – der steht laut Punkt 5 noch aus.

Stand: 27.07.2026, letzte Prüfung Nachtrag 13

## Nachtrag 21 (Claude, 04.08.2026) – Restaurants ergänzt

Auf Nachfrage/Wunsch die Overpass-Query um `amenity=restaurant` erweitert. Namens-, Tag- und Stimmungs-Zuordnung ergänzt („Restaurant (OSM)"). Anleitung und README-Beispielquery aktualisiert. Cache-Version auf v20 erhöht. Rechtlich keine Änderung.

## Nachtrag 20 (Claude, 04.08.2026) – Drei neue Ortstypen in der Live-Suche

Auf Jans Auswahl hin die Overpass-Query um drei Kategorien erweitert: Seeufer/Strände (`natural=beach`, node+way), Picknickplätze (`tourism=picnic_site`), Naturschutzgebiete/Wälder (`leisure=nature_reserve`, way). Bänke wurden bewusst nicht wieder aufgenommen (siehe Nachtrag 13 – zu viele/zu wahllose Treffer). Namens-, Tag- und Stimmungs-Zuordnung für die neuen Typen ergänzt (z.B. „Strand/Seeufer (OSM)", Mood-Hinweis „Picknick" bei Picknickplätzen). Anleitung und README entsprechend aktualisiert; dabei auch eine veraltete Erwähnung von „Bänken" in der Anleitung korrigiert (Bänke waren seit Nachtrag 13 gar nicht mehr Teil der Suche, der Anleitungstext war seither nicht mehr korrekt). Cache-Version auf v19 erhöht. Rechtlich keine Änderung – gleiche Overpass-API, gleicher nutzergesteuerter Ablauf.

## Nachtrag 19 (Claude, 04.08.2026) – Stimmung/Komfort-Filter entfernt, Details inhaltlich optimiert

Jan bemerkte die Diskrepanz „27 OSM-Orte gefunden" vs. „7 Orte im Radius" – Ursache: Die Live-Suche fragt den sichtbaren Kartenausschnitt ab (kann größer sein als der gewählte Radius), die Liste filtert zusätzlich nach dem tatsächlichen Radius. Die Erfolgsmeldung nennt jetzt beide Zahlen („X im sichtbaren Kartenausschnitt, davon Y im Radius").

Auf Wunsch entfernt: die Filter-Pill-Reihen „STIMMUNG" (Lesen/Durchatmen/Mit Kind/Mit Hund/Picknick) und „KOMFORT" (Stufenlos/<300m/Parkplatz/Schattig/Digital Detox) aus dem Bereich „Filter & Aktionen". Der freie Textfilter (individueller Filter) bleibt erhalten. Grund für die inhaltliche Optimierung statt reiner Verschiebung: Die Komfort-Werte für Live-OSM-Orte waren größtenteils hartkodierte Platzhalter ohne echte Datengrundlage (`kurz:true`, `parkplatz:false`, `schatten:false`, `detox:false` – unabhängig vom tatsächlichen Ort), hätten als Fakt dargestellt also in die Irre geführt. Ersetzt durch:
- **Details je Ort:** neue Zeile „📍 Entfernung von deinem Standort" (echter berechneter Wert, ersetzt den irreführenden „<300m"-Komfortpunkt).
- **Details je Ort:** „💭 Könnte passen für" – die bisherige Stimmungs-Zuordnung, jetzt als klar erkennbarer weicher Hinweis statt als (vorgeblich objektives) Filterkriterium.
- **Details je Ort:** „♿ Barrierefrei laut OSM" – nur angezeigt, wenn der `wheelchair`-Tag in den echten OSM-Daten vorhanden ist (ehrliche Übernahme realer Daten statt Platzhalter).
- `getFiltered()`, Reset-Button, Variablendeklaration entsprechend bereinigt, keine toten Referenzen (Syntaxcheck bestanden).

Anleitung und README an die neue Struktur angepasst. Cache-Version auf v18 erhöht.

## Nachtrag 18 (Claude, 04.08.2026) – Feste Orte-Liste entfernt, nur noch Live-Ergebnisse

Auf Jans expliziten Wunsch wurde die komplette feste, kuratierte Orte-Liste entfernt (bisher 27 Einträge: 7 rund um Tangstedt + 20 bundesweite Beispiele). Auf Nachfrage entschied Jan sich für die vollständige Variante: **auch** die 7 lokalen Tangstedt-Orte fliegen raus, nicht nur die bundesweiten Beispiele. Die App zeigt jetzt ausschließlich:
1. Live-Ergebnisse aus der Overpass API für den aktuellen Kartenausschnitt (wie bisher, unverändert in der Funktionsweise/Rechtslage – siehe frühere Nachträge).
2. Über „⭐ Merken" dauerhaft lokal gespeicherte Orte aus früheren Live-Suchen.

**Dabei behobener Alt-Bug (unabhängig von dieser Änderung, aber jetzt kritisch):** Gemerkte OSM-Orte (`localStorage`-Key `ruhige-orte-custom`) wurden bisher nur beim Import eines Backups, nicht aber beim normalen Neustart der App wieder in die Orte-Liste geladen – sie verschwanden nach einem Browser-/App-Neustart faktisch aus der Ansicht (blieben nur als Favoriten-ID ohne zugehörigen Ort). Jetzt werden sie beim Start immer korrekt nachgeladen.

**Weitere Anpassungen:**
- Leerer Zustand der Ergebnisliste unterscheidet jetzt zwischen „noch keine Live-Suche gestartet" (Hinweis auf den Live-Suche-Button) und „Filter/Radius zu eng" (bisheriger Hinweis).
- Abschnitt „Standort & Suche" (enthält den Live-Suche-Button) ist jetzt standardmäßig aufgeklappt, da er nun der einzige Weg ist, überhaupt Orte zu sehen.
- Offline-Aussagen in `anleitung.html`, `README.md`, `index.html` und `manifest.json` präzisiert: Die App-Hülle sowie bereits gemerkte Orte/Favoriten/Notizen/Fotos funktionieren weiterhin offline, neue Orte über die Live-Suche brauchen aber zwingend eine Verbindung (vorher implizierte „läuft offline", dass direkt Inhalte vorhanden sind).
- `README.md`: Abschnitt „27 Orte inklusive" ersetzt durch Beschreibung des Live-only-Modells.

**Rechtlich/lizenztechnisch:** Keine neuen Auswirkungen – die Live-Suche funktionierte bereits vorher exakt so (nutzergesteuert, mit Bestätigungsdialog, Rate-Limit, Cache); es fällt lediglich zusätzlicher, selbst verfasster Beispieltext (Geschichte/Regeln-Texte zu den 27 Orten) weg. Cache-Version auf v17 erhöht.

## Nachtrag 17 (Claude, 04.08.2026) – Vollständiger Plausibilitäts- und Rechtscheck (auf Jans expliziten Wunsch)

Jan bat um einen kompletten Check aller Komponenten (Funktion, Optik, Recht, Lizenzen – insbesondere externe Links), da ihm die rechtliche Sicherheit am wichtigsten ist. Dazu wurden die aktuellen Nutzungsbedingungen aller extern eingebundenen Dienste per Websuche neu geprüft (nicht nur aus Trainingswissen), da sich diese seit dem letzten Check geändert haben könnten. Ergebnis:

**🔴 Wichtigster Fund – CARTO-Kartenkacheln waren nicht mehr frei nutzbar:**
Die App lud Kartenkacheln von `basemaps.cartocdn.com` (CARTO Voyager). Die aktuelle, offizielle Lizenzdatei von CARTO (`github.com/CartoDB/basemap-styles/LICENSE.md`, Stand 2026) stellt inzwischen ausdrücklich klar: *„access to CARTO's basemap tile services is restricted to CARTO enterprise customers and Non-Profit GRANTS only and is not available for free public use."* Die kostenlose öffentliche Nutzung dieser Kachel-URLs ist damit laut CARTO selbst nicht mehr gedeckt – unabhängig davon, dass die URL technisch weiterhin erreichbar ist. Da Jan explizit "absolut sicher, erlaubt und kostenlos" gefordert hat, wurde dies als Risiko eingestuft und behoben:
- Kartenkacheln umgestellt auf den offiziellen, kostenlosen Standard-Tile-Server der OpenStreetMap Foundation: `tile.openstreetmap.org` (klar dokumentierte, kostenlose Nutzungsbedingungen unter operations.osmfoundation.org/policies/tiles/, erlaubt normale interaktive Nutzung durch echte Browser ohne Weiteres – die App lädt ausschließlich sichtbare Kartenausschnitte, kein Offline-Vorab-Download, erfüllt damit alle Anforderungen).
- Attribution im Code auf „© OpenStreetMap contributors" (verlinkt) angepasst, `maxZoom` von 20 auf 19 (OSM-Standardlimit) korrigiert.
- `sw.js`: `NO_CACHE_HOSTS` von `basemaps.cartocdn.com` auf `tile.openstreetmap.org` umgestellt, damit Kartenkacheln weiterhin nicht dauerhaft im Service-Worker-Cache landen (Offline-Vorhaltung von Kacheln ist laut OSM-Tile-Policy ausdrücklich untersagt). Dabei außerdem bemerkt und behoben: die beiden Overpass-Spiegelserver (`overpass.kumi.systems`, `overpass.private.coffee`) fehlten bisher in dieser Liste und wären dadurch ungewollt dauerhaft zwischengespeichert worden – jetzt ergänzt.
- `datenschutz.html`, `IMPRESSUM.md` und `README.md`: CARTO-Erwähnungen durch die neue OSM-Kachelquelle ersetzt, Links auf die OSM-Tile-Policy statt CARTO-Datenschutz gesetzt.

**🟡 Impressum – veraltete Rechtsgrundlage:**
Das Impressum verwies auf „§ 55 Abs. 2 RStV". Der Rundfunkstaatsvertrag (RStV) wurde bereits im November 2020 durch den Medienstaatsvertrag (MStV) abgelöst; die entsprechende Pflichtangabe ist seither „§ 18 Abs. 2 MStV". Mehrere aktuelle Rechtsquellen (u.a. IHK Düsseldorf) bezeichnen den fortgesetzten Verweis auf § 55 RStV ausdrücklich als unzulässig. Korrigiert in `impressum.html` und `IMPRESSUM.md` auf „Inhaltlich verantwortlich gemäß § 18 Abs. 2 MStV".

**🟢 Open-Meteo – Attribution nachgeschärft:** Die CC-BY-4.0-Lizenz von Open-Meteo verlangt einen Link neben jeder Anzeige ihrer Daten. Bisher stand nur der Text „(Open-Meteo)" ohne Link da – jetzt verlinkt zu open-meteo.com.

**Bestätigt (keine Änderung nötig), jeweils per aktueller Websuche gegengeprüft:**
- **Nominatim:** Nutzung ist durch Klick + Bestätigungsdialog nutzerausgelöst und moderat im Volumen – entspricht genau der von der OSM Foundation erlaubten Nutzungsart („Use that is directly triggered by the end-user... is ok, provided that your number of users is moderate"). Kein automatisches/serienweises Abfragen im Code.
- **Overpass API (3 Spiegelserver):** Alle drei sind kostenlose, für diese Art Nutzung vorgesehene OSM-Community-Dienste; Anfrage nur nach Klick + Bestätigung, mit 10-Sek-Sperre und 5-Min-Cache – deutlich im fairen Rahmen.
- **Open-Meteo:** Kostenlose Nutzung bis 10.000 Anfragen/Tag für nicht-kommerzielle Zwecke, keine Anmeldung nötig – die App bleibt bei einer Handvoll Klicks pro Sitzung weit darunter.
- **Leaflet (unpkg.com CDN):** BSD-2-Clause, freie Nutzung, unpkg ist ein etabliertes kostenloses CDN für npm-Pakete.
- **Fonts:** weiterhin ausschließlich System-Fonts, keine Google Fonts (siehe FONTS.md).
- **GitHub Pages Hosting:** unverändert korrekt in Datenschutz dokumentiert.

**Funktion & Optik (vollständiger erneuter Durchlauf):** Kein weiterer Fund. JavaScript-Syntax fehlerfrei geprüft, Datenmodell, Filter- und Renderlogik konsistent, alle referenzierten Dateien/IDs vorhanden. Einziger optischer Hinweis: Die Standard-OSM-Kacheln sind etwas farbintensiver/detailreicher als der vorherige CARTO-„Voyager"-Stil – der bestehende Dark-Mode-Filter (`saturate/brightness/contrast`, kein Invert) sollte weiterhin gut funktionieren, eine kurze Sichtprüfung nach dem Upload wird empfohlen, da hier keine Kachel-Vorschau ohne Netzwerkzugriff möglich war.

Cache-Version auf v16 erhöht.

## Nachtrag 16 (Claude, 03.08.2026) – Icon randlos & etwas heller

Auf Jans Wunsch das App-/Homescreen-Icon (icon-32/180/192/512.png) überarbeitet: Bisher lag die eigentliche Grafik (Motiv mit eigenen abgerundeten Ecken) mit deutlichem transparentem Rand mittig auf der 512×512-Fläche – dadurch erschien beim automatischen iOS-Zuschnitt ein sichtbarer "Rahmen" um ein kleineres, eigenständig abgerundetes Icon. Behoben durch: zentrierten, komplett deckenden Bildausschnitt (ohne die eingebauten abgerundeten Ecken und ohne Transparenz-Rand) auf volle Kantenlänge hochskaliert, sodass das Motiv randlos bis zum Rand reicht – iOS rundet die Ecken jetzt selbst sauber ab. Zusätzlich Helligkeit um ca. 14% erhöht. Alle vier Icon-Größen aus einem gemeinsamen Master neu erzeugt, `manifest.json` unverändert (kein `maskable`-Purpose gesetzt, daher unproblematisch für randlose Icons).

## Nachtrag 15 (Claude, 02.08.2026) – Funktions- und Optik-Feinschliff

Auf Jans Wunsch die zuvor vorgeschlagenen Politur-Punkte umgesetzt:

1. **Enter-Taste bei der Ortssuche** löst jetzt die Suche aus (vorher nur per Klick auf „Suchen").
2. **Ladeanzeige beim GPS-Button:** „📍 Mein Standort" zeigt während der GPS-Abfrage „⏳ Suche GPS..." und ist währenddessen deaktiviert, statt kommentarlos zu warten.
3. **Radius-Auto-Zoom:** Karte fittet sich per `fitBounds` automatisch auf den Radius-Kreis, sowohl beim Schieberegler als auch bei Standort/Ortssuche – vorher blieb der Kartenausschnitt bei großem Radius zu eng.
4. **Mehrere Fotos pro Ort (bis zu 3):** Datenmodell von einzelnem String auf Array umgestellt, inkl. automatischer Migration bestehender `localStorage`-Daten beim ersten Laden (kein Datenverlust für Nutzer der alten Version). Jedes Foto einzeln löschbar.
5. **„🔗 Alle Favoriten teilen":** Neuer Button, teilt eine einfache Namensliste der eigenen Favoriten über die Web-Share-API bzw. Zwischenablage als Fallback – kein neuer Rechtspunkt, keine Datenübertragung an Dritte.
6. **Druckansicht zeigt jetzt das erste Foto** je favorisiertem Ort mit.
7. **Barrierefreiheit:** `aria-label` für reine Icon-Elemente ergänzt (Favoriten-Herz, Foto-löschen, Vollbild-, Theme-, Standort- und Klapp-Buttons) – Sichtbare Texte an den übrigen Buttons blieben unverändert.
8. **Leerer Zustand** („Kein ruhiger Ort im Radius") hat jetzt ein kleines Icon statt reinem Fließtext.
9. Anleitung und README an die neuen Funktionen angepasst. Cache-Version auf v13 erhöht.

JavaScript-Syntax nach allen Änderungen erneut fehlerfrei geprüft. Rechtlich/lizenztechnisch keine Auswirkungen – alle neuen Funktionen laufen rein clientseitig ohne neue externe Dienste.

## Nachtrag 14 (Claude, 02.08.2026) – Finaler Check vor GitHub-Upload

Ganzheitliche Abschlussprüfung (Recht, Lizenzen, Funktion, Optik) vor dem geplanten Upload:

1. **Sicherheitslücke behoben – XSS über Live-OSM-Suche:** Namen/Texte von Overpass-Ergebnissen (frei editierbare OSM-Daten) wurden bisher ungefiltert per `innerHTML` in Listenkarten, Kartenmarker-Popup und Druckansicht eingefügt. Theoretisch hätte jemand einen OSM-Ort mit HTML/JS im Namen taggen können, das dann im Browser eines Nutzers ausgeführt worden wäre, sobald dieser die Live-Suche nutzt. Behoben durch eine `esc()`-Funktion, die alle aus OSM stammenden bzw. dynamisch aus Nutzerdaten kommenden Texte (Name, Warum-Text, Tags, Geschichte, Regeln, Anreise, eigene Notiz) vor dem Einfügen ins DOM escaped. Cache-Version auf v12 erhöht.
2. **README.md aktualisiert:** Stimmungs-/Komfort-Filterliste und Beispiel-Overpass-Query im README waren seit Nachtrag 12/13 veraltet (alte Bank-Abfrage, fehlendes "Picknick", "Bank mit Lehne" nicht mehr existent) – jetzt an den tatsächlichen Code angeglichen.
3. **Unbenutzte Dateien entfernt:** `icon.png` und `ruhige-orte-icon.png` lagen im Repo, wurden aber nirgends referenziert – entfernt, um das Repo sauber zu halten.
4. **Sonst keine neuen Funde:** Impressum/Datenschutz weiterhin vollständig mit echten Kontaktdaten, alle externen Dienste korrekt offengelegt, Lizenzen (MIT eigener Code, BSD Leaflet, ODbL OSM-Daten, System-Fonts ohne Google Fonts) unverändert korrekt, JavaScript-Syntax fehlerfrei geprüft.

Offen bleibt weiterhin ausschließlich der reale Gerätetest durch Jan selbst (Kapitel 5).

## Nachtrag 13 (Claude, 27.07.2026) – Teilen-Bug, Favoriten, Overpass-Zuverlässigkeit, Filter-Neuaufstellung

1. **Teilen zeigte immer die Favoriten-Frage:** Der Teilen-Button war bei OSM-Orten fest mit "Zu Favoriten speichern?" verdrahtet – echtes Teilen war dort gar nicht möglich. Aufgetrennt: "🔗 Teilen" teilt jetzt immer wirklich (bei OSM-Orten über einen OpenStreetMap-Kartenlink, da die interne ID nur temporär existiert), "⭐ Merken" ist ein neuer, eigener Button nur bei OSM-Orten zum Favorisieren.
2. **Favoriten jetzt radius-/filterunabhängig:** "❤️ Meine Orte" zeigt ab sofort ausnahmslos alle gespeicherten Favoriten, auch außerhalb des eingestellten Radius und unabhängig von STIMMUNG/KOMFORT/Suchbegriff.
3. **Overpass-Fehler reduziert:** Bench-Abfrage (aufwendigster Teil der Anfrage) entfernt, dadurch einfachere/schnellere Query. Zusätzlich zwei weitere öffentliche Overpass-Spiegelserver (`overpass.kumi.systems`, `overpass.private.coffee`) als automatischer Fallback ergänzt, falls der Hauptserver überlastet ist. Datenschutzerklärung und Bestätigungsdialog entsprechend aktualisiert (mehrere mögliche Empfänger).
4. **Filter-Farben jetzt theme-unabhängig:** Inaktive/aktive Filter-Buttons sehen in Hell- und Dunkelmodus jetzt identisch aus (feste Farbwerte statt themenabhängiger Variablen) – klarer Kontrast in beiden Modi.
5. **"Bank"/"Bank mit Lehne" vollständig entfernt** – aus Tag-Anzeige, Ortsdaten (`access.bankMitLehne` gelöscht) und Live-Suche (Bank-Abfrage entfernt), nicht nur versteckt wie in Nachtrag 12.
6. **Je 5 Stimmungs- und Komfortfilter:**
   - STIMMUNG: Lesen, Durchatmen, Mit Kind, Mit Hund, **Picknick** (neu, bei 5 park-/wiesenartigen Orten ergänzt)
   - KOMFORT: Stufenlos, <300m, **Parkplatz** (neu), **Schattig** (neu), **Digital Detox** (neu)
   - Wichtig: Die drei neuen Komfortfelder wurden ehrlich aus bereits vorhandenen Texten abgeleitet (Parkplatz: Wort "Parkplatz" im Anreise-Text; Schattig: "Schatten" in den Tags; Digital Detox: "Handy-Empfang" in den Tags) – keine erfundenen Fakten zu den echten Orten. Bei der Live-Suche (OSM) sind diese drei Felder mangels verlässlicher OSM-Daten defensiv auf `false` gesetzt.
   - Beide Filtergruppen starten komplett aktiv (dunkel), Abwählen schließt gezielt aus, Ergebnisliste reagiert sofort.
7. **Buttons harmonisiert:** Einheitliche Pill-Farben (siehe Punkt 4) sorgen für ein durchgängiges, gleichmäßiges Erscheinungsbild.
8. **Pinch-Zoom der Seite deaktiviert:** `maximum-scale=1, user-scalable=no` in allen fünf Seiten ergänzt, zusätzlich `touch-action:manipulation` gegen Doppeltipp-Zoom. Der Zoom der Karte selbst (Leaflet, eigene Bedienelemente) ist davon nicht betroffen.

Cache-Version auf v11 erhöht.

## Nachtrag 12 (Claude, 27.07.2026) – Buttons, Farbe zurück, Filterlogik, Cafés, Zuverlässigkeit

1. **"Auf Karte tippen" entfernt** – Standort (GPS) und Ortssuche reichen aus.
2. **Farbschema zurück auf den Stand vor Nachtrag 11** – die dortige Abdunkelung/Blau-Verstärkung wurde von Jan nicht gewünscht.
3. **Kartenkacheln natürlicher** – Sättigungs-/Kontrast-Filter stark reduziert, näher am unverfälschten CARTO-Voyager-Look (Referenzbild von Jans anderer App).
4. **Filterlogik überarbeitet:** STIMMUNG und KOMFORT starten jetzt beide komplett aktiv (dunkel markiert) – entspricht "alles sichtbar". Abwählen eines Kriteriums macht den Button heller und schränkt die Ergebnisliste sofort ein. Dafür musste die KOMFORT-Logik von UND auf ODER umgestellt werden (sonst hätte "alles aktiv" bei UND-Verknüpfung fast nichts mehr angezeigt).
5. **Cafés & Eisdielen in der Live-Suche ergänzt** – zusätzliche Overpass-Abfrage nach `amenity=cafe`/`amenity=ice_cream`. Rechtlich unproblematisch: gleiche Datenquelle (OSM/Overpass), gleiche ODbL-Lizenz und gleiches Opt-in-Verfahren wie die bestehende Live-Suche, kein neuer Rechtspunkt. Button-Text und Datenschutz-/Anleitungstext entsprechend angepasst.
6. **Teilen/Auf-Karte-zeigen zuverlässiger:** `sharePlace` hat jetzt einen echten letzten Fallback (Eingabedialog mit dem Link), falls weder Web-Share noch Zwischenablage funktionieren – vorher konnte das in manchen Browsern lautlos fehlschlagen. `focusOnMap` löst Kartenzentrierung/Popup jetzt sofort aus statt zeitversetzt an eine Scroll-Animation gekoppelt zu sein (vorheriges festes 350ms-Timeout konnte auf langsameren Geräten zu früh greifen).

Cache-Version auf v10 erhöht.

## Nachtrag 11 (Claude, 27.07.2026) – Karten-Link, Linkprüfung, Farbschema

1. **"Bank mit Lehne" zu dominant:** Bei ~90% der Orte vorhanden und lenkte optisch ab. Aus der sichtbaren Tag-Anzeige entfernt; der KOMFORT-Filter "🪑 Bank mit Lehne" funktioniert unverändert (eigenes Datenfeld, unabhängig von der Tag-Anzeige).
2. **Kaputter Karten-Link gefunden:** Bei per Live-Suche gefundenen OSM-Orten stand im Anreise-Feld der Text "In Karte ansehen" — sah wie ein Link aus, war aber nur einfacher Text ohne Funktion. Text entschärft, stattdessen bei jedem Ort (nicht nur OSM) ein echter, funktionierender Button "📍 Auf Karte zeigen" ergänzt: scrollt zur Karte, zentriert und öffnet das Popup des Ortes.
3. **Alle Links geprüft:** Interne Verlinkungen zwischen Start/App/Anleitung/Impressum/Datenschutz funktionieren, Ziel-Dateien alle vorhanden. Externe Rechts-Links (Nominatim-Nutzungsbedingungen stichprobenartig online verifiziert) sind aktuell und korrekt.
4. **Vollbild-Karte erneut geprüft:** Schließen-Mechanismus (Nachtrag 4/7) nach allen Umbauten weiterhin intakt und korrekt verdrahtet.
5. **Farben kräftiger/dunkler:** Grundpalette in Hell- und Dunkelmodus abgedunkelt, Blautöne (Primär-/Akzentfarbe) deutlich kräftiger/gesättigter. Kartenkacheln ebenfalls dunkler und farbintensiver (Sättigung 1.45 statt 1.25), zusätzlich Retina-Kacheln aktiviert (`detectRetina`) für schärfere Darstellung auf dem iPhone.

Zu Punkt 6 (Kartenfarbe/-qualität "wie in Keysglade"): Keysglade läuft als komplett eigenständige App in einem anderen Chat-Verlauf, der Code lag hier nicht vor — es wurde daher nach denselben Prinzipien (farbig, hochauflösend, kräftig) nachgezogen, aber nicht Pixel-für-Pixel übernommen. Cache-Version auf v9 erhöht.

## Nachtrag 10 (Claude, 27.07.2026) – Bottom-Bar entfernt, Schriftgrößen vergrößert

Jan fand die fixierte Statusleiste ganz unten (Ergebniszahl + rohe GPS-Koordinaten) unklar. Entfernt; die Ergebniszahl steht jetzt als einfache Überschrift direkt über der Liste, die rohen Koordinaten (wenig hilfreich für den Nutzer) sind ganz weggefallen.

Zusätzlich alle Schriftgrößen app-weit moderat vergrößert und aneinander angeglichen (Fließtext, Labels, Buttons, Eingabefelder, Tag-Badges, Anleitungsseite) – Verhältnisse zueinander blieben erhalten. Eingabefelder liegen jetzt bei 16px, was auf iOS zusätzlich verhindert, dass Safari beim Fokussieren automatisch hineinzoomt. Cache-Version auf v8 erhöht.

## Nachtrag 9 (Claude, 27.07.2026) – Start/Anleitung-Buttons unterschiedlich gefärbt

Ursache: Die `.pill`-Klasse setzte keine explizite Textfarbe. Bei `<button>`-Elementen fiel das nicht auf, aber die neuen `<a class="pill">Start</a>`/`<a class="pill">Anleitung</a>`-Links (Nachtrag 7) zeigten dadurch die Browser-Standard-Linkfarbe (Blau) statt der Theme-Textfarbe. Die Fußzeile unten nutzte zusätzlich eine ganz andere Darstellung (reiner Textlink statt Pill-Button). Behoben: `.pill` setzt jetzt `color`+`text-decoration:none` explizit, und die Fußzeile nutzt dieselben Pill-Buttons wie die obere Navigationszeile – Start/Anleitung/Impressum/Datenschutz sehen jetzt überall identisch aus. Cache-Version auf v7 erhöht.

## Nachtrag 8 (Claude, 27.07.2026) – Kartenfarbe Dunkelmodus vereinheitlicht

Jan wollte im Dunkelmodus dieselbe farbige Karte wie im Normalmodus, nur insgesamt minimal dunkler – der bisherige Invert/Hue-Rotate-Trick (Nachtrag 7) hatte die Farben zu stark verschoben. Entfernt; beide Modi nutzen jetzt denselben Filter (Sättigung/Kontrast identisch), der Dunkelmodus lediglich mit etwas niedrigerer Helligkeit (0.88 statt 0.98). Cache-Version auf v6 erhöht.

## Nachtrag 7 (Claude, 27.07.2026) – Horizontales Verschieben, Kartenfarben, Buttons, Struktur

Jan meldete mehrere Punkte, alle in `index.html`/`app.html`/`anleitung.html` behoben:

1. **Seite verschiebt sich horizontal:** Die drei dekorativen Hintergrund-Kreise waren einzeln `position:fixed` mit teils negativen Versätzen (bis zu 420px breit) – auf iOS Safari können solche Elemente beim elastischen Überscrollen kurz sichtbar werden und einen horizontalen Schlenker verursachen. Behoben: Alle drei Kreise stecken jetzt in einem gemeinsamen, strikt `overflow:hidden` geclippten Fixed-Container; zusätzlich `max-width:100%` auf `html`/`body`.
2. **Karte zu grau/zu dunkel:** Die bisherigen CARTO-Stile „Positron"/„Dark Matter" sind bewusst puristisch grau gehalten. Umgestellt auf den farbigen CARTO-„Voyager"-Stil (Parks grün, Wasser blau) für beide Modi; der Dunkelmodus nutzt jetzt einen CSS-Farbumkehr-Filter (`invert`+`hue-rotate`) auf denselben farbigen Kacheln statt eines zweiten, grauen Kachel-Sets – dadurch bleibt auch der Dunkelmodus farbig statt neutral-grau.
3. **Buttons plastischer:** Alle Buttons (Pills, Haupt-Button, Theme-Button, Navigationskarten) haben jetzt ein oberes Glanzlicht, eine Boden-Schattenkante und einen echten Drück-Effekt beim Antippen (verschieben sich beim Tap sichtbar nach unten), statt nur flach zu skalieren.
4. **Start/Anleitung sofort sichtbar:** In `app.html` stand die Navigation zu Start/Anleitung bisher nur ganz unten unter der kompletten Orte-Liste. Jetzt zusätzlich als kompakte Zeile direkt unter dem Header, ohne Scrollen erreichbar.
5. **Seite nach Themen geclustert, kürzer scrollbar:** Die Bereiche „Standort & Suche" und „Filter & Aktionen" sind jetzt aufklappbare Cluster, die per Button ein-/ausgeklappt werden (Standard: eingeklappt) – die Karte ist dadurch gleich nach dem Header sichtbar, ohne durch die volle Filtermaske scrollen zu müssen.

Keine neuen externen Dienste, keine neuen Rechtsfragen – nur CSS/Markup/UX. Cache-Version in `sw.js` auf v5 erhöht.
