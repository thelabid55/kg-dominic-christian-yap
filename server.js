const express = require('express');
const path = require('path');
const fs = require('fs');
const os = require('os');

const app = express();
// Serve static assets from the root folder
app.use(express.static(__dirname));

// SSE (Server-Sent Events) clients registry for live reload
let liveReloadClients = [];

app.get('/live-reload', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    // Add client to registry
    liveReloadClients.push(res);
    
    // Remove client when connection closes
    req.on('close', () => {
        liveReloadClients = liveReloadClients.filter(client => client !== res);
    });
});

// Helper function to trigger client reload
function triggerReload() {
    console.log('🔄 File changes detected in index.html. Triggering browser reload...');
    liveReloadClients.forEach(client => {
        try {
            client.write('data: reload\n\n');
        } catch (err) {
            // Remove broken connections
            liveReloadClients = liveReloadClients.filter(c => c !== client);
        }
    });
}

// Watch index.html for changes with a small debounce to avoid multiple quick triggers
let watchTimeout;
try {
    fs.watch(path.join(__dirname, 'index.html'), (eventType, filename) => {
        clearTimeout(watchTimeout);
        watchTimeout = setTimeout(() => {
            triggerReload();
        }, 100);
    });
    console.log('👀 Watching index.html for auto-updates...');
} catch (err) {
    console.error('❌ Failed to watch index.html:', err.message);
}

// Find local WiFi/Ethernet IPv4 address
function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Check for IPv4 and ensure it's not a loopback address
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return null;
}

// Try listening on a port with fallback
function startServer(port) {
    const server = app.listen(port, '0.0.0.0', () => {
        const localIp = getLocalIpAddress();
        console.log('\n======================================================');
        console.log(`🚀 Server is running on port ${port}!`);
        console.log(`🏠 Local URL:  http://localhost:${port}`);
        if (localIp) {
            console.log(`📡 WiFi URL:   http://${localIp}:${port}`);
        }
        console.log('\n🔧 Custom Local Domain Setup:');
        console.log('To use http://thehardwarestore.com, map it in your hosts file:');
        console.log(`127.0.0.1  thehardwarestore.com`);
        console.log('======================================================\n');
    });

    server.on('error', (err) => {
        if (err.code === 'EACCES') {
            console.log(`⚠️  Port ${port} requires administrator privileges.`);
            if (port === 80) {
                console.log('🔄 Falling back to port 3000...');
                startServer(3000);
            }
        } else if (err.code === 'EADDRINUSE') {
            console.log(`⚠️  Port ${port} is already in use.`);
            if (port === 80) {
                console.log('🔄 Falling back to port 3000...');
                startServer(3000);
            }
        } else {
            console.error('❌ Server startup error:', err);
        }
    });
}

// Start with standard HTTP port 80, fall back to 3000 if restricted
startServer(80);
