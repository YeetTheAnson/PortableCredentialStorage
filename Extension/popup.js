// popup.js

const socket = new WebSocket('ws://localhost:8765');

// When the socket is open, request the list of ports
socket.addEventListener('open', function () {
    socket.send('list_ports');
    console.log('WebSocket is connected.');
});

socket.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);

    if (Array.isArray(data)) {
        const portList = document.getElementById('port-list');
        portList.innerHTML = '';  // Clear previous entries
        data.forEach(port => {
            const option = document.createElement('option');
            option.value = port.device;
            option.text = `${port.device} - ${port.description}`;
            portList.appendChild(option);
        });
    } else if (data.error) {
        console.error('Error:', data.error);
    } else {
        console.log('Message from server:', data);
        alert(data);  // Display the message in an alert for user feedback
    }
});

socket.addEventListener('close', function () {
    console.log('WebSocket is closed now.');
});

socket.addEventListener('error', function (event) {
    console.error('WebSocket error observed:', event);
});

document.getElementById('connect-button').addEventListener('click', function () {
    const selectedPort = document.getElementById('port-list').value;
    if (selectedPort) {
        socket.send(`connect:${selectedPort}`);
    } else {
        alert('Please select a COM port to connect.');
    }
});
