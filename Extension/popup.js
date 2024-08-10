
document.addEventListener('DOMContentLoaded', () => {
    const openTabButton = document.getElementById('openTabButton');
    const responseContainer = document.createElement('div');
    document.body.appendChild(responseContainer);

    openTabButton.addEventListener('click', () => {
        chrome.tabs.create({ url: 'connection.html' });
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.message === 'serialData') {
            const responseText = document.createElement('p');
            responseText.textContent = `Received: ${request.data}`;
            responseContainer.appendChild(responseText);
        }
    });
});
