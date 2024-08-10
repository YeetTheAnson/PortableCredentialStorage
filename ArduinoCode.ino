#include <Arduino.h>
#include <LittleFS.h>

void setup() {
  Serial.begin(115200);
  
  if (!LittleFS.begin()) {
    Serial.println("Failed to initialize LittleFS");
    return;
  }

  Serial.println("LittleFS initialized");
}

void loop() {
  if (Serial.available() > 0) {
    String input = Serial.readStringUntil('\n');
    input.trim();  // Remove any leading or trailing whitespace

    Serial.print("Received input: ");
    Serial.println(input);

    if (input.startsWith("site(")) {
      // Example input: site(www.google.com);username(testingonetwo);password(testingthreefour)
      String site = extractBetween(input, "site(", ");");
      String username = extractBetween(input, "username(", ");");
      String password = extractBetween(input, "password(", ");");

      Serial.print("Extracted site: ");
      Serial.println(site);
      Serial.print("Extracted username: ");
      Serial.println(username);
      Serial.print("Extracted password: ");
      Serial.println(password);

      if (site.length() > 0 && username.length() > 0 && password.length() > 0) {
        saveCredentials(site, username, password);
        Serial.println("Credentials saved");
      } else {
        Serial.println("Invalid format: Missing site, username, or password");
      }
    } else if (input.startsWith("sitelistuser(")) {
      Serial.println("Received sitelistuser command");
    } else {
      Serial.println("Unknown command");
    }
  }
}

String extractBetween(String str, String startDelim, String endDelim) {
  int startIndex = str.indexOf(startDelim);
  if (startIndex == -1) {
    Serial.print("Start delimiter not found: ");
    Serial.println(startDelim);
    return "";
  }

  startIndex += startDelim.length();
  int endIndex = str.indexOf(endDelim, startIndex);
  if (endIndex == -1) {
    Serial.print("End delimiter not found: ");
    Serial.println(endDelim);
    return "";
  }

  return str.substring(startIndex, endIndex);
}

// Function to save credentials to a file
void saveCredentials(String site, String username, String password) {
  String fileName = site + ".txt";
  
  File file = LittleFS.open(fileName, "a");
  if (!file) {
    Serial.println("Failed to open file for appending");
    return;
  }

  file.print(username);
  file.print(";");
  file.println(password);
  file.close();
}
