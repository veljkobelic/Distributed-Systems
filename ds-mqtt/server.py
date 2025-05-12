import paho.mqtt.client as mqtt
import json
from datetime import datetime

machines = {}

MQTT_BROKER = "emqx"
MQTT_PORT = 1883

CONNECT_TOPIC = "factory/machine/connect"
DATA_TOPIC = "factory/machine/data"
DISCONNECT_TOPIC = "factory/machine/disconnect"
ALERT_TOPIC = "factory/machine/alert"

MAX_VIBRATION = 5.0
MAX_TEMPERATURE = 85.0

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT broker with result code {rc}")
    client.subscribe(CONNECT_TOPIC)
    client.subscribe(DATA_TOPIC)
    client.subscribe(DISCONNECT_TOPIC)

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())

        if msg.topic == CONNECT_TOPIC:
            machine_id = payload.get("machine_id")
            if machine_id:
                print(f"\n*** Machine connected: ID {machine_id} ***")
                machines[machine_id] = {"status": "Connected", "last_updated": now()}
                display_machines()

        elif msg.topic == DATA_TOPIC:
            machine_id = payload.get("machine_id")
            vibration = payload.get("vibration")
            temperature = payload.get("temperature")
            error_code = payload.get("error_code")

            if machine_id:
                machines[machine_id] = {
                    "vibration": vibration,
                    "temperature": temperature,
                    "error_code": error_code,
                    "last_updated": now()
                }
                display_machines()

                if (vibration > MAX_VIBRATION or temperature > MAX_TEMPERATURE or error_code != 0):
                    alert = {
                        "machine_id": machine_id,
                        "alert": "Threshold exceeded",
                        "vibration": vibration,
                        "temperature": temperature,
                        "error_code": error_code
                    }
                    client.publish(ALERT_TOPIC, json.dumps(alert))
                    print(f"\n!!! ALERT sent for {machine_id} !!!")

        elif msg.topic == DISCONNECT_TOPIC:
            machine_id = payload.get("machine_id")
            if machine_id and machine_id in machines:
                print(f"\n*** Machine disconnected: ID {machine_id} ***")
                del machines[machine_id]
                display_machines()

    except json.JSONDecodeError:
        print("Invalid JSON received.")
    except Exception as e:
        print(f"Error: {e}")

def now():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def display_machines():
    print("\n--- Current Machine Status ---")
    print(f"{'ID':<12}{'Vibration':<12}{'Temp (°C)':<12}{'Error':<8}{'Last Updated':<20}")
    print("-" * 64)
    if not machines:
        print("No machines connected.")
        return

    for mid, data in machines.items():
        vibration = data.get("vibration", "-")
        temperature = data.get("temperature", "-")
        error = data.get("error_code", "-")
        print(f"{mid:<12}{vibration:<12}{temperature:<12}{error:<8}{data['last_updated']:<20}")

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect(MQTT_BROKER, MQTT_PORT, 60)

print("Factory Monitoring Server Started. Awaiting data...")
client.loop_forever()
