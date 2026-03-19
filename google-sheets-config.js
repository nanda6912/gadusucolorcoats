// Google Sheets Configuration using Proxy Server
const GOOGLE_SHEETS_CONFIG = {
    // Use environment variable for proxy URL with fallback
    PROXY_URL: process.env.GOOGLE_SHEETS_PROXY_URL || 'https://gadusuproxy.vercel.app/api/google-sheets',
    
    // Secure API key for proxy authentication
    PROXY_API_KEY: process.env.GOOGLE_SHEETS_PROXY_API_KEY || '',
    
    // Current Google Apps Script deployment URL
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbxFOHerwrRV1hDWgy8QKp4Eem7x04BaeCTbED4ubmk7m9yUhakQrf9DcaSfzWgyOdF3/exec',
    
    // Your Google Sheet ID (for reference)
    SPREADSHEET_ID: '123A0waq7aujYr3xPI6jomxmGsBvZ_hPCx9sXfwCeYj4',
    
    // Column mapping
    COLUMNS: {
        TIMESTAMP: 'A',
        NAME: 'B', 
        PHONE: 'C',
        EMAIL: 'D',
        SERVICE: 'E',
        LOCATION: 'F',
        MESSAGE: 'G',
        DATE: 'H'
    },
    
    // Form field names (exact match with HTML form)
    FORM_FIELDS: {
        name: 'name',
        phone: 'phone', 
        email: 'email',
        service: 'service',
        location: 'location',
        message: 'message',
        date: 'date'
    },
    
    // Google Sheet column headers
    SHEET_HEADERS: [
        'Timestamp',
        'Full Name',
        'Phone Number', 
        'Email Address',
        'Service Type',
        'Location/Address',
        'Additional Details',
        'Preferred Date'
    ]
};

// Function to append data to Google Sheets via Proxy Server
async function appendToGoogleSheet(formData) {
    try {
        // Log safe metadata only (no PII)
        console.log('Sending data to proxy server:', {
            timestamp: new Date().toISOString(),
            hasApiKey: !!GOOGLE_SHEETS_CONFIG.PROXY_API_KEY,
            proxyUrl: GOOGLE_SHEETS_CONFIG.PROXY_URL
        });
        
        // Prepare headers with API key authentication
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Add API key if configured
        if (GOOGLE_SHEETS_CONFIG.PROXY_API_KEY) {
            headers['Authorization'] = `Bearer ${GOOGLE_SHEETS_CONFIG.PROXY_API_KEY}`;
            headers['X-API-Key'] = GOOGLE_SHEETS_CONFIG.PROXY_API_KEY;
        }
        
        // Make the authenticated API request to proxy server
        const response = await fetch(GOOGLE_SHEETS_CONFIG.PROXY_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(formData)
        });
        
        console.log('Proxy server response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Proxy server error response:', errorText);
            throw new Error(`Proxy server error: ${response.status} - ${errorText}`);
        }
        
        const result = await response.text();
        console.log('Data successfully sent via proxy:', {
            success: true,
            timestamp: new Date().toISOString()
        });
        return { success: true, data: result };
        
    } catch (error) {
        console.error('Error appending to Google Sheets via proxy:', error);
        return { success: false, error: error.message };
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GOOGLE_SHEETS_CONFIG, appendToGoogleSheet };
}
