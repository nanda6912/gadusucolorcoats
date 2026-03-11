// Vercel Serverless Function for Google Sheets Integration
// This replaces the local proxy server for production deployment

export default async function handler(req, res) {
  // Add CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed. Use POST.' 
    });
  }

  try {
    console.log('Received request:', req.body);
    
    const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbzQRupmxXlzidEdRuSHFsNQLocKfQxEWjWAb0Q-sn-qq2XWbG1FioAEEFAdY6FTKSE/exec';
    
    const response = await fetch(googleAppsScriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error(`Google Apps Script error: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    console.log('Google Apps Script response:', data);
    
    // Return the exact response from Google Apps Script
    res.status(200).setHeader('Content-Type', 'text/plain').send(data);
    
  } catch (error) {
    console.error('Proxy function error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
