# Design Goal
The primary objective was to automate hotel billing operations using existing Google Workspace tools without requiring additional infrastructure, servers, or software installations.  
The system was designed to:
* Minimize manual data entry
* Maintain billing accuracy
* Integrate with existing hotel workflows
* Keep operational costs low
# Architecture Overview
Incoming Booking Email  
            │    
            ▼   
      Gmail Inbox  
            │  
            ▼  
   Apps Script Trigger  
            │  
            ▼  
      PDF Voucher    
            │   
            ▼  
      Gemini Extraction  
            │  
            ▼  
      Structured JSON  
            │  
            ▼  
      Google Sheets Queue  
            │  
            ▼  
     Manager Validation  
            │  
            ▼   
     Google Docs Template  
            │  
            ▼  
       Invoice PDF    
            │  
            ▼  
      Google Drive  
            │   
            ▼  
       Email Delivery 
  # Components
  **Email Intake Layer:**   
  Processes incoming MakeMyTrip voucher emails automatically.  
  Uses Gmail Labels to track processing status. 
  
  **AI Extraction Layer:**  
  Gemini converts semi-structured voucher PDFs into structured JSON data.  
  
  **Review Queue:**  
  Google Sheets serves as the operational review queue.  
  Managers can:
  * Verify extraction accuracy
  * Correct values
  * Enter invoice numbers
  * Trigger invoice generation

**Document Generation Layer:**  
Google Docs templates are used for invoice generation.  
Placeholder fields are dynamically replaced with extracted values.  

**Storage Layer:**  
Generated invoices and original vouchers are stored in Google Drive.  

**Delivery Layer:**  
Completed invoices are automatically emailed to hotel staff.  
