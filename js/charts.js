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

function updateGasChart(gases, timestamps) {
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        if (!params.length) return ''
        const time = new Date(params[0].value[0]).toLocaleTimeString()
        const aqi = params[0].value[1]
        let quality = 'Unknown'
        let color = '#999'

        if (aqi >= 400) {
          quality = 'Excellent'
          color = '#4caf50'
        } else if (aqi >= 200) {
          quality = 'Good'
          color = '#8bc34a'
        } else if (aqi >= 100) {
          quality = 'Fair'
          color = '#ff9800'
        } else if (aqi >= 50) {
          quality = 'Poor'
          color = '#f44336'
        } else {
          quality = 'Very Poor'
          color = '#c41c3b'
        }

        return `Air Quality: <span style="color:${color};font-weight:bold">${quality}</span> (${aqi})<br>${time}`
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
      name: 'AQI',
      min: 0,
      max: 500,
      axisLabel: {
        formatter: (value) => value.toFixed(0)
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e0e0e0'
        }
      },
      markArea: {
        silent: true,
        itemStyle: {
          opacity: 0.1
        },
        data: [
          [{ value: 0 }, { value: 50 }],
          [{ value: 50 }, { value: 100 }],
          [{ value: 100 }, { value: 200 }],
          [{ value: 200 }, { value: 400 }],
          [{ value: 400 }, { value: 500 }]
        ]
      }
    },
    series: [
      {
        name: 'Air Quality Index',
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
