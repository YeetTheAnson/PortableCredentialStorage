chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'connectSerial') {
        (async () => {
            try {
                const port = await navigator.serial.requestPort();
                await port.open({ baudRate: 9600 });
                sendResponse({ success: true, port: port });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        })();
        return true;
    }
});
