chrome.runtime.onMessage.addListener((message) => {
    if (message.text) {
      fetch('http://localhost:5000/receive_text', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: message.text
      }).then(response => response.text())
        .then(result => console.log('Success:', result))
        .catch(error => console.error('Error:', error));
    }
  });
  