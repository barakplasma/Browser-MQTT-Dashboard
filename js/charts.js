let temperatureChart, humidityChart, gasChart

export function initCharts() {
  const temperatureContainer = document.getElementById('temperatureChart')
  const humidityContainer = document.getElementById('humidityChart')
  const gasContainer = document.getElementById('gasChart')

  temperatureChart = echarts.init(temperatureContainer)
  humidityChart = echarts.init(humidityContainer)
  gasChart = echarts.init(gasContainer)

  // Handle window resize
  window.addEventListener('resize', () => {
    temperatureChart.resize()
    humidityChart.resize()
    gasChart.resize()
  })
}

export function updateCharts(data) {
  updateTemperatureChart(data.temperatures, data.timestamps)
  updateHumidityChart(data.humidities, data.timestamps)
  updateGasChart(data.gases, data.timestamps)
}

function updateTemperatureChart(temperatures, timestamps) {
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        if (!params.length) return ''
        const time = new Date(params[0].value[0]).toLocaleTimeString()
        return `Temperature: ${params[0].value[1].toFixed(2)}°C<br>${time}`
      }
    },
    grid: {
      left: '50px',
      right: '20px',
      top: '20px',
      bottom: '40px',
      containLabel: false
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: {
        formatter: (value) => {
          const date = new Date(value)
          return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        },
        interval: 'auto',
        rotate: 45,
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      name: '°C',
      axisLabel: {
        formatter: (value) => value.toFixed(0)
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e0e0e0'
        }
      }
    },
    series: [
      {
        name: 'Temperature',
        type: 'line',
        data: temperatures,
        smooth: true,
        itemStyle: {
          color: '#ffa726'
        },
        areaStyle: {
          color: 'rgba(255, 167, 38, 0.15)'
        },
        lineStyle: {
          width: 2
        }
      }
    ]
  }

  temperatureChart.setOption(option)
}

function updateHumidityChart(humidities, timestamps) {
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        if (!params.length) return ''
        const time = new Date(params[0].value[0]).toLocaleTimeString()
        return `Humidity: ${params[0].value[1].toFixed(2)}%<br>${time}`
      }
    },
    grid: {
      left: '50px',
      right: '20px',
      top: '20px',
      bottom: '40px',
      containLabel: false
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: {
        formatter: (value) => {
          const date = new Date(value)
          return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        },
        interval: 'auto',
        rotate: 45,
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      name: '%',
      axisLabel: {
        formatter: (value) => value.toFixed(0)
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e0e0e0'
        }
      }
    },
    series: [
      {
        name: 'Humidity',
        type: 'line',
        data: humidities,
        smooth: true,
        itemStyle: {
          color: '#42a5f5'
        },
        areaStyle: {
          color: 'rgba(66, 165, 245, 0.15)'
        },
        lineStyle: {
          width: 2
        }
      }
    ]
  }

  humidityChart.setOption(option)
}

function getAirQualityFromResistance(gasOhms) {
  // Based on actual BME680 specifications (Bosch Sensortec datasheet)
  // Higher resistance = cleaner air
  if (gasOhms >= 50000) return { label: 'Excellent', color: '#4caf50' }
  if (gasOhms >= 30000) return { label: 'Good', color: '#8bc34a' }
  if (gasOhms >= 10000) return { label: 'Fair', color: '#ff9800' }
  if (gasOhms >= 5000) return { label: 'Poor', color: '#f44336' }
  return { label: 'Very Poor', color: '#c41c3b' }
}

function updateGasChart(gases, timestamps) {
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        if (!params.length) return ''
        const time = new Date(params[0].value[0]).toLocaleTimeString()
        const gasValue = params[0].value[1]
        const quality = getAirQualityFromResistance(gasValue)
        const gasDisplay = gasValue >= 1000 ? (gasValue / 1000).toFixed(1) + 'k' : gasValue.toFixed(0)

        return `Air Quality: <span style="color:${quality.color};font-weight:bold">${quality.label}</span><br>Gas Resistance: ${gasDisplay}Ω<br>${time}`
      }
    },
    grid: {
      left: '50px',
      right: '20px',
      top: '20px',
      bottom: '40px',
      containLabel: false
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: {
        formatter: (value) => {
          const date = new Date(value)
          return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        },
        interval: 'auto',
        rotate: 45,
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      name: 'Gas Resistance (Ω)',
      axisLabel: {
        formatter: (value) => {
          if (value >= 1000) return (value / 1000).toFixed(0) + 'k'
          return value.toFixed(0)
        }
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e0e0e0'
        }
      }
    },
    series: [
      {
        name: 'Gas Resistance',
        type: 'line',
        data: gases,
        smooth: true,
        itemStyle: {
          color: '#ff9800'
        },
        areaStyle: {
          color: 'rgba(255, 152, 0, 0.15)'
        },
        lineStyle: {
          width: 2
        }
      }
    ]
  }

  gasChart.setOption(option)
}
