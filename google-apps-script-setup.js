// Google Apps Script Setup for GADUSU Website
// Copy this code to your Google Apps Script editor

// Function to set up headers in the Google Sheet
function setupSheetHeaders() {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    if (!sheet) {
      SpreadsheetApp.getActiveSpreadsheet().insertSheet('Sheet1');
      const newSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
      setupHeadersOnSheet(newSheet);
      return 'New sheet created with headers';
    } else {
      setupHeadersOnSheet(sheet);
      return 'Headers updated on existing sheet';
    }
  } catch (error) {
    return 'Error: ' + error.toString();
  }
}

// Helper function to set headers
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
  
  // Set column widths
  sheet.setColumnWidths(1, 8, [150, 120, 120, 150, 120, 200, 250, 120]);
}

// Main function to handle form submissions
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    const timestamp = new Date();
    
    // Ensure headers are set up
    if (sheet.getRange('A1').getValue() !== 'Timestamp') {
      setupHeadersOnSheet(sheet);
    }
    
    // Append the data to the sheet in the correct order
    sheet.appendRow([
      timestamp.toISOString(),                    // Column A: Timestamp
      data.name || '',                           // Column B: Full Name
      data.phone || '',                          // Column C: Phone Number
      data.email || '',                          // Column D: Email Address
      data.service || '',                         // Column E: Service Type
      data.location || '',                       // Column F: Location/Address
      data.message || '',                        // Column G: Additional Details
      data.date || ''                            // Column H: Preferred Date
    ]);
    
    // Format the timestamp column for better readability
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    
    // Create response
    const response = {
      success: true,
      message: "Appointment data saved successfully",
      timestamp: timestamp.toISOString(),
      rowNumber: lastRow
    };
    
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.toString(),
      message: "Failed to save appointment data"
    };
    
    return ContentService.createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function to verify script is working
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: "Google Apps Script is working!",
    timestamp: new Date().toISOString(),
    spreadsheet: SpreadsheetApp.getActiveSpreadsheet().getName()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Function to clear all data (use with caution)
function clearAllData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  sheet.getRange(2, 1, sheet.getLastRow() - 1, 8).clearContent();
  return 'All data cleared except headers';
}

// Function to get all data as JSON
function getAllData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  const data = sheet.getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    data: data,
    totalRows: data.length
  })).setMimeType(ContentService.MimeType.JSON);
}
