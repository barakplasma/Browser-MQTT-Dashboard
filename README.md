# 📊 Browser MQTT Dashboard

A real-time IoT sensor data dashboard that runs entirely in your browser. Connects to MQTT brokers, receives sensor data from Tasmota ESP8266 devices, and visualizes the data with interactive charts and live data tables.

**No backend required** — everything happens client-side in the browser using indexed storage for persistence.

## ✨ Features

- **Real-time visualization**: Live streaming data with auto-scrolling charts
- **Multiple sensors**: Display gas resistance, temperature, and humidity simultaneously
- **Data persistence**: Stores sensor readings in browser's IndexedDB
- **Interactive UI**: Responsive dashboard with sortable data tables
- **MQTT support**: Works with any MQTT 3.1.1 broker (configured for EMQX by default)
- **Zero dependencies**: Pure JavaScript with lightweight CDN libraries

## 🚀 Quick Start

**Live Dashboard:**
- 🌐 [Main Dashboard](https://barakplasma.github.io/Browser-MQTT-Dashboard/) (GitHub Pages - **Recommended**)
- 📝 [JSFiddle Demo](https://jsfiddle.net/barakplasma/4r5gzjkh/)

## 🔧 Configuration

Edit `Demo/demo.js` to customize:
- **Broker URL** (line 21): Change the MQTT broker endpoint
- **Topic** (line 34): Subscribe to different sensor topics
- **Chart options** (lines 65-78): Adjust display duration and refresh rate

Example:
```javascript
// Connect to your MQTT broker
client.subscribe("tele/your_device/SENSOR")
```

## 📡 Data Format

Expects JSON payloads with this structure:
```json
{
  "Time": "2024-04-15T10:30:45",
  "Gas": 50000,
  "Temperature": 22.5,
  "Humidity": 45.2,
  "BME680": {
    "Resistance": 50000
  }
}
```

## 📚 Technologies

- [MQTT.js](https://github.com/mqttjs/MQTT.js) — MQTT client
- [Chart.js](https://www.chartjs.org/) — Data visualization
- [Luxon](https://moment.github.io/luxon/) — Date/time handling
- [MVP.css](https://andybrewer.github.io/mvp/) — Minimal styling

## 📝 License

Licensed under the MIT License - see [LICENSE](./LICENSE) file for details.
