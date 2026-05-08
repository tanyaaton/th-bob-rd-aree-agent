# Tax Submission Web Application - Technical Specification

## Project Overview
A simple local web application for tax form submission with history tracking. Single-user system (no authentication required).

## Technology Stack
- **Backend**: Python Flask
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Database**: SQLite
- **Server**: Flask development server (local)

## Project Structure
```
tax-submission-app/
├── app.py                 # Main Flask application
├── database.py            # Database initialization and operations
├── requirements.txt       # Python dependencies
├── README.md             # Setup and run instructions
├── static/
│   ├── css/
│   │   └── style.css     # Main stylesheet
│   └── js/
│       ├── home.js       # Home page logic
│       ├── submit.js     # Tax submission form logic
│       └── history.js    # History page logic
├── templates/
│   ├── base.html         # Base template
│   ├── home.html         # Landing page
│   ├── submit.html       # Tax submission form
│   └── history.html      # Submission history
└── tax_database.db       # SQLite database (auto-generated)
```

## Database Schema

### Table: users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | User ID |
| national_id | TEXT | NOT NULL, UNIQUE | National ID number |
| name | TEXT | NOT NULL | First name |
| lastname | TEXT | NOT NULL | Last name |
| address | TEXT | | Home address |
| birthday | DATE | | Date of birth |

**Initial Data**: Bobby Watson with generated National ID

### Table: tax_submissions
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | Submission ID |
| user_id | INTEGER | FOREIGN KEY (users.id) | Reference to user |
| submission_date | DATETIME | DEFAULT CURRENT_TIMESTAMP | When submitted |
| name | TEXT | NOT NULL | Name from form |
| national_id | TEXT | NOT NULL | National ID from form |
| income_data | TEXT | NOT NULL | JSON string of income types and amounts |

**income_data JSON structure**:
```json
[
  {
    "category": "รายได้จากเงินเดือน",
    "type": "เงินเดือนหรือเงินได้ตามสัญญาจ้างแรงงาน (มาตรา 40(1))",
    "amount": "50000",
    "details": "Monthly salary"
  },
  {
    "category": "รายได้จากการลงทุน",
    "type": "เงินปันผล ส่วนแบ่งกำไรจากหุ้น/กองทุน (มาตรา 40(4)(ข))",
    "amount": "10000",
    "details": "Stock dividends"
  }
]
```

## API Endpoints

### GET /
- **Description**: Home page with navigation buttons
- **Response**: HTML page

### GET /submit
- **Description**: Tax submission form page
- **Response**: HTML page with two-step form

### GET /history
- **Description**: View submission history
- **Response**: HTML page with list of submissions

### POST /api/validate-user
- **Description**: Validate user information (step 1)
- **Request Body**:
  ```json
  {
    "name": "Bobby",
    "national_id": "1234567890123"
  }
  ```
- **Response**:
  ```json
  {
    "valid": true,
    "message": "User validated"
  }
  ```

### POST /api/submit-tax
- **Description**: Submit tax form with income data
- **Request Body**:
  ```json
  {
    "name": "Bobby",
    "national_id": "1234567890123",
    "income_data": [...]
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "submission_id": 1,
    "message": "Tax form submitted successfully"
  }
  ```

### GET /api/history
- **Description**: Get all tax submissions
- **Response**:
  ```json
  {
    "submissions": [
      {
        "id": 1,
        "submission_date": "2026-05-05 14:30:00",
        "name": "Bobby",
        "national_id": "1234567890123",
        "income_data": [...],
        "total_income_types": 2
      }
    ]
  }
  ```

## Income Types (from income_type.md)

The form will display all income types organized by 5 main categories:

1. **รายได้จากเงินเดือน** (Salary Income) - 2 types
2. **รายได้จากฟรีแลนซ์, รับจ้างทั่วไป** (Freelance Income) - 1 type
3. **รายได้จากทรัพย์สิน, การทำธุรกิจ, อาชีพอิสระ** (Property/Business Income) - 6 types
4. **รายได้จากการลงทุน** (Investment Income) - 7 types
5. **รายได้จากมรดกหรือได้รับมา** (Inheritance/Gifts) - 1 type

Each income type will have:
- Checkbox to enable/disable
- Text field for amount
- Text field for additional details

## UI Flow

### Home Page
```
┌─────────────────────────────────┐
│   Tax Submission System         │
│                                 │
│   ┌─────────────────────────┐  │
│   │  Submit New Tax Form    │  │
│   └─────────────────────────┘  │
│                                 │
│   ┌─────────────────────────┐  │
│   │  View Submission History│  │
│   └─────────────────────────┘  │
└─────────────────────────────────┘
```

### Submit Form - Step 1
```
┌─────────────────────────────────┐
│   Submit Tax Form - Step 1      │
│                                 │
│   Name: [____________]          │
│   National ID: [____________]   │
│                                 │
│   [Next →]                      │
└─────────────────────────────────┘
```

### Submit Form - Step 2
```
┌─────────────────────────────────┐
│   Submit Tax Form - Step 2      │
│                                 │
│   Select Income Types:          │
│                                 │
│   ☐ รายได้จากเงินเดือน          │
│     Amount: [_____] Details: [] │
│                                 │
│   ☐ รายได้จากฟรีแลนซ์           │
│     Amount: [_____] Details: [] │
│                                 │
│   ... (all 17 income types)     │
│                                 │
│   [← Back] [Submit]             │
└─────────────────────────────────┘
```

### History Page
```
┌─────────────────────────────────┐
│   Submission History            │
│                                 │
│   ┌───────────────────────────┐ │
│   │ Submission #1             │ │
│   │ Date: 2026-05-05 14:30    │ │
│   │ Name: Bobby Watson        │ │
│   │ Income Types: 2           │ │
│   │ [View Details]            │ │
│   └───────────────────────────┘ │
│                                 │
│   [← Back to Home]              │
└─────────────────────────────────┘
```

## Key Features

1. **Two-Step Form Submission**
   - Step 1: Validate user info (name, national_id)
   - Step 2: Select and fill income types

2. **Dynamic Income Fields**
   - Checkboxes to enable/disable income types
   - Show/hide amount and details fields based on selection
   - Support multiple income types in one submission

3. **History View**
   - List all past submissions
   - Display submission date, user info, and income summary
   - Expandable details for each submission

4. **Data Validation**
   - Required fields validation
   - National ID format validation
   - Amount must be numeric

## Dependencies (requirements.txt)
```
Flask==3.0.0
```

## Setup Instructions
1. Install Python 3.8+
2. Install dependencies: `pip install -r requirements.txt`
3. Initialize database: `python database.py`
4. Run application: `python app.py`
5. Access at: `http://localhost:5000`

## Testing Checklist
- [ ] Database initializes with Bobby Watson user
- [ ] Home page loads with both navigation buttons
- [ ] Submit form step 1 validates user info correctly
- [ ] Submit form step 2 displays all 17 income types
- [ ] Dynamic fields show/hide based on checkbox selection
- [ ] Form submission saves to database
- [ ] History page displays all submissions
- [ ] Submission details are accurate and complete
- [ ] Application runs entirely on localhost