// Vercel Serverless Function for Google Sheets Integration
// This replaces the need for a separate proxy server

const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Enable CORS for all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbzQRupmxXlzidEdRuSHFsNQLocKfQxEWjWAb0Q-sn-qq2XWbG1FioAEEFAdY6FTKSE/exec';
    
    console.log('Forwarding request to Google Apps Script:', req.body);
    
    const response = await fetch(googleAppsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      'User-Agent': 'Vercel-Proxy/1.0'
      },
      body: JSON.stringify(req.body)
    });
    
    const data = await response.text();
    console.log('Google Apps Script response:', data);
    
    // Forward the response from Google Apps Script
    res.status(response.status).send(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to forward request to Google Apps Script'
    });
  }
};
