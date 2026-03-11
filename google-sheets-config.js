// Google Sheets Configuration for Vercel Deployment
const GOOGLE_SHEETS_CONFIG = {
    // Use Vercel serverless function for production
    PROXY_URL: '/api/google-sheets',
    
    // Fallback for local development
    LOCAL_PROXY_URL: 'http://localhost:3001/api/google-sheets',
    
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

// Function to append data to Google Sheets (works on both local and Vercel)
async function appendToGoogleSheet(formData) {
    try {
        console.log('Sending data:', formData);
        
        // Detect if we're in production (Vercel) or development
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        const apiUrl = isProduction ? GOOGLE_SHEETS_CONFIG.PROXY_URL : GOOGLE_SHEETS_CONFIG.LOCAL_PROXY_URL;
        
        console.log('Using API URL:', apiUrl);
        
        // Make the API request
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }
        
        const result = await response.text();
        console.log('Data successfully sent:', result);
        return { success: true, data: result };
        
    } catch (error) {
        console.error('Error appending to Google Sheets:', error);
        return { success: false, error: error.message };
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GOOGLE_SHEETS_CONFIG, appendToGoogleSheet };
}
