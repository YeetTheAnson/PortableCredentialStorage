#include <FFat.h>

File userFile;    // To keep track of the usernames file
File passFile;    // To keep track of the passwords file
bool fileOpen = false;  // Flag to track if a file is currently open

void setup() {
  Serial.begin(115200);
  delay(1000);  // Delay to ensure serial connection is established
  if (!FFat.begin()) {
    if (!FFat.format()) {
      return;
    }

    if (!FFat.begin()) {
      return;
    }

  } else {
  }
}

void loop() {
  if (Serial.available()) {
    String command = Serial.readStringUntil('\n');
    command.trim();  // Remove whitespace at start and end

    if (command == "iwanttowrite") {
      handleWriteSequence();
    } else if (command == "iwanttoread") {
      handleReadSequence();
    } else {
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
      }
    }
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
  return "";
}

void handleSite(String site) {
  String userFileName = "/" + site + "1.txt";
  String passFileName = "/" + site + "2.txt";

  userFile = FFat.open(userFileName, FILE_APPEND);
  if (!userFile) {
    return;  // Failed to open file
  }

  passFile = FFat.open(passFileName, FILE_APPEND);
  if (!passFile) {
    userFile.close();
    return;  // Failed to open file
  }

  fileOpen = true;
}

void handleUsername(String username) {
  if (!fileOpen) {
    return;
  }

  userFile.print(username);
  userFile.print(";");
  userFile.flush(); 
}

void handlePassword(String password) {
  if (!fileOpen) {
    return;
  }

  passFile.print(password);
  passFile.print(";");
  passFile.flush();  
  userFile.close();
  passFile.close();
  fileOpen = false;
}

void handleReadSequence() {
  Serial.println("iwantsitetoreaduser");
  String site = waitForResponse("iwantsitetoreaduser");

  if (site.length() > 0) {
    String userFileName = "/" + site + "1.txt";
    File userFile = FFat.open(userFileName);
    if (!userFile) {
      return; 
    }

    String userFileContent = "";
    while (userFile.available()) {
      userFileContent += (char)userFile.read();
    }
    userFile.close();
    Serial.println(userFileContent);
    String username = waitForResponse("Enter username to find");

    if (username.length() > 0) {
      // Find the position of the username in the user file content
      int usernamePosition = findPosition(userFileContent, username);

      if (usernamePosition != -1) {
        // Read the password file
        String passFileName = "/" + site + "2.txt";
        File passFile = FFat.open(passFileName);
        if (!passFile) {
          return; 
        }

        // Read password file content
        String passFileContent = "";
        while (passFile.available()) {
          passFileContent += (char)passFile.read();
        }
        passFile.close();

        // Extract and send the password
        String password = extractPassword(passFileContent, usernamePosition);
        Serial.println(password);
      }
    }
  }
}

int findPosition(const String& content, const String& username) {
  int position = 0;
  int startIndex = 0;
  int endIndex;

  while ((endIndex = content.indexOf(';', startIndex)) != -1) {
    String entry = content.substring(startIndex, endIndex);
    if (entry == username) {
      return position;
    }
    startIndex = endIndex + 1;
    position++;
  }

  return -1;
}

String extractPassword(const String& content, int position) {
  int startIndex = 0;
  int endIndex;
  int currentIndex = 0;

  while ((endIndex = content.indexOf(';', startIndex)) != -1) {
    if (currentIndex == position) {
      return content.substring(startIndex, endIndex);
    }
    startIndex = endIndex + 1;
    currentIndex++;
  }

  return "";
}
