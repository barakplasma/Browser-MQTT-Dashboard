# MQTT → S3 Parquet Pipeline (Kubernetes)

Subscribes to the same Tasmota BME680 sensor topic as the Browser dashboard and
writes partitioned Parquet files to any S3-compatible object store for long-term
(365-day) retention.  No broker changes.  No sensor re-configuration.

```
Tasmota BME680
    │  JSON via MQTT (~1 msg/min)
    ▼
broker.emqx.io:1883 ──► Browser dashboard (unchanged)
    │
    └──► Vector Pod (Rust, ~30 MB RAM)
              │  mqtt source → remap → aws_s3 sink
              ▼
    s3://bucket/tasmota/year=YYYY/month=MM/day=DD/*.parquet
```

## Prerequisites

- `kubectl` configured against your cluster
- `helm` 3+
- An S3-compatible bucket (Cloudflare R2, Backblaze B2, MinIO, …)

## Deploy

### 1. Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

### 2. Secrets

Edit `k8s/secrets.yaml` — fill in your real bucket name, endpoint URL, and
access credentials — then apply:

```bash
kubectl apply -f k8s/secrets.yaml
```

> **Security note:** Add `k8s/secrets.yaml` to `.gitignore` so credentials are
> never committed.  For production, use
> [Sealed Secrets](https://github.com/bitnami-labs/sealed-secrets) or
> [external-secrets-operator](https://external-secrets.io/) instead.

### 3. Vector ConfigMap

```bash
kubectl apply -f k8s/vector/configmap.yaml
```

### 4. Vector Helm chart

```bash
helm repo add vector https://helm.vector.dev
helm repo update
helm install vector vector/vector \
  --namespace iot-pipeline \
  --values k8s/vector/values.yaml
```

### 5. (Optional) Self-hosted Mosquitto broker

Only needed if you want to move away from `broker.emqx.io` later.

```bash
kubectl apply -f k8s/mosquitto/configmap.yaml
kubectl apply -f k8s/mosquitto/deployment.yaml
```

Then update `k8s/vector/configmap.yaml` → `sources.tasmota_mqtt.host` to
`mosquitto.iot-pipeline.svc.cluster.local` and reconfigure Tasmota to publish
to your cluster's broker endpoint.

## Verify

```bash
# Tail Vector logs — look for MQTT connect and S3 flush messages
kubectl logs -n iot-pipeline -l app.kubernetes.io/name=vector --tail=50 -f

# List Parquet files after the first 5-minute batch
aws s3 ls s3://<bucket>/tasmota/ --recursive \
  --endpoint-url "$S3_ENDPOINT"
```

## Query with DuckDB (no server required)

```sql
-- Install DuckDB: https://duckdb.org/docs/installation
-- Set env: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_ENDPOINT

INSTALL httpfs; LOAD httpfs;
SET s3_endpoint = '<host:port-without-https>';   -- e.g. <id>.r2.cloudflarestorage.com
SET s3_access_key_id     = '<key>';
SET s3_secret_access_key = '<secret>';
SET s3_url_style = 'path';

-- Latest 20 readings
SELECT * FROM read_parquet('s3://<bucket>/tasmota/**/*.parquet')
ORDER BY time DESC LIMIT 20;

-- Daily averages
SELECT
  year, month, day,
  AVG(temperature)   AS avg_temp,
  AVG(humidity)      AS avg_humidity,
  AVG(gas_resistance) AS avg_gas
FROM read_parquet('s3://<bucket>/tasmota/**/*.parquet')
GROUP BY year, month, day
ORDER BY year, month, day;
```

## 365-Day Retention (S3 Lifecycle Rule)

No running process needed — the object store expires files automatically.

### Cloudflare R2

Use the R2 dashboard → Bucket → Lifecycle, or via Wrangler:

```bash
# lifecycle.json
{
  "Rules": [{
    "ID": "tasmota-365d",
    "Filter": { "Prefix": "tasmota/" },
    "Status": "Enabled",
    "Expiration": { "Days": 365 }
  }]
}
wrangler r2 bucket lifecycle set <bucket> --config lifecycle.json
```

### Backblaze B2 / generic AWS-compatible

```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket <bucket> \
  --endpoint-url "$S3_ENDPOINT" \
  --lifecycle-configuration '{
    "Rules": [{
      "ID": "tasmota-365d",
      "Filter": { "Prefix": "tasmota/" },
      "Status": "Enabled",
      "Expiration": { "Days": 365 }
    }]
  }'
```

## File Layout

```
k8s/
├── namespace.yaml            # Namespace: iot-pipeline
├── secrets.yaml              # TEMPLATE — fill in credentials, do not commit
├── vector/
│   ├── configmap.yaml        # Vector pipeline config (mqtt → remap → parquet/S3)
│   └── values.yaml           # Helm values (single Deployment, 64 Mi, envFrom secret)
└── mosquitto/                # Optional self-hosted broker
    ├── configmap.yaml        # mosquitto.conf
    └── deployment.yaml       # Deployment + ClusterIP Service
```
