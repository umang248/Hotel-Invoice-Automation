/**
 * AI Hotel Invoice Automation System
 *
 * Version: 2.0
 * Author: Umang Singhal
 *
 * Workflow:
 * Gmail -> Gemini -> Google Sheets -> Human Review
 * -> Google Docs -> PDF -> Email
 */

//  CONFIGURATION
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
const DRIVE_FOLDER_ID = "YOUR_DRIVE_FOLDER_ID"; // The ID of the Drive folder where PDFs should be saved

/**
 * Main function triggered every 10-15 minutes
 */
function processBookingEmails() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  let processedLabel = GmailApp.getUserLabelByName("MMT-Processed");

  if (!processedLabel) {
    processedLabel = GmailApp.createLabel("MMT-Processed");
  }
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);

  // Adjust this query if the sender address or subject line is different
  const searchQuery =
    'from:makemytrip.com has:attachment -label:MMT-Processed';
  const threads = GmailApp.search(searchQuery);

  if (threads.length === 0) {
    Logger.log("No new bookings found.");
    return;
  }

  for (let i = 0; i < threads.length; i++) {
    const messages = threads[i].getMessages();

    for (let j = 0; j < messages.length; j++) {
      const message = messages[j];



      const attachments = message.getAttachments();

      for (let k = 0; k < attachments.length; k++) {
        const attachment = attachments[k];

        // Only process PDFs
        if (attachment.getContentType() === "application/pdf") {

          // 1. Save the Voucher to Google Drive

          const file = folder.createFile(attachment);
          const fileUrl = file.getUrl();

          // 2. Pass the PDF to Gemini for Extraction
          const extractedData = extractVoucherData(attachment);

          // 3. Write the row to the Google Sheet
          if (extractedData) {
            sheet.appendRow([
              "Pending",                            // A: Status
              message.getDate(),                    // B: Date Received
              extractedData.guest_name || "",       // C: Guest Name
              extractedData.company_name || "",     // D: Company Name
              extractedData.gstin || "",            // E: GSTIN
              extractedData.address || "",          // F: Address
              extractedData.booking_id || "",       // G: Booking ID
              extractedData.pnr || "",              // H: PNR
              extractedData.check_in || "",         // I: Check In Date
              extractedData.check_out || "",        // J: Check Out Date
              extractedData.item_desc || "",        // K: Item/Room Description
              extractedData.nights || "",           // L: Nights
              extractedData.unit_price || "",       // M: Unit Price
              extractedData.total || "",            // N: Subtotal(without GST)
              extractedData.total * 0.025 || "",    // O: CGST/SGST
              extractedData.total_amount || "",     // P: Total Amount
              fileUrl,                              // Q: Voucher PDF URL
              "",                                   // R: INVOICE NUMBER (Blank for front desk)
              false,                                // S: GENERATE BILL Checkbox
              "",                                   // T: Final Bill URL
              "Awaiting Invoice Number"             // U: Errors
            ]);
            threads[i].addLabel(processedLabel);
          } else {
            // Write a failure row so the front desk knows an email arrived but extraction failed
            sheet.appendRow([
              "Error",
              message.getDate(),
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              fileUrl,
              "",
              false,
              "",
              "AI Extraction Failed. Manual review required."
            ]);
          }
        }
      }


    }
  }
}
//  CONFIGURATION FOR EXECUTION
const TEMPLATE_DOC_ID = "YOUR_TEMPLATE_DOC_ID"; // ID of your Google Doc Invoice Template
const FINISHED_BILLS_FOLDER_ID = "YOUR_FINISHED_BILLS_FOLDER_ID"; // Where to save the final PDFs
const FRONT_DESK_EMAIL = "YOUR_MAIL_ID"; // Who gets the final PDF

/**
 * The onEdit trigger automatically fires whenever ANY cell in the sheet is modified.
 */
function onEdit(e) {
  // Prevent errors if the script runs manually instead of from an edit
  if (!e || !e.range) return;

  const sheet = e.source.getActiveSheet();
  const range = e.range;

  // Check if the edited cell is in Column S (Column 19) AND if it was checked (TRUE)
  if (range.getColumn() === 19 && range.getValue() === true) {
    const row = range.getRow();

    // Ignore edits to the header row
    if (row === 1) return;

    // Make sure an invoice number was actually entered in Column R (Column 18)
    const invoiceNumber = sheet.getRange(row, 18).getValue();
    if (!invoiceNumber) {
      sheet.getRange(row, 21).setValue("Error: Missing Invoice Number!");
      range.setValue(false); // Uncheck the box
      return;
    }

    // Change status to Processing
    sheet.getRange(row, 1).setValue("Processing...");

    // Trigger the generation
    try {
      generateAndEmailBill(sheet, row, invoiceNumber);
    } catch (error) {
      sheet.getRange(row, 1).setValue("Error");
      sheet.getRange(row, 21).setValue("Execution Failed: " + error.toString());
    }
  }
}

/**
 * Handles the actual document creation and emailing
 */
function generateAndEmailBill(sheet, row, invoiceNumber) {
  // 1. Fetch all data from that specific row
  const data = sheet.getRange(row, 1, 1, 21).getValues()[0];
  const guestName = data[2];
  const companyName = data[3];
  const gstin = data[4];
  const address = data[5];
  const id = data[6];
  const pnr = data[7];
  const checkin = data[8];
  const checkout = data[9];
  const item = data[10];
  const night = data[11];
  const unitprice = data[12];
  const subtotal = parseFloat(data[13]) || 0;
  const cgst = parseFloat(data[14]) || 0;
  const sgst = parseFloat(data[14]) || 0;
  const totalAmount = parseFloat(data[15]) || 0;



  // 3. Duplicate the Template Document
  const templateFile = DriveApp.getFileById(TEMPLATE_DOC_ID);
  const destinationFolder = DriveApp.getFolderById(FINISHED_BILLS_FOLDER_ID);

  // Create a temporary Google Doc copy
  const tempDocFile = templateFile.makeCopy(`TEMP_Invoice_${id}`, destinationFolder);
  const tempDocId = tempDocFile.getId();

  // 4. Open the new document and replace the {{tags}}
  const doc = DocumentApp.openById(tempDocId);
  const body = doc.getBody();

  body.replaceText("{{Invoice_Number}}", invoiceNumber);
  body.replaceText("{{Name}}", guestName);
  body.replaceText("{{Company_Name}}", companyName);
  body.replaceText("{{GSTIN}}", gstin);
  body.replaceText("{{Company_Address}}", address);
  body.replaceText("{{ID}}", id);
  body.replaceText("{{PNR}}", pnr);
  body.replaceText("{{Checkin_Date}}", checkin);
  body.replaceText("{{Checkout_Date}}", checkout);
  body.replaceText("{{Item}}", item);
  body.replaceText("{{Night}}", night);
  body.replaceText("{{Unit_Price}}", unitprice);
  body.replaceText("{{Subtotal}}", subtotal.toFixed(2));
  body.replaceText("{{CGST}}", cgst.toFixed(2));
  body.replaceText("{{SGST}}", sgst.toFixed(2));
  body.replaceText("{{Total_Amount}}", totalAmount.toFixed(2));


  doc.saveAndClose(); // Critical: Must save before converting to PDF

  // 5. Convert to PDF
  const pdfBlob = tempDocFile.getAs('application/pdf');
  pdfBlob.setName(`MangalMurti_Bill_${id}.pdf`);

  // Save PDF to Drive and Trash the temporary Google Doc
  const finalPdfFile = destinationFolder.createFile(pdfBlob);
  tempDocFile.setTrashed(true);

  // 6. Email the PDF to the front desk
  GmailApp.sendEmail(
    FRONT_DESK_EMAIL,
    ` Generated Invoice: ${id} - ${companyName}`,
    `The corporate bill for ${companyName} has been successfully generated. Please find it attached.`,
    {
      attachments: [finalPdfFile.getAs(MimeType.PDF)],
      name: "Hotel Billing Automation"
    }
  );

  // 7. Update Spreadsheet Status
  sheet.getRange(row, 1).setValue("Complete");
  sheet.getRange(row, 20).setValue(finalPdfFile.getUrl()); // Paste PDF link in Col T
  sheet.getRange(row, 21).setValue("Success: Emailed to front desk."); // Clear errors in Col U
}
/**
 * Helper function to send the PDF to the Gemini API
 */
function extractVoucherData(pdfBlob) {
  // Convert the PDF blob to base64 for the API
  const base64Pdf = Utilities.base64Encode(pdfBlob.getBytes());
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `
 Analyze the following text extracted from a MakeMyTrip hotel booking voucher for Hotel Mangal Murti. 
 Extract the following details carefully. If a value is missing, return an empty string. Format STRICTLY as JSON without markdown blocks. 
 Keys required: "guest_name", "company_name", "gstin", "address", "booking_id", "pnr", "check_in", "check_out", "item_desc" (e.g., '1 x Standard room'), "nights" (number),"unit_price" (number: this is unit price of a room per night), "total" (number: this is the base amount WITHOUT GST), "total_amount" (number: this is the final amount AFTER GST).
  `;

  const payload = {
    "contents": [{
      "parts": [
        { "text": prompt },
        { "inlineData": { "mimeType": "application/pdf", "data": base64Pdf } }
      ]
    }],
    "generationConfig": { "responseMimeType": "application/json" }
  };

  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());

    if (json.error) {
      Logger.log("API Error: " + json.error.message);
      return null;
    }

    const rawText = json.candidates[0].content.parts[0].text;
    return JSON.parse(rawText);

  } catch (e) {
    Logger.log("Execution Error: " + e.toString());
    return null;
  }
}
