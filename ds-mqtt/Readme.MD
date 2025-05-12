# Supported Features: Factory Equipment Monitoring

1. Each machine starts in its own container and passes a unique `machine_id` as a command-line argument.
2. On startup, the machine publishes a connect message to the MQTT topic `factory/machine/connect`.
3. Machines periodically send monitoring data (vibration, temperature, error code) to `factory/machine/data`.
4. The server receives and displays the real-time status of all connected machines with timestamps.
5. Machines send a disconnect message to `factory/machine/disconnect` when they shut down.
6. If any threshold is exceeded, the server publishes an alert message to `factory/machine/alert`.

---

# MQTT Topics and Message Structure

### `factory/machine/connect`
Sent by a machine when it connects:
```json
{
  "machine_id": "machine_1"
}
```

### `factory/machine/data`
Sent periodically by the machine with status updates:
```json
{
  "machine_id": "machine_1",
  "vibration": 6.2,
  "temperature": 89.0,
  "error_code": 1
}
```

### `factory/machine/disconnect`
Sent when a machine disconnects:
```json
{
  "machine_id": "machine_1"
}
```

### `factory/machine/alert`
Sent by the server if thresholds are exceeded:
```json
{
  "machine_id": "machine_1",
  "alert": "Threshold exceeded",
  "vibration": 6.2,
  "temperature": 89.0,
  "error_code": 1
}
```
