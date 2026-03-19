const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Environment variable validation
const googleAppsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
if (!googleAppsScriptUrl) {
  console.error('ERROR: GOOGLE_APPS_SCRIPT_URL environment variable is not set');
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'Proxy server is running', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Proxy endpoint for Google Apps Script
app.post('/api/google-sheets', async (req, res) => {
    try {
        // Log safe metadata only (no sensitive data)
        console.log('Proxy request received:', {
            method: req.method,
            path: req.path,
            contentType: req.get('Content-Type'),
            bodySize: JSON.stringify(req.body).length,
            timestamp: new Date().toISOString()
        });
        
        // Create AbortController for timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 10000); // 10 second timeout
        
        const response = await fetch(googleAppsScriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        const data = await response.text();
        console.log('Google Apps Script response received:', {
            status: response.status,
            success: response.ok,
            timestamp: new Date().toISOString()
        });
        
        // Send response back to client
        res.status(response.status).send(data);
        
    } catch (error) {
        console.error('Proxy error:', {
            error: error.message,
            type: error.name,
            timestamp: new Date().toISOString()
        });
        
        if (error.name === 'AbortError') {
            res.status(408).json({
                success: false,
                error: "Request timeout"
            });
        } else {
            res.status(500).json({
                success: false,
                error: "Internal server error"
            });
        }
    }
});

// Handle all other routes for Vercel
app.all('*', (req, res) => {
    res.json({ 
        message: 'GADUSU Proxy Server',
        status: 'running',
        endpoints: {
            health: '/api/health',
            googleSheets: '/api/google-sheets'
        },
        currentRoute: req.path,
        method: req.method
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
    console.log(`Google Sheets proxy endpoint: http://localhost:${PORT}/api/google-sheets`);
    console.log(`Health check endpoint: http://localhost:${PORT}/api/health`);
    console.log(`Google Apps Script URL: ${googleAppsScriptUrl ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
});

module.exports = app;
