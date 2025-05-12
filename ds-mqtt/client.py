import paho.mqtt.client as mqtt
import json
import random
import time
import sys
import atexit

MQTT_BROKER = "emqx"
MQTT_PORT = 1883

CONNECT_TOPIC = "factory/machine/connect"
DATA_TOPIC = "factory/machine/data"
DISCONNECT_TOPIC = "factory/machine/disconnect"

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT Broker with result code {rc}")
    connect_payload = {"machine_id": machine_id}
    client.publish(CONNECT_TOPIC, json.dumps(connect_payload))

def on_disconnect(client, userdata, rc):
    print(f"Disconnected from MQTT Broker with result code {rc}")
    disconnect_payload = {"machine_id": machine_id}
    client.publish(DISCONNECT_TOPIC, json.dumps(disconnect_payload))

def cleanup():
    print("Performing cleanup...")
    try:
        disconnect_payload = {"machine_id": machine_id}
        client.publish(DISCONNECT_TOPIC, json.dumps(disconnect_payload))
        client.loop_stop()
        client.disconnect()
    except Exception as e:
        print(f"Error during cleanup: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide a machine ID (e.g., python client.py machine_1)")
        sys.exit(1)

    machine_id = sys.argv[1]
    client = mqtt.Client(client_id=f"machine_client_{machine_id}")
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect

    print(f"Connecting to MQTT Broker for Machine {machine_id}...")
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.loop_start()
    atexit.register(cleanup)

    try:
        while True:
            vibration = round(random.uniform(1.0, 7.0), 2)
            temperature = round(random.uniform(60.0, 95.0), 2)
            error_code = random.choice([0, 0, 0, 1])

            data_payload = {
                "machine_id": machine_id,
                "vibration": vibration,
                "temperature": temperature,
                "error_code": error_code
            }

            client.publish(DATA_TOPIC, json.dumps(data_payload))
            print(f"Published Data: {data_payload}")
            time.sleep(5)

    except KeyboardInterrupt:
        print("Client interrupted. Disconnecting...")
    except Exception as e:
        print(f"An error occurred: {e}")
