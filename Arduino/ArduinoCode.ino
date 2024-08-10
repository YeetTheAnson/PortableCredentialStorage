#include <FFat.h>

File userFile;    
File passFile;   
bool fileOpen = false; 
void setup() {
  Serial.begin(115200);
  delay(1000);  

  Serial.println("Starting FFAT initialization...");

  if (!FFat.begin()) {
    Serial.println("FFAT Mount Failed, attempting format...");

    if (!FFat.format()) {
      Serial.println("FFAT Format Failed!");
      return;
    }

    Serial.println("FFAT formatted successfully. Attempting to mount again...");

    if (!FFat.begin()) {
      Serial.println("FFAT Mount Failed after formatting!");
      return;
    }

    Serial.println("FFAT mounted successfully after formatting.");
  } else {
    Serial.println("FFAT mounted successfully.");
  }

  Serial.println("Ready to receive commands.");
  Serial.println("Commands:");
  Serial.println("iwanttowrite - Start the writing sequence");
  Serial.println("iwanttoread - Placeholder for read functionality");
  Serial.println("list - List all files");
  Serial.println("read filename.extension - Read file contents");
}

void loop() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();  

    if (command == "iwanttowrite") {
      handleWriteSequence();
    } else if (command == "iwanttoread") {
      Serial.println("Received command: iwanttoread");
    } else if (command == "list") {
      handleListCommand();
    } else if (command.startsWith("read ")) {
      handleReadCommand(command.substring(5));
    } else {
      Serial.println("Invalid command. Please use 'iwanttowrite', 'iwanttoread', 'list', or 'read filename.extension'.");
    }
  }
}

void handleWriteSequence() {
  Serial.println("iwantsite");
  String site = waitForResponse("iwantsite");

  if (site.length() > 0) {
    Serial.println("iwantusername");
    String username = waitForResponse("iwantusername");

    if (username.length() > 0) {
      Serial.println("iwantpassword");
      String password = waitForResponse("iwantpassword");

      if (password.length() > 0) {
        Serial.println("threecredentialsreceived");
        handleSite(site);
        handleUsername(username);
        handlePassword(password);
      } else {
        Serial.println("Password not received.");
      }
    } else {
      Serial.println("Username not received.");
    }
  } else {
    Serial.println("Site not received.");
  }
}

String waitForResponse(const String& expectedCommand) {
  unsigned long startTime = millis();
  while (millis() - startTime < 10000) { 
    if (Serial.available()) {
      String response = Serial.readStringUntil('\n');
      response.trim();
      return response;
    }
    delay(100); 
  }
  Serial.println(expectedCommand + " timeout.");
  return "";
}

void handleSite(String site) {
  String userFileName = "/" + site + "1.txt";
  String passFileName = "/" + site + "2.txt";

  userFile = FFat.open(userFileName, FILE_APPEND);
  if (!userFile) {
    Serial.println("Failed to open file for writing usernames.");
    return;
  }

  passFile = FFat.open(passFileName, FILE_APPEND);
  if (!passFile) {
    Serial.println("Failed to open file for writing passwords.");
    userFile.close();
    return;
  }

  fileOpen = true; 
  Serial.println("File preparation complete.");
}

void handleUsername(String username) {
  if (!fileOpen) {
    Serial.println("No file is open. Please start by providing a site.");
    return;
  }

  userFile.print(username);
  userFile.print(";");
  userFile.flush();  
}

void handlePassword(String password) {
  if (!fileOpen) {
    Serial.println("No file is open. Please start by providing a site.");
    return;
  }

  passFile.print(password);
  passFile.print(";");
  passFile.flush();  
  userFile.close();
  passFile.close();
  fileOpen = false;
}

void handleListCommand() {
  File root = FFat.open("/");
  if (!root) {
    Serial.println("Failed to open root directory.");
    return;
  }

  Serial.println("Listing files:");
  File file = root.openNextFile();
  while (file) {
    Serial.print("File: ");
    Serial.println(file.name());
    file = root.openNextFile();
  }
  root.close();
}

void handleReadCommand(String filename) {
  File file = FFat.open("/" + filename);
  if (!file) {
    Serial.println("Failed to open file for reading: " + filename);
    return;
  }

  Serial.println("Reading file:");
  while (file.available()) {
    Serial.write(file.read());
  }
  file.close();
  Serial.println("\nFile read complete.");
}
