
(async function() {
    try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        console.log('Connected to the serial device:', port);
    } catch (error) {
        
    }
})();
