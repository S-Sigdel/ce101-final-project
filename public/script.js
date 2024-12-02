const controls = {
    up: document.getElementById('up'),
    down: document.getElementById('down'),
    left: document.getElementById('left'),
    right: document.getElementById('right'),
};

// Function to enlarge the button with feedback
const enlargeButton = (button) => {
    if (!button) return; // Safeguard against undefined buttons
    button.classList.add('enlarged');
    setTimeout(() => {
        button.classList.remove('enlarged');
    }, 200); // Feedback lasts for 200ms
};

// Function to send UDP message
const sendUdpMessage = async (letter) => {
    const ipAddr = '192.168.4.1';
    const port = 8888;

    try {
        const response = await fetch('/send-udp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ letter, host: ipAddr, port }),
        });

        const result = await response.json();
        if (!result.success) {
            console.error(`UDP error: ${result.error}`);
        }
    } catch (error) {
        console.error(`Failed to send UDP message: ${error.message}`);
    }
};

// Functions for different car controls
function moveForward() {
    sendUdpMessage('A'); // F for Forward
}

function moveBackward() {
    sendUdpMessage('B'); // B for Backward
}

function moveLeft() {
    sendUdpMessage('L'); // L for Left
}

function moveRight() {
    sendUdpMessage('R'); // R for Right
}
function stop(){
  sendUdpMessage("E"); //E for stop
}
function follow(){
  sendUdpMessage("Q");
}

// Add click event listeners for buttons
Object.values(controls).forEach((button) => {
    button.addEventListener('click', () => {
        switch (button.id) {
            case 'up':
                moveForward();
                break;
            case 'down':
                moveBackward();
                break;
            case 'left':
                moveLeft();
                break;
            case 'right':
                moveRight();
                break;
        }
        enlargeButton(button);
    });
});

// Add keyboard event listener for arrow keys
document.addEventListener('keydown', (event) => {
    console.log(`Key pressed: ${event.key}`); // Debug log for keypress
    switch (event.key.toLowerCase()) { // Ensure case insensitivity
        case 'w':
            moveForward();
            enlargeButton(controls.up);
            break;
        case 's':
            moveBackward();
            enlargeButton(controls.down);
            break;
        case 'a':
            moveLeft();
            enlargeButton(controls.left);
            break;
        case 'd':
            console.log('Moving Right'); // Debug log for 'd'
            moveRight();
            enlargeButton(controls.right);
            break;
        case ' ':
            stop();
            enlargeButton(controls.up);
            enlargeButton(controls.down);
            enlargeButton(controls.left);
            enlargeButton(controls.right);
            break;
        case 'q':
            follow();
            break;
    }
});

// Add keyboard event listener for new keys
document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if ('qtojgkihfe'.includes(key)) {
        sendUdpMessage(key.toUpperCase());
        enlargeButton(document.getElementById(key));
    }
});

// Add event listeners for new buttons
['q', 't', 'o', 'j', 'g', 'k', 'i', 'h', 'f', 'e'].forEach((key) => {
    const button = document.getElementById(key);
    button.addEventListener('click', () => {
        sendUdpMessage(key.toUpperCase());
        enlargeButton(button);
    });
});
