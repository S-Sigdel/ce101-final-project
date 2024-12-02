
const express = require('express');
const dgram = require('dgram');
const app = express();

// Middleware to parse JSON
app.use(express.json());

/**
 * Sends a single-letter UDP message.
 * @param {string} letter - The single letter to send.
 * @param {string} host - The destination host.
 * @param {number} port - The destination port.
 */
function sendUdpMessage(letter, host, port) {
    return new Promise((resolve, reject) => {
        if (letter.length !== 1) {
            return reject('The message must be a single letter.');
        }

        const message = Buffer.from(letter);
        const client = dgram.createSocket('udp4');

        client.send(message, port, host, (err) => {
            client.close();
            if (err) {
                reject(err);
            } else {
                resolve(`Message "${letter}" sent to ${host}:${port}`);
            }
        });
    });
}

// API endpoint to send UDP message
app.post('/send-udp', async (req, res) => {
    const { letter, host, port } = req.body;
    try {
        const result = await sendUdpMessage(letter, host, port);
        res.send({ success: true, message: result });
    } catch (error) {
        res.status(400).send({ success: false, error });
    }
});

// Serve the website
app.use(express.static('public'));

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
