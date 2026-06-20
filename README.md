# Hotel-Invoice-Automation
# Overview
This project is an AI-assisted workflow automation system built for a hotel business to automate the generation of corporate GST invoices from third-party booking vouchers. The system automatically processes booking vouchers received via email, extracts structured business information using Google Gemini, routes records through a human-review workflow, and generates finalized corporate invoices. The project was developed to eliminate repetitive manual billing work while maintaining accounting accuracy through human approval.
# Business Problem
Corporate bookings received through platforms such as MakeMyTrip require hotels to generate customized GST-compliant invoices containing:
* Company Name
* GSTIN
* Corporate Address
* Booking Information
* Invoice Number
* GST Breakdown

Previously, hotel staff manually:
1. Opened booking voucher emails
2. Downloaded voucher PDFs
3. Read company information
4. Calculated tax values
5. Entered details into invoice templates
6. Generated final invoices

The process was repetitive, time-consuming, and prone to errors.
# Solution
The system automates the workflow by:
* Monitoring incoming booking emails
* Extracting voucher data using Gemini
* Saving voucher PDFs automatically
* Creating a review queue in Google Sheets
* Allowing manager verification and corrections
* Generating finalized invoices from templates
* Storing generated PDFs in Google Drive
* Delivering invoices to hotel staff

The workflow reduces manual effort while preserving human oversight before invoice generation.
# System Workflow
MakeMyTrip Email\
        ↓\
   PDF Voucher\
        ↓\
  Google Gemini\
        ↓\
  Structured JSON\
        ↓\
Google Sheets Review Queue\
        ↓\
Manager Verification\
        ↓\
Google Docs Invoice Template\
        ↓\
  PDF Generation\
        ↓\
Google Drive Storage\
        ↓\
  Email Delivery

# Key Features
**AI-Powered Voucher Extraction**  
Extracts:
* Guest Name
* Company Name
* GSTIN
* Address
* Booking ID
* PNR
* Check-In / Check-Out
* Room Information
* Pricing Details
  
**Human-in-the-Loop Approval**  
Managers review and edit extracted information before invoice generation.

**Automated Invoice Creation**\
Generates GST-compliant invoices using Google Docs templates.

**Email Processing Automation**\
Automatically processes incoming booking emails.

**Document Management**\
Stores both vouchers and generated invoices in Google Drive.
  
# Technology Stack
**AI:**  
Google Gemini 2.5 Flash 

**Automation:**   
Google Apps Script  
Google Workspace  
Gmail  
Google Sheets   
Google Docs   
Google Drive  

**Document Processing:**    
PDF Parsing through Gemini  
# Evolution of the Project
**Version 1 – Browser-Based Prototype**  

The initial version was a browser-based application that:
* Extracted voucher information using Gemini
* Allowed manual review
* Generated invoices using PDF-Lib

While functional, it still required manual voucher uploads and was not suitable for daily operational use.

**Version 2 – Workflow Automation System**  

The project evolved into a fully automated workflow that integrates directly with Gmail, Google Sheets, Google Docs, and Google Drive.  
This version eliminated manual document handling and became suitable for real-world deployment.
# Key Engineering Lessons
* Automation is not the same as AI.
* Human approval is often more valuable than full autonomy.
* Reliability and operational simplicity are often more important than technical complexity.
