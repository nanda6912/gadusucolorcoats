// Google Sheets Configuration using Proxy Server
const GOOGLE_SHEETS_CONFIG = {
    // Use local proxy server to bypass CORS issues
    PROXY_URL: 'http://localhost:3001/api/google-sheets',
    
    // Original Google Apps Script URL (for reference)
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbzQRupmxXlzidEdRuSHFsNQLocKfQxEWjWAb0Q-sn-qq2XWbG1FioAEEFAdY6FTKSE/exec',
    
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
    }
};

// Function to append data to Google Sheets via Proxy Server
async function appendToGoogleSheet(formData) {
    try {
        console.log('Sending data to proxy server:', formData);
        
        // Make the API request to proxy server
        const response = await fetch(GOOGLE_SHEETS_CONFIG.PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        console.log('Proxy server response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Proxy server error response:', errorText);
            throw new Error(`Proxy server error: ${response.status} - ${errorText}`);
        }
        
        const result = await response.text();
        console.log('Data successfully sent via proxy:', result);
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
