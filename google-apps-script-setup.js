// Google Apps Script with CORS Support for GADUSU Website
// Copy this code to your Google Apps Script editor

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
    if (sheet === null) {
      const errorResponse = {
        success: false,
        error: "Sheet 'Sheet1' not found. Please create it first."
      };
      output.setContent(JSON.stringify(errorResponse));
      return output;
    }
    
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
