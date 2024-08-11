# PortableCredentialStorage
A password manager that stores credentials on the flash of the esp32, and types out password using HID keyboard emulation


https://github.com/user-attachments/assets/9c3267dc-e972-4c67-818c-4df0c7277ee0


## Getting Started

### Prerequisites

Before you begin, ensure you have the following libraries installed in your Arduino IDE:

- `USBHIDKeyboard.h`
- `FFat.h`


### Configuration

To connect the extension to the ESP32-S2, change the COM port in the script on line 6
```
SERIAL_PORT = 'COMX'

```

### How to install extension

- Type in chrome://extensions or edge://extensions (or open the extensions page on any chromium browser)
- Enable developer options
- Load unpacked
- Select the extensions file



## How it works

Python script acts as a repeater that allows the JavaScript code to talk to the Esp32, as webserial is not supported for extensions.
