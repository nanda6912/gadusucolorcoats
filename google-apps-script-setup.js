// Google Apps Script with CORS Support for GADUSU Website
// Copy this code to your Google Apps Script editor

// Current deployment URL: https://script.google.com/macros/s/AKfycbxhFVgbs3OGIXe7i8azO6tazWWdbpeCRHD1Z7lhz02n8YOpQGPsrYzK-KbW3rC2J44e/exec

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "Script is working!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    // Enable CORS
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    
    // Guard against missing post data
    if (!e.postData || !e.postData.contents) {
      const errorResponse = {
        success: false,
        error: "No data received"
      };
      output.setContent(JSON.stringify(errorResponse));
      return output;
    }
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get spreadsheet with fallback
    let spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    if (!spreadsheet) {
      const SPREADSHEET_ID = '123A0waq7aujYr3xPI6jomxmGsBvZ_hPCx9sXfwCeYj4';
      spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    }
    
    const sheet = spreadsheet.getSheetByName('Sheet1');
    if (sheet === null) {
      const errorResponse = {
        success: false,
        error: "Sheet 'Sheet1' not found. Please create it first."
      };
      const errorOutput = ContentService.createTextOutput();
      errorOutput.setMimeType(ContentService.MimeType.JSON);
      errorOutput.setContent(JSON.stringify(errorResponse));
      return errorOutput;
    }
    
    // Ensure headers are set up
    if (sheet.getRange('A1').getValue() !== 'Timestamp') {
      setupHeadersOnSheet(sheet);
    }
    
    // Use LockService to prevent race conditions
    const lock = LockService.getScriptLock();
    try {
      lock.waitLock(30000); // Wait up to 30 seconds
      
      // Create accurate timestamp with proper timezone
      const timestamp = new Date();
      const formattedTimestamp = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
      
      // Append data to the sheet in the correct order
      const range = sheet.appendRow([
        formattedTimestamp,                       // Column A: Timestamp (formatted)
        data.name || '',                           // Column B: Full Name
        data.phone || '',                          // Column C: Phone Number
        data.email || '',                          // Column D: Email Address
        data.service || '',                         // Column E: Service Type
        data.location || '',                       // Column F: Location/Address
        data.message || '',                        // Column G: Additional Details
        data.date || ''                            // Column H: Preferred Date
      ]);
      
      // Get row number while lock is held (prevents race conditions)
      const capturedRowNumber = sheet.getLastRow();
      
      // Log the timestamp for debugging
      console.log('Data saved with timestamp:', formattedTimestamp);
      
    } finally {
      lock.releaseLock();
    }
    
    // Create response
    const response = {
      success: true,
      message: "Appointment data saved successfully",
      timestamp: timestamp.toISOString(),
      rowNumber: sheet.getLastRow()
    };
    
    output.setContent(JSON.stringify(response));
    return output;
    
  } catch (error) {
    // Server-side logging (not sent to client)
    console.error('Google Apps Script error:', error.toString());
    
    const errorResponse = {
      success: false,
      error: "Internal server error",
      message: "Failed to save appointment data"
    };
    
    const errorOutput = ContentService.createTextOutput();
    errorOutput.setMimeType(ContentService.MimeType.JSON);
    errorOutput.setContent(JSON.stringify(errorResponse));
    return errorOutput;
  }
}

function setupHeadersOnSheet(sheet) {
  const headers = [
    'Timestamp',
    'Full Name',
    'Phone Number', 
    'Email Address',
    'Service Type',
    'Location/Address',
    'Additional Details',
    'Preferred Date'
  ];
  
  // Clear existing headers and set new ones
  sheet.getRange('A1:H1').clear();
  sheet.getRange('A1:H1').setValues([headers]);
  sheet.getRange('A1:H1').setFontWeight('bold');
  sheet.getRange('A1:H1').setBackground('#f0f0f0');
  sheet.getRange('A1:H1').setFontColor('#333333');
  
  // Auto-resize columns for better readability
  sheet.autoResizeColumns(1, 8);
  
  // Set column widths using individual calls
  const widths = [150, 120, 120, 150, 120, 200, 250, 120];
  widths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
}

// Function to clear all data (use with caution)
function clearAllData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  if (sheet === null) {
    return 'Sheet "Sheet1" not found. Please create it first.';
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return 'No data rows to clear';
  }
  
  const dataRows = lastRow - 1;
  if (dataRows > 0) {
    sheet.getRange(2, 1, dataRows, 8).clearContent();
  }
  
  return 'All data cleared except headers';
}

// Function to get all data as JSON
function getAllData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  if (sheet === null) {
    const errorResponse = {
      success: false,
      error: "Sheet 'Sheet1' not found"
    };
    const errorOutput = ContentService.createTextOutput();
    errorOutput.setMimeType(ContentService.MimeType.JSON);
    errorOutput.setContent(JSON.stringify(errorResponse));
    return errorOutput;
  }
  
  const data = sheet.getDataRange().getValues();
  const response = {
    success: true,
    data: data,
    totalRows: data.length
  };
  
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(response));
  return output;
}
