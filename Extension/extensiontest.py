# server.py
import asyncio
import serial
import serial.tools.list_ports
import websockets
import json

connected_clients = []

async def send_to_serial(ser, message):
    """Send a message to the serial device."""
    ser.write(message.encode())
    print(f"Sent to serial device: {message}")

async def send_to_websocket(client, message):
    """Send a message to the WebSocket client."""
    await client.send(message)
    print(f"Sent to WebSocket client: {message}")

async def handle_websocket(websocket):
    """Handle WebSocket messages and bridge them to/from the serial device."""
    connected_clients.append(websocket)
    ser = None

    try:
        async for message in websocket:
            print(f"Received WebSocket message: {message}")

            if message == 'list_ports':
                print("Handling list_ports request")
                com_ports = list(serial.tools.list_ports.comports())
                ports_info = [{"device": port.device, "description": port.description} for port in com_ports]
                await send_to_websocket(websocket, json.dumps(ports_info))
            elif message.startswith('connect:'):
                port_to_connect = message.split(':', 1)[1]
                print(f"Connecting to {port_to_connect}")
                try:
                    ser = serial.Serial(port_to_connect, 115200, timeout=1)
                    await send_to_websocket(websocket, f"Connected to {port_to_connect} at 115200 baud")
                    
                    while True:
                        msg = ser.read(100).decode().strip()
                        if msg:
                            print(f"Received from serial device: {msg}")
                            await send_to_websocket(websocket, msg)

                        if msg == 'iwanttowrite':
                            await send_to_serial(ser, 'iwanttowrite')
                            
                            # Wait for site request
                            msg = ser.read(100).decode().strip()
                            if msg == 'iwantsite':
                                site = await websocket.recv()
                                await send_to_serial(ser, site)

                                # Wait for username request
                                msg = ser.read(100).decode().strip()
                                if msg == 'iwantusername':
                                    username = await websocket.recv()
                                    await send_to_serial(ser, username)

                                    # Wait for password request
                                    msg = ser.read(100).decode().strip()
                                    if msg == 'iwantpassword':
                                        password = await websocket.recv()
                                        await send_to_serial(ser, password)

                                        # Wait for confirmation
                                        msg = ser.read(100).decode().strip()
                                        if msg == 'threecredentialsreceived':
                                            print("All credentials sent.")
                                            break
                except serial.SerialException as e:
                    await send_to_websocket(websocket, f"Failed to connect to {port_to_connect}: {e}")
                except Exception as e:
                    await send_to_websocket(websocket, f"Unexpected error: {e}")

    finally:
        if ser and ser.is_open:
            ser.close()
        connected_clients.remove(websocket)

async def main():
    server = await websockets.serve(handle_websocket, "localhost", 8765)
    print("WebSocket server started on ws://localhost:8765")
    await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
