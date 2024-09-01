# PortableCredentialStorage
A password manager that stores credentials on the flash of the esp32, and types out password using HID keyboard emulation


https://github.com/user-attachments/assets/9c3267dc-e972-4c67-818c-4df0c7277ee0


# Getting started

1. Flash the esp32-s2. [Learn how](#how-to-flash-esp32s2)
2. Run the python server code locally or run the executable version
    - [Run the script](#installation-of-python-script)
    - [Run executable](#installation-of-executable)
3. Install the chrome extension. [Learn how](#how-to-install-extension)
4. Learn how to use [here](#usage)
5. Learn about the features [here](#features)


## How to flash esp32s2

1. Open the `Arduino` folder in this repo
2. Download `ArduinoCode.ino` and open in Arduino IDE
3. Add ESP8266 to the board manager:
    - Go to `File` >> `Preferences` >> `Additional Boards Manager URLs`
    - Paste the following URL: `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json`
    - Open board manager download `esp32 by esp32 community`
4. Select the board `ESP32 S2 DEVKIT`
5. Add required libraries to Arudino IDE:
    - Open library manager
    - Search and install `USBHIDKeyboard.h` and `FFat.h`
6. Compile and flash the code to the ESP32


## Installation of python script

1. Type ```git clone https://github.com/YeetTheAnson/PortableCredentialStorage``` into CMD
2. Type ```cd Extension``` into CMD
3. Type ```pip install websockets pyserial``` into CMD
4. Set the configuration by changing the COM port number `SERIAL_PORT = 'COMX'`
4. Type ```python repeater.py``` into CMD to launch the script


## Installation of executable

1. Go to the [Release](https://github.com/YeetTheAnson/PortableCredentialStorage/releases/tag/V1) page
2. Download PortableCredentailStorageServer.exe
3. Double click to run


## How to install extension

1. Type in chrome://extensions or edge://extensions (or open the extensions page on any chromium browser)
2. Enable developer options
3. Load unpacked
4. Select the extensions folder


# Usage

1. After entering any usernames and passwords, the chrome extension extracts the username and password and writes it to the flash memory of the esp32
2. When visiting the same website after, you get the option to choose to recall password
3. After pressign recall password, the extension prompts you to:
    - Click on the username field and press button GPIO0
    - Click on the password field and press button GPIO0

## Features
- Encryption (Not implemented yet)
- Stores credentials
- Automatically recognize the website you're visiting
