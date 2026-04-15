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
        formatter: (value) => new Date(value).toLocaleTimeString(),
        interval: 'auto'
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
        formatter: (value) => new Date(value).toLocaleTimeString(),
        interval: 'auto'
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
        const value = params[0].value[1]
        const formatted = value > 1000 ? (value / 1000).toFixed(2) + 'k' : value.toFixed(0)
        return `Gas Resistance: ${formatted}Ω<br>${time}`
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
        formatter: (value) => new Date(value).toLocaleTimeString(),
        interval: 'auto'
      }
    },
    yAxis: {
      type: 'value',
      name: 'Ω',
      axisLabel: {
        formatter: (value) => {
          if (value > 1000) {
            return (value / 1000).toFixed(0) + 'k'
          }
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
          color: '#ef5350'
        },
        areaStyle: {
          color: 'rgba(239, 83, 80, 0.15)'
        },
        lineStyle: {
          width: 2
        }
      }
    ]
  }

  gasChart.setOption(option)
}
