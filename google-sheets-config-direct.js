// Google Sheets Configuration for Direct Google Apps Script Integration
const GOOGLE_SHEETS_CONFIG = {
    // Direct Google Apps Script URL (CORS enabled)
    WEB_APP_URL: 'https://script.google.com/macros/s/AKfycbwCzC8ifOgArKSB7yx2L0IfbdiN0qNf2YE3iyVnjf7RyY_OVaWfnqrLFU1_DfoENOnT/exec',
    
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

// Function to append data directly to Google Apps Script
async function appendToGoogleSheet(formData) {
    try {
        console.log('Sending data directly to Google Apps Script:', formData);
        
        // Make the API request directly to Google Apps Script
        const response = await fetch(GOOGLE_SHEETS_CONFIG.WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        console.log('Google Apps Script response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Google Apps Script error response:', errorText);
            throw new Error(`Google Apps Script error: ${response.status} - ${errorText}`);
        }
        
        const result = await response.text();
        console.log('Data successfully sent directly:', result);
        return { success: true, data: result };
        
    } catch (error) {
        console.error('Error appending to Google Sheets directly:', error);
        return { success: false, error: error.message };
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GOOGLE_SHEETS_CONFIG, appendToGoogleSheet };
}
