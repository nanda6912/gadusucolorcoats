// Google Apps Script with CORS Support for GADUSU Website
// Replace your existing Apps Script code with this

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
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    const timestamp = new Date();
    
    // Ensure headers are set up
    if (sheet.getRange('A1').getValue() !== 'Timestamp') {
      setupHeadersOnSheet(sheet);
    }
    
    // Append the data to the sheet
    sheet.appendRow([
      timestamp.toISOString(),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.service || '',
      data.location || '',
      data.message || '',
      data.date || ''
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
    
    output.setContent(JSON.stringify(response));
    return output;
    
  } catch (error) {
    const errorResponse = {
      success: false,
      error: error.toString(),
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
  
  // Set column widths
  sheet.setColumnWidths(1, 8, [150, 120, 120, 150, 120, 200, 250, 120]);
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
