import asyncio
import serial
import websockets

# Serial port configuration
SERIAL_PORT = 'COM8'
BAUD_RATE = 115200

# WebSocket server configuration
WEBSOCKET_PORT = 8765

# Global variable to hold the WebSocket connection
websocket_connection = None

async def handle_websocket(websocket, path):
    global websocket_connection
    websocket_connection = websocket
    print("WebSocket connection established")
    try:
        while True:
            # Waiting for a message from the WebSocket
            message = await websocket.recv()
            if message.strip():  # Check if the message is not empty or whitespace
                print(f"Received WebSocket message: {message}")
                # Forward the message to the serial device
                if serial_connection and serial_connection.is_open:
                    serial_connection.write(message.encode())
            else:
                print("Received an empty WebSocket message")
    except websockets.ConnectionClosed:
        print("WebSocket connection closed")
        websocket_connection = None

def handle_serial_read():
    while True:
        if serial_connection and serial_connection.is_open:
            # Read from the serial device
            if serial_connection.in_waiting > 0:
                message = serial_connection.read(serial_connection.in_waiting).decode()
                if message.strip():  # Check if the message is not empty or whitespace
                    print(message)
                    # Forward the message to the WebSocket
                    if websocket_connection and websocket_connection.open:
                        asyncio.run(websocket_connection.send(message))
                else:
                    print("Received an empty serial message")

async def main():
    global serial_connection

    # Open the serial port
    serial_connection = serial.Serial(SERIAL_PORT, BAUD_RATE)
    print(f"Connected to {SERIAL_PORT} at {BAUD_RATE} baud")

    # Set up the WebSocket server
    websocket_server = await websockets.serve(handle_websocket, 'localhost', WEBSOCKET_PORT)

    # Start a thread to handle serial read
    import threading
    serial_thread = threading.Thread(target=handle_serial_read, daemon=True)
    serial_thread.start()

    # Run the WebSocket server
    await websocket_server.wait_closed()

# Run the asyncio event loop
asyncio.run(main())
