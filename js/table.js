const tableBody = document.getElementById('tableBody')

export function updateTable(data) {
  if (!data.temperatures || data.temperatures.length === 0) {
    tableBody.innerHTML = '<tr class="empty-state"><td colspan="4">Waiting for data...</td></tr>'
    return
  }

  // Build rows from the most recent data
  const rows = []
  const lastIndex = data.temperatures.length - 1

  // Show last 50 rows
  const startIndex = Math.max(0, lastIndex - 49)

  for (let i = lastIndex; i >= startIndex; i--) {
    const timestamp = data.timestamps[i]
    const temperature = parseFloat(data.temperatures[i]?.[1]) || 0
    const humidity = parseFloat(data.humidities[i]?.[1]) || 0
    const gas = parseFloat(data.gases[i]?.[1]) || 0

    const timeStr = new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
    const gasStr = gas >= 1000 ? (gas / 1000).toFixed(2) + 'k' : gas.toFixed(0)

    rows.push(`
      <tr>
        <td>${timeStr}</td>
        <td class="gas">${gasStr}</td>
        <td class="temperature">${temperature.toFixed(1)}</td>
        <td class="humidity">${humidity.toFixed(1)}</td>
      </tr>
    `)
  }

  tableBody.innerHTML = rows.join('')
}
