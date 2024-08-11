document.getElementById('request-username').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        const ws = new WebSocket('ws://localhost:8765');
        let receivedUsernames = [];
        let selectedUsername = '';

        ws.onopen = () => {
            ws.send('iwanttoread');
        };

        ws.onmessage = (event) => {
            const message = event.data;

            if (message === 'iwantsitetoreaduser') {
                const site = new URL(currentTab.url).hostname;
                ws.send(site);
            } else if (message.includes(';')) {
                receivedUsernames = message.split(';');
                populateUsernameList(receivedUsernames);
                setTimeout(() => {
                    document.getElementById('username-list').style.display = 'none';
                }, 9000); // Hide the list after 9 seconds
            } else if (message.startsWith('password:')) {
                const password = message.slice('password:'.length);
                fillFields(selectedUsername, password);
            }
        };

        function populateUsernameList(usernames) {
            const usernameListDiv = document.getElementById('scrollable-username-list');
            usernameListDiv.innerHTML = ''; // Clear previous list
            usernames.forEach((username) => {
                const button = document.createElement('button');
                button.textContent = username;
                button.addEventListener('click', () => {
                    selectedUsername = username;
                    ws.send(username);
                    showInstructions();
                });
                usernameListDiv.appendChild(button);
            });
            document.getElementById('username-list').style.display = 'block';
        }

        function fillFields(username, password) {
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                function: (username, password) => {
                    // Ensure fields are targeted correctly
                    const usernameField = document.querySelector('input[type="text"][name*="name"]');
                    const passwordField = document.querySelector('input[type="password"]');
                    if (usernameField) {
                        usernameField.value = username;
                    }
                    if (passwordField) {
                        passwordField.value = password;
                    }
                },
                args: [username, password]
            });
        }

        function showInstructions() {
            alert('Please follow these steps:\n\n' +
                '1. Click on the username field.\n' +
                '2. Press the button on GPIO0.\n' +
                '3. Click on the password field.\n' +
                '4. Press the button on GPIO0.\n' +
                '5. The fields should now be filled.');
        }
    });
});
