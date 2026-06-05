Analyze historical BME680 sensor data from S3 and describe it in natural language.

## Setup

Ensure DuckDB venv exists with required packages:
```bash
if [ ! -f /tmp/duckdb-env/bin/python ]; then
  uv venv --clear /tmp/duckdb-env && uv pip install --python /tmp/duckdb-env duckdb boto3 "botocore[crt]"
fi
```

## Queries

Run this Python script using `/tmp/duckdb-env/bin/python`:

```python
import duckdb, boto3, json

# boto3 credential chain handles SSO, env vars, instance profile, etc.
session = boto3.Session()
creds = session.get_credentials().get_frozen_credentials()

con = duckdb.connect()
con.execute("LOAD httpfs")
con.execute(f"""
  SET s3_region='il-central-1';
  SET s3_access_key_id='{creds.access_key}';
  SET s3_secret_access_key='{creds.secret_key}';
  SET s3_session_token='{creds.token or ""}';
""")

BUCKET = "s3://iot-pipeline-tasmota-172952816010/tasmota/**/*.parquet"
VALID  = "WHERE time::TIMESTAMP > '2026-01-01'"

# Summary stats
summary = con.execute(f"""
  SELECT count(*), min(time::TIMESTAMP)::VARCHAR, max(time::TIMESTAMP)::VARCHAR,
    round(avg(temperature),1), round(min(temperature),1), round(max(temperature),1),
    round(avg(humidity),1),    round(min(humidity),1),    round(max(humidity),1),
    round(avg(pressure),1),    round(min(pressure),1),    round(max(pressure),1),
    round(avg(gas_resistance),0), round(min(gas_resistance),0), round(max(gas_resistance),0)
  FROM read_parquet('{BUCKET}') {VALID}
""").fetchone()
keys = ["readings","first","last",
        "temp_avg","temp_min","temp_max",
        "hum_avg","hum_min","hum_max",
        "pres_avg","pres_min","pres_max",
        "gas_avg","gas_min","gas_max"]
print("SUMMARY:", json.dumps(dict(zip(keys, summary))))

# Daily averages
daily = con.execute(f"""
  SELECT strftime(time::TIMESTAMP,'%Y-%m-%d') AS day,
    round(avg(temperature),1) AS temp,
    round(avg(humidity),1)    AS hum,
    round(avg(gas_resistance),0) AS gas,
    count(*) AS n
  FROM read_parquet('{BUCKET}') {VALID}
  GROUP BY 1 ORDER BY 1
""").fetchall()
print("DAILY:", json.dumps([{"day":r[0],"temp":r[1],"hum":r[2],"gas":r[3],"n":r[4]} for r in daily]))

# Today hourly
today = con.execute(f"""
  SELECT strftime(time::TIMESTAMP,'%H:00') AS hour,
    round(avg(temperature),1) AS temp,
    round(avg(humidity),1)    AS hum,
    round(avg(gas_resistance),0) AS gas
  FROM read_parquet('{BUCKET}')
  WHERE time::TIMESTAMP >= current_date
  GROUP BY 1 ORDER BY 1
""").fetchall()
print("TODAY:", json.dumps([{"hour":r[0],"temp":r[1],"hum":r[2],"gas":r[3]} for r in today]))

# Temperature anomalies (>2 stddev)
anomalies = con.execute(f"""
  WITH stats AS (
    SELECT avg(temperature) AS mu, stddev(temperature) AS sd
    FROM read_parquet('{BUCKET}') {VALID}
  )
  SELECT time, round(temperature,1) AS temp, round(humidity,1) AS hum
  FROM read_parquet('{BUCKET}'), stats {VALID}
  AND abs(temperature - mu) > 2 * sd
  ORDER BY abs(temperature - mu) DESC LIMIT 10
""").fetchall()
print("ANOMALIES:", json.dumps([{"time":str(r[0]),"temp":r[1],"hum":r[2]} for r in anomalies]))
```

## Output

After running the queries, synthesize into a natural language report:

1. **Overview**: total readings, date range, any data gaps (days with low `n`)
2. **Temperature**: range, 3-day trend (rising/stable/falling), peak and when
3. **Humidity**: range, correlation with temp if notable, extremes
4. **Air quality** (gas_resistance Ω): higher = cleaner; describe trend, identify worst/best days
5. **Pressure**: range and notable swings
6. **Today so far**: hourly pattern from TODAY data
7. **Anomalies**: call out outliers with context

If $ARGUMENTS includes `--chart`, also print ASCII sparklines (▁▂▃▄▅▆▇█) for daily temperature and humidity using the DAILY data.
