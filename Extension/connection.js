
document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connectButton');
    let port;
    let writer;
    let reader;
    const textToSend = 'iwanttowrite';
    const intervalTime = 11000; 

    connectButton.addEventListener('click', async () => {
        try {
            port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });
            console.log('Connected to the serial device:', port);

            writer = port.writable.getWriter();
            reader = port.readable.getReader();

            setInterval(sendMessage, intervalTime);

            readLoop();
        } catch (error) {
            console.error('Error connecting to the serial device:', error);
        }
    });

    async function sendMessage() {
        try {
            const data = new TextEncoder().encode(textToSend + '\n');
            await writer.write(data);
            console.log(`Sent: ${textToSend}`);
        } catch (error) {
            console.error('Error sending data:', error);
        }
    }

    async function readLoop() {
        while (true) {
            try {
                const { value, done } = await reader.read();
                if (done) {
                    console.log('Reader closed');
                    break;
                }
                const decodedValue = new TextDecoder().decode(value);
                console.log('Received:', decodedValue);
                
                chrome.runtime.sendMessage({ message: 'serialData', data: decodedValue });
            } catch (error) {
                console.error('Error reading data:', error);
                break;
            }
        }
    }
});
