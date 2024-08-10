let recordedData = {
    name: '',
    password: ''
};

function updateData(fieldType, value) {
    recordedData[fieldType] = value;
    console.log(`Updated ${fieldType}:`, recordedData[fieldType]);
}

function finalizeData() {
    console.log('Finalized Data:', recordedData);
}

document.addEventListener('input', (event) => {
    if (event.target.type === 'text' && event.target.name.toLowerCase().includes('name')) {
        updateData('name', event.target.value);
    } else if (event.target.type === 'password') {
        updateData('password', event.target.value);
    }
}, true);

document.addEventListener('blur', (event) => {
    if ((event.target.type === 'text' && event.target.name.toLowerCase().includes('name')) ||
        event.target.type === 'password') {
        finalizeData();
    }
}, true);
