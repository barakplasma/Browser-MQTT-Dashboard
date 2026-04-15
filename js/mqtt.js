class MqttService {
  constructor() {
    this.client = null
    this.callbacks = {
      onMessage: [],
      onConnect: [],
      onError: [],
      onDisconnect: []
    }
  }

  connect(brokerUrl = 'wss://broker.emqx.io:8084/mqtt', topic = 'tele/tasmota_145ABA/SENSOR') {
    const clientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8)

    const options = {
      keepalive: 60,
      clientId: clientId,
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
      }
    }

    this.client = mqtt.connect(brokerUrl, options)

    this.client.on('connect', () => {
      console.log('Client connected:', clientId)
      this.client.subscribe(topic, (err) => {
        if (!err) {
          this.emit('onConnect', clientId)
        }
      })
    })

    this.client.on('message', (topic, payload) => {
      try {
        const data = JSON.parse(payload.toString())
        this.emit('onMessage', data)
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    })

    this.client.on('error', (err) => {
      console.error('Connection error:', err)
      this.emit('onError', err)
    })

    this.client.on('reconnect', () => {
      console.log('Reconnecting...')
    })

    this.client.on('disconnect', () => {
      this.emit('onDisconnect')
    })
  }

  disconnect() {
    if (this.client) {
      this.client.end()
    }
  }

  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback)
    }
  }

  off(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback)
    }
  }

  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(cb => cb(data))
    }
  }

  isConnected() {
    return this.client && this.client.connected
  }
}

export default new MqttService()
