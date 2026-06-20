# Why Version 2 Replaced Version 1?  
Version 1 successfully demonstrated that AI could extract booking information and generate invoices from hotel vouchers. However, the workflow still required manual voucher uploads, manual file management, and did not provide a centralized way to track invoice generation.  
Version 2 shifted the focus from task automation to workflow automation by integrating Gmail, Google Sheets, Google Docs, and Google Drive into a single system.  

In addition to reducing manual effort, Version 2 introduced a structured operational workflow where every booking, extracted data point, invoice number, processing status, voucher, and generated invoice could be tracked from a single location.  
This provided several operational benefits:  
* Centralized invoice tracking
* Better record keeping
* Easier auditing and verification
* Reduced risk of duplicate invoices
* Visibility into processing status
* Simplified document management

The transition transformed the solution from a standalone invoice-generation tool into a complete business workflow automation system suitable for day-to-day operations.
# Why Human Approval Instead of Full Automation?
Billing documents affect accounting records.    
AI extraction is useful but not perfectly reliable.    
The objective was not to remove humans from the process.  
The objective was to remove repetitive work while keeping humans responsible for final approval.     
Accuracy was prioritized over maximum automation.  
# Why Google Sheets Instead of a Database?
**Alternative:**  
PostgreSQL / MySQL  

**Chosen:**  
Google Sheets  

**Reason:**
The hotel already uses spreadsheets daily.  
Sheets also provide:
* Visibility
* Easy editing
* Low maintenance
* Zero infrastructure cost
# Why Gmail Labels Instead of Read/Unread Status?
Read status reflects user behavior.    
Labels reflect system state.  
This separation makes automation more reliable.  
