const express = require('express');

const cors = require('cors');

const fetch = require('node-fetch');



const app = express();

const PORT = process.env.PORT || 3001;



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

        const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbwCzC8ifOgArKSB7yx2L0IfbdiN0qNf2YE3iyVnjf7RyY_OVaWfnqrLFU1_DfoENOnT/exec';

        

        console.log('Proxying request to Google Apps Script:', req.body);

        

        const response = await fetch(googleAppsScriptUrl, {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',

            },

            body: JSON.stringify(req.body)

        });

        

        const data = await response.text();

        console.log('Google Apps Script response:', data);

        

        // Send response back to client

        res.status(response.status).send(data);

        

    } catch (error) {

        console.error('Proxy error:', error);

        res.status(500).json({

            success: false,

            error: error.message

        });

    }

});



// Root endpoint

app.get('/', (req, res) => {

    res.json({ 

        message: 'GADUSU Proxy Server',

        status: 'running',

        endpoints: {

            health: '/api/health',

            googleSheets: '/api/google-sheets'

        }

    });

});



// Start server

app.listen(PORT, () => {

    console.log(`Proxy server running on port ${PORT}`);

    console.log(`Google Sheets proxy endpoint: http://localhost:${PORT}/api/google-sheets`);

    console.log(`Health check endpoint: http://localhost:${PORT}/api/health`);

});



module.exports = app;

