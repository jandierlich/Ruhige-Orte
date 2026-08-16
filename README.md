# Ruhige Orte – Deutschlandweit stille Plätze finden

**Ruhige Orte** ist eine 100% kostenlose, anonyme PWA zum Finden wirklich ruhiger Plätze in Deutschland – ohne Tracking, ohne Backend, ohne Cookies.

Live Demo: `https://deinname.github.io/ruhige-orte/`

## ✨ Features – 10/10 Version

- **📍 Standort:** GPS nur im Browser, Auf Karte tippen, oder Ort eingeben (Nominatim nur nach Klick, opt-in)
- **📏 Radius:** 1-20 km frei wählbar
- **🎯 Ortstyp-Filter:** Ein Button pro Kategorie (Aussichtspunkt, Park, Quelle, Café, Eisdiele, Restaurant, Strand/Seeufer, Picknickplatz, Naturschutzgebiet), alle starten aktiv
- **📍 Details je Ort:** Genaue Entfernung vom Standort, weicher Stimmungs-Hinweis, Barrierefreiheit laut OSM (wenn hinterlegt)
- **🕐 Beste Zeit:** Matrix morgens/mittags/abends/Wochenende grün/gelb/rot
- **❤️ Favoriten + Notizen:** Nur localStorage, 100% DSGVO safe
- **🔇 Ruhe-Check:** 1-5 Slider, speichert lokal mit Zeitstempel
- **🌅 Goldene Stunde:** Lokal berechnet (kein API-Call), je Ort
- **🌦️ Wetter (optional):** Live-Abruf via Open-Meteo, nur nach Klick + Consent
- **📷 Fotos zur Notiz:** Bis zu 3 eigene Fotos pro Ort, lokal gespeichert (automatisch verkleinert)
- **⬇️⬆️ Backup:** Export/Import aller lokalen Daten als JSON
- **🖨️🔗 Druckansicht & Teilen:** Eigene Favoriten als druckbare Liste (inkl. Foto) oder als Namensliste teilen
- **📡 Teiloffline:** Service Worker cached die App-Shell; gemerkte Orte, Favoriten, Notizen & Fotos bleiben offline sichtbar (neue Live-Suche braucht Internet)
- **🔗 Teilen:** Link wie `#osm_123456` – kein Server
- **🌓 Hell/Dunkel:** System-Auto + manueller Toggle, speichert lokal
- **⛶ Kartenvollbild:** Mit Escape-Taste zum Schließen
- **📱 iPhone optimiert:** 440px max, 100dvh, safe-area, Bottom-Sheet, 44px Touch-Targets

## 🔍 Ausschließlich Live-Ergebnisse (OSM)

Diese App hat **keine feste, vorgefertigte Orte-Liste**. Alle Orte kommen live von der Overpass API (OpenStreetMap) für den aktuellen Kartenausschnitt – Parks, Aussichtspunkte, Quellen, Cafés, Eisdielen, Restaurants, Seeufer/Strände, Picknickplätze, Naturschutzgebiete. Nutzer können einzelne Treffer per „⭐ Merken" dauerhaft lokal speichern; diese bleiben dann auch offline sichtbar.

## 🚀 Auf GitHub Pages veröffentlichen

1. Neues Repo `ruhige-orte` erstellen (public)
2. Diese Dateien hochladen: `index.html`, `app.html`, `anleitung.html`, `sw.js`, `impressum.html`, `datenschutz.html`, `manifest.json`, `icon-32.png`, `icon-180.png`, `icon-192.png`, `icon-512.png`, `README.md`, `LICENSE`, `IMPRESSUM.md`
3. Settings → Pages → Source: `main` / `root` → Save
4. Fertig: `https://deinname.github.io/ruhige-orte/`

Kein Build, kein npm, keine API Keys.


### 🔧 Overpass Query selbst anpassen (Schutzhütten, Picknicktische etc.)

Die Live-Suche nutzt diese Query (in `app.html`, Funktion `fetchOverpass`):

```
[out:json][timeout:20];
(
  node["tourism"="viewpoint"]({{bbox}});
  way["leisure"="park"]["access"!="private"]({{bbox}});
  node["natural"="spring"]({{bbox}});
  node["amenity"="cafe"]({{bbox}});
  node["amenity"="ice_cream"]({{bbox}});
  node["natural"="beach"]({{bbox}});
  way["natural"="beach"]({{bbox}});
  node["tourism"="picnic_site"]({{bbox}});
  way["leisure"="nature_reserve"]({{bbox}});
  node["amenity"="restaurant"]({{bbox}});
);
out center 30;
```

**So erweiterst du sie – Beispiele:**

Schutzhütten dazu:
```
node["amenity"="shelter"](${bbox});
```

Picknicktische:
```
node["leisure"="picnic_table"](${bbox});
```

Grillplätze (oft ruhig außerhalb Saison):
```
node["leisure"="bbq"](${bbox});
```

Kapellen / Wegkreuze (oft sehr still):
```
node["historic"="wayside_cross"](${bbox});
node["building"="chapel"](${bbox});
```

Komplettes Beispiel mit allem:
```
[out:json][timeout:15];
(
  node["amenity"="bench"]["backrest"="yes"]({{bbox}});
  node["tourism"="viewpoint"]({{bbox}});
  node["amenity"="shelter"]({{bbox}});
  node["leisure"="picnic_table"]({{bbox}});
  node["historic"="wayside_cross"]({{bbox}});
);
out center 30;
```

**Regeln für Fair-Use:**
- Immer `{{bbox}}` drin lassen (nur aktueller Ausschnitt)
- `out 30` – max 30 Ergebnisse
- Nicht `out` ohne Limit
- Kein `{{bbox}}` weglassen und ganz Deutschland abfragen – wird geblockt

Quelle: https://dev.overpass-api.de/overpass-doc/

## 🛠️ Lokal entwickeln

Einfach `index.html` im Browser öffnen (Startseite verlinkt zur App). Alles passiert lokal.

Karten: Leaflet + CartoDB Positron (hell) / Dark Matter (dunkel)
Suche: Nominatim (nur nach Klick, mit Consent-Hinweis)

## 📜 Rechtlich & Lizenzen

- **Code:** MIT License – siehe LICENSE
- **Karten:** © OpenStreetMap contributors, ODbL License, Kartenkacheln von tile.openstreetmap.org
- **Suche:** Nominatim – Nutzung nur opt-in, es gelten OSM Nutzungsbedingungen https://operations.osmfoundation.org/policies/nominatim/
- **Keine Cookies, kein Tracking, kein Backend.** Standort verbleibt nur im Browser. Keine Datenübertragung an Server.
- **Impressumspflicht in DE:** `impressum.html` und `datenschutz.html` sind aus der App heraus verlinkt (Footer-Card) und bereits mit den Kontaktdaten aus IMPRESSUM.md befüllt. `IMPRESSUM.md` bleibt die Text-Quelle im Repo, ausschlaggebend für Besucher sind die verlinkten HTML-Seiten.

## 🤝 Beitragen

Orte hinzufügen: `places` Array in `app.html` erweitern (Format siehe bestehende Orte). Pull Request oder Issue.

Orts-Vorschlag Format:
```json
{
  "id":"kurzname",
  "name":"Name",
  "lat": 52.5,
  "lon": 13.4,
  "why": "Warum ruhig in 1 Satz",
  "tags": ["Bank mit Lehne","viel Schatten"],
  "moods": ["Lesen","Durchatmen"],
  "access": {"stufenlos": true, "bankMitLehne": true, "kurz": true},
  "regeln": "NSG – Wege nicht verlassen",
  "geschichte": "1-2 Sätze Geschichte",
  "anreise": "Rad/Parkplatz/ÖPNV",
  "best": {"morgens":"grün","mittags":"gelb","abends":"grün","wochenende":"rot"}
}
```

## 📸 PWA Installieren

Auf iPhone/Android im Browser: Teilen → Zum Home-Bildschirm hinzufügen. Funktioniert offline (App Shell).

---
Gebaut mit 💙 für mehr Ruhe in Deutschland.
