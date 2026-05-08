# Agent Test Examples

This document provides example chat conversations to test the Tax Submission Agent's connection to the API.

**Prerequisites:**
- The Tax Submission API must be running at `http://localhost:8080`
- The agent must be configured with the three tools: `validateUser`, `submitTax`, `getSubmissionHistory`
- Valid National ID for testing: `1234567890123`

---

## Test Case 1: Validate User Identity

### User Message:
```
I want to validate my identity with national ID 1234567890123
```

### Expected Agent Behavior:
1. Agent calls `validateUser` tool with:
   ```json
   {
     "national_id": "1234567890123"
   }
   ```
2. API returns success response with user details
3. Agent confirms validation and displays user information

### Expected Response:
```
Your identity has been validated successfully!

User Details:
- Name: John Doe
- Birthday: 1990-01-01
- National ID: 1234567890123

You can now proceed with submitting your tax form.
```

### Alternative Test (Invalid User):
```
Can you verify national ID 9999999999999?
```

Expected: Agent should report that the user is not found or unauthorized.

---

## Test Case 2: Submit Tax Form (Simple)

### User Message:
```
I want to submit my tax form. My name is John Doe, national ID is 1234567890123, and I have salary income of 50000 THB.
```

### Expected Agent Behavior:
1. Agent calls `submitTax` tool with:
   ```json
   {
     "name": "John Doe",
     "national_id": "1234567890123",
     "income_data": [
       {
         "type": 1,
         "amount": 50000,
         "details": "Salary income"
       }
     ]
   }
   ```
2. API returns success with submission ID
3. Agent confirms submission

### Expected Response:
```
Your tax form has been submitted successfully!

Submission Details:
- Submission ID: 1
- Name: John Doe
- National ID: 1234567890123
- Total Income: 50,000 THB

Income Breakdown:
1. Salary/Employment Income (Type 1): 50,000 THB

Your submission has been recorded.
```

---

## Test Case 3: Submit Tax Form (Multiple Income Types)

### User Message:
```
Submit my tax form:
- Name: John Doe
- National ID: 1234567890123
- Salary: 50000 THB
- Freelance income: 15000 THB
- Investment income: 12000 THB
```

### Expected Agent Behavior:
1. Agent calls `submitTax` tool with:
   ```json
   {
     "name": "John Doe",
     "national_id": "1234567890123",
     "income_data": [
       {
         "type": 1,
         "amount": 50000,
         "details": "Salary"
       },
       {
         "type": 3,
         "amount": 15000,
         "details": "Freelance income"
       },
       {
         "type": 10,
         "amount": 12000,
         "details": "Investment income"
       }
     ]
   }
   ```
2. API returns success
3. Agent confirms with breakdown

### Expected Response:
```
Your tax form has been submitted successfully!

Submission Details:
- Submission ID: 2
- Name: John Doe
- National ID: 1234567890123
- Total Income: 77,000 THB

Income Breakdown:
1. Salary/Employment Income (Type 1): 50,000 THB
2. Freelance/Contract Work (Type 3): 15,000 THB
3. Interest/Dividends (Type 10): 12,000 THB

Your submission has been recorded.
```

---

## Test Case 4: Retrieve Submission History

### User Message:
```
Show me my tax submission history
```

### Expected Agent Behavior:
1. Agent calls `getSubmissionHistory` tool (no parameters needed)
2. API returns list of all submissions
3. Agent formats and displays the history

### Expected Response:
```
Here is your tax submission history:

Submission #1:
- Submitted: 2026-05-08 12:00:00
- Name: John Doe
- National ID: 1234567890123
- Total Income: 50,000 THB
- Income Types: 1 (Salary)

Submission #2:
- Submitted: 2026-05-08 12:15:00
- Name: John Doe
- National ID: 1234567890123
- Total Income: 77,000 THB
- Income Types: 1 (Salary), 3 (Freelance), 10 (Investment)

Total Submissions: 2
```

### Alternative Queries:
```
What are my previous tax submissions?
```
```
Can you get my submission history?
```
```
List all my tax forms
```

---

## Test Case 5: Complete Workflow

### User Messages (Sequential):
```
1. First, validate my identity: 1234567890123
```
```
2. Now submit my tax with salary 60000 and rental income 20000
```
```
3. Show me the submission history
```

### Expected Flow:
1. **Step 1**: Agent validates user → Success
2. **Step 2**: Agent submits tax with types 1 (salary) and 5 (rental) → Success with submission ID
3. **Step 3**: Agent retrieves history → Shows all submissions including the new one

---

## Test Case 6: Error Handling

### Invalid National ID:
```
Validate national ID 0000000000000
```
Expected: Agent reports unauthorized or user not found

### Missing Information:
```
Submit my tax form
```
Expected: Agent asks for required information (name, national ID, income data)

### Invalid Income Type:
```
Submit tax for John Doe, ID 1234567890123, with income type 99 amount 50000
```
Expected: Agent reports invalid income type (must be 1-17)

---

## Income Type Reference for Testing

Use these income types when testing:

| Type | Description | Example Amount |
|------|-------------|----------------|
| 1 | Salary/Employment | 50,000 THB |
| 3 | Freelance/Contract | 15,000 THB |
| 5 | Rental Income | 20,000 THB |
| 6 | Professional Services | 25,000 THB |
| 8 | Business Income | 100,000 THB |
| 10 | Interest/Dividends | 12,000 THB |
| 11 | Stock Dividends | 8,000 THB |

---

## Quick Test Commands

### Minimal Test:
```
Validate ID 1234567890123, then submit tax for John Doe with 50000 salary, then show history
```

### Comprehensive Test:
```
I'm John Doe with national ID 1234567890123. I want to submit my tax with:
- Salary: 50000
- Freelance: 15000
- Rental: 20000
- Investment: 12000
Then show me my submission history.
```

---

## Troubleshooting

If the agent fails to connect to the API:

1. **Check API is running:**
   ```bash
   curl http://localhost:8080/api/history
   ```

2. **Verify agent tools are configured:**
   - validateUser
   - submitTax
   - getSubmissionHistory

3. **Check API endpoint in agent configuration:**
   - Should point to `http://localhost:8080`

4. **Test individual endpoints:**
   ```bash
   # Validate
   curl -X POST http://localhost:8080/api/validate-user \
     -H "Content-Type: application/json" \
     -d '{"national_id": "1234567890123"}'
   
   # Submit
   curl -X POST http://localhost:8080/api/submit-tax \
     -H "Content-Type: application/json" \
     -d '{"name": "John Doe", "national_id": "1234567890123", "income_data": [{"type": 1, "amount": 50000}]}'
   
   # History
   curl http://localhost:8080/api/history
   ```

---

## Notes

- All tests use the valid National ID: `1234567890123`
- The API only accepts this specific National ID for validation and submission
- Income types must be between 1-17
- Amounts must be non-negative numbers
- At least one income item is required for tax submission