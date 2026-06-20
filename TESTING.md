# Issue #1 – Read/Unread Email Dependency
**Problem:**  
The initial design relied on unread emails to identify unprocessed bookings.  

**Risk:**  
If staff opened an email before automation ran, the booking would never be processed.  

**Solution:**  
Replaced unread-status tracking with Gmail label-based processing.  

**Lesson:**  
User actions must be considered when designing automation workflows, as operational processes should not depend on user behavior.  
# Issue #2 – Runtime Errors from Invalid Numeric Values
**Problem:**  
AI-generated fields occasionally contained empty values or unexpected formats.  
This created errors when applying numerical formatting operations.  

**Solution:**  
Added explicit parsing and validation before calculations.  

**Result:**  
Improved robustness of invoice generation.  

**Lesson:**  
Never assume AI-generated outputs will always match the expected data type.   

 
