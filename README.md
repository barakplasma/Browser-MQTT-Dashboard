# 📊 Browser MQTT Dashboard v2.0

A modern, buildless real-time IoT sensor dashboard. Connects to MQTT brokers, receives sensor data from Tasmota devices, and visualizes it with interactive charts and live data tables.

**No build step required** — pure vanilla JavaScript with ES modules. Just open in a browser!

**No backend required** — everything runs client-side with local data persistence via IndexedDB.

## ✨ Features

- **Real-time visualization**: Live streaming data with smooth, responsive separate charts
- **Three independent charts**: Temperature, humidity, and gas resistance each with their own graph
- **Data persistence**: IndexedDB storage for offline access to historical data
- **Responsive design**: Works perfectly on desktop, tablet, and mobile
- **Zero build step**: Just open `index.html` in a browser or deploy to any static host
- **MQTT 3.1.1 support**: Works with any compatible broker
- **No framework overhead**: Vanilla JavaScript with modern ES modules

## 🚀 Quick Start

### Local Development
Simply open `index.html` in your browser. That's it!

Alternatively, run a simple HTTP server:
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (with http-server package)
npx http-server
```

Then visit `http://localhost:8000`

### Deploy to Vercel (Recommended)

Get instant preview URLs for every pull request:

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to [Vercel Dashboard](https://vercel.com/dashboard) for automatic deployments.

**Result:** 
- Production: `https://your-project.vercel.app`
- PR Previews: `https://your-project-pr-1.vercel.app`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment guides (GitHub Pages, Netlify, self-hosted, etc.)

### Deploy to GitHub Pages
Push this repository to GitHub and enable GitHub Pages in settings. The dashboard will be live at:
```
https://yourusername.github.io/Browser-MQTT-Dashboard/
```

## 🔧 Configuration

Edit the MQTT connection in `index.html` (search for `MqttService.connect()`):

```javascript
// Change these two parameters:
MqttService.connect(
  'wss://broker.emqx.io:8084/mqtt',  // Your MQTT broker URL
  'tele/tasmota_145ABA/SENSOR'        // Your topic
)
```

### Examples

**Default (EMQX broker):**
```javascript
MqttService.connect(
  'wss://broker.emqx.io:8084/mqtt',
  'tele/tasmota_145ABA/SENSOR'
)
```

**Home Assistant / Mosquitto:**
```javascript
MqttService.connect(
  'wss://your-home-assistant.duckdns.org:8883',
  'home/kitchen/tasmota'
)
```

**Local MQTT broker:**
```javascript
MqttService.connect(
  'ws://192.168.1.100:8080',  // Note: ws not wss for local
  'sensors/living_room'
)
```

## 📡 Expected Data Format

The dashboard expects JSON payloads from MQTT:

```json
{
  "Time": "2024-04-15T10:30:45",
  "Temperature": 22.5,
  "Humidity": 45.2,
  "Gas": 50000
}
```

Or with BME680 sensor format:
```json
{
  "Time": "2024-04-15T10:30:45",
  "Temperature": 22.5,
  "Humidity": 45.2,
  "BME680": {
    "Resistance": 50000
  }
}
```

**Required fields:**
- `Time`: ISO 8601 timestamp (or any parseable date string)
- `Temperature`: Number (°C)
- `Humidity`: Number (%)
- `Gas` OR `BME680.Resistance`: Number (Ω)

## 📂 Project Structure

```
index.html              # Main HTML file with embedded styles
js/
├── mqtt.js             # MQTT client wrapper
├── database.js         # IndexedDB persistence layer
├── charts.js           # ECharts initialization (3 separate charts)
└── table.js            # Table data rendering
```

## 🎨 UI/UX

- **Gradient background**: Modern purple gradient
- **Glassmorphism cards**: Frosted glass effect on cards
- **Three independent charts**: Each sensor gets its own visualization
- **Responsive layout**: 3-column on desktop, stacked on mobile
- **Real-time updates**: Charts and table refresh as data arrives
- **Live status indicator**: Connected/disconnected status badge

## 📚 Technologies

| Tech | Purpose |
|------|---------|
| **ECharts** | Interactive chart library (no framework) |
| **MQTT.js** | MQTT client (browser-compatible) |
| **Luxon** | Date/time handling (loaded but optional) |
| **IndexedDB** | Browser storage for persistence |
| **Vanilla JS** | No frameworks, pure ES modules |

## 💾 Data Storage

- **In-memory**: Last 500 data points (for chart performance)
- **IndexedDB**: All historical readings (browser local storage)
- **Automatic**: Each incoming MQTT message is stored
- **Manual clear**: "Clear Data" button in footer

## 🔌 MQTT Connection

The dashboard automatically:
- Connects to the specified broker
- Subscribes to your configured topic
- Handles reconnection on disconnect
- Logs connection details to console
- Shows connection status in the header badge

**Check browser console** (`F12` → Console) for connection logs and any errors.

## 📊 Charts

Each sensor has its own dedicated chart:

1. **Temperature (°C)**: Orange line chart
2. **Humidity (%)**: Blue line chart
3. **Gas Resistance (Ω)**: Red line chart

Charts update in real-time and automatically scroll to show the latest data.

## 📱 Responsive Design

- **Desktop (>1200px)**: 3-column grid layout
- **Tablet (768px-1200px)**: 2-column or responsive grid
- **Mobile (<768px)**: Single column stacked layout
- **Touch-friendly**: Larger tap targets and readable text

## 🐛 Troubleshooting

### No data appearing?
1. Check broker URL is correct and accessible
2. Verify topic name matches exactly (case-sensitive)
3. Open browser console (`F12`) to see connection errors
4. Check MQTT broker is running and accepting connections

### Connection says "Disconnected"?
1. Verify broker URL format (wss:// for secure, ws:// for local)
2. Check firewall/network allows WebSocket connections
3. For self-signed certificates, you may need to visit broker URL first to accept cert
4. Try connecting to public EMQX broker first to test

### Charts not updating?
1. Verify MQTT messages are being sent
2. Check browser console for JavaScript errors
3. Ensure JSON payload format matches expected structure

## 📝 License

Licensed under the MIT License - see LICENSE file for details.

## 🔗 Links & Resources

**Project:**
- [GitHub Repository](https://github.com/barakplasma/Browser-MQTT-Dashboard)
- [Deployment Guide](./DEPLOYMENT.md) - Vercel, GitHub Pages, Netlify, self-hosted

**Documentation:**
- [ECharts Documentation](https://echarts.apache.org/)
- [MQTT.js Repo](https://github.com/mqttjs/MQTT.js)
- [Tasmota Documentation](https://tasmota.github.io/)
- [MDN IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
