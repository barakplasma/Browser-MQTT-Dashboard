Chart.register(ChartStreaming);

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
  },
}

const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', options);
client.on('error', (err) => {
  console.log('Connection error: ', err)
  client.end()
})

client.on('reconnect', () => {
  console.log('Reconnecting...')
})

client.on('connect', () => {
  console.log('Client connected:' + clientId)
  // Subscribe
  client.subscribe("tele/tasmota_145ABA/SENSOR")
})

client.on("message", function(topic, payload) {
  console.log([topic, payload].join(": "));

  onReceive(JSON.parse(payload))
})

var ctx = document.getElementById('myChart').getContext('2d');

var myChart = new Chart(ctx, {
  type: 'line', // 'line', 'bar', 'bubble' and 'scatter' types are supported
  data: {
    datasets: [{
        label: "BME680 Gas Resistance",
        backgroundColor: 'red',
        data: [] // empty at the beginning
      },
      {
        label: "Temperature",
        backgroundColor: 'green',
        data: [] // empty at the beginning
      },
      {
        label: "Humidity",
        backgroundColor: 'blue',
        data: [] // empty at the beginning
      }
    ]
  },
  options: {
    scales: {
      x: {
        type: 'realtime', // x axis will auto-scroll from right to left
        realtime: { // per-axis options
          duration: 6e6,
          delay: 1e4, // delay of 1000 ms, so upcoming values are known before plotting a line
          pause: false, // chart is not paused
          ttl: undefined, // data will be automatically deleted as it disappears off the chart
          frameRate: 30, // data points are drawn 30 times every second
        }
      }
    }
  }
});

function addDataToChart(row) {
  let created = new Date(row.Time + ".00+01:00");

  // append the new data to the existing chart data
  myChart.data.datasets[0].data.push({
    x: created,
    y: row.Gas
  });
  myChart.data.datasets[1].data.push({
    x: created,
    y: row.Temperature
  });
  myChart.data.datasets[2].data.push({
    x: created,
    y: row.Humidity
  });
}

// your event listener code - assuming the event object has the timestamp and value properties
function onReceive(event) {
  const created = Date.now();

  addDataToChart(event);

  const data = {

    ...event,

    ...event.BME680,

    created,

  }

  delete data.BME680;

  db.transaction(["data"], "readwrite").objectStore("data")
    .add(data);

  addRowToTable(data)

  // update chart datasets keeping the current animation
  myChart.update('quiet');
}

var db;

var openRequest = indexedDB.open("idbsensor", 1);

openRequest.onupgradeneeded = function(e) {
  var thisDB = e.target.result;

  console.log("running onupgradeneeded");

  if (!thisDB.objectStoreNames.contains("data")) {
    var os = thisDB.createObjectStore("data", {
      autoIncrement: true
    });
    os.createIndex("created", "created", {
      unique: false
    });
  }
}

function addRowToTable(row) {

  let newRow = document.createElement('tr');

  let time = document.createElement('td');

  time.innerText = row.Time;

  let gas = document.createElement('td');

  gas.innerText = row.Gas;

  let temp = document.createElement('td');

  temp.innerText = row.Temperature;

  let hum = document.createElement('td');

  hum.innerText = row.Humidity;

  newRow.appendChild(time)

  newRow.appendChild(gas)

  newRow.appendChild(temp)

  newRow.appendChild(hum)

  insertAfter(newRow, document.querySelector('table tr'))
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

openRequest.onsuccess = function(e) {
  console.log("running onsuccess");

  db = e.target.result;

  let allData = db.transaction("data", "readonly").objectStore("data").getAll();

  allData.onsuccess = function() {
    console.table(allData.result);
    allData.result.forEach(addDataToChart);
    allData.result.forEach(addRowToTable)
  };
}

openRequest.onerror = function(e) {
  //Do something for the error
}
