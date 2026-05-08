# Tax Submission System / ระบบยื่นแบบภาษี

A simple web application for submitting and managing tax forms with support for 17 different income types based on Thai tax law (มาตรา 40).

## Features

- ✅ Submit tax forms with multiple income types
- ✅ View submission history with detailed breakdowns
- ✅ User-friendly interface with Thai language support
- ✅ Local SQLite database (no external dependencies)
- ✅ Single-user system (no login required)

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## Installation

1. **Navigate to the project directory:**
   ```bash
   cd tax-submission-app
   ```

2. **Install required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. **Start the Flask server:**
   ```bash
   python app.py
   ```

2. **Open your web browser and navigate to:**
   ```
   http://localhost:5000
   ```

3. **The application will automatically:**
   - Create the SQLite database (`tax_submissions.db`)
   - Initialize the database schema
   - Seed the user data (Bobby Watson)

## Usage

### Home Page
- Two main buttons:
  - **Submit New Tax Form** - Create a new tax submission
  - **View Submission History** - See all past submissions

### Submit Tax Form

**Step 1: User Validation**
- Enter your name: `Bobby Watson`
- Enter your National ID: `1234567890123`
- Click "Next" to proceed

**Step 2: Income Information**
- Select income types by checking the boxes
- Enter the amount for each selected income type
- Optionally add details/notes
- Click "Submit Tax Form" to save

**Available Income Types (17 types in 5 categories):**

1. **รายได้จากเงินเดือน (Salary Income)** - 2 types
2. **รายได้จากฟรีแลนซ์, รับจ้างทั่วไป (Freelance Income)** - 1 type
3. **รายได้จากทรัพย์สิน, การทำธุรกิจ, อาชีพอิสระ (Property/Business Income)** - 6 types
4. **รายได้จากการลงทุน (Investment Income)** - 7 types
5. **รายได้จากมรดกหรือได้รับมา (Inheritance/Gift Income)** - 1 type

### View Submission History
- See all submitted tax forms
- Click on any submission to expand and view details
- Shows:
  - Submission ID and date
  - Total income amount
  - Number of income types
  - Detailed breakdown of each income entry

## Database Structure

### Users Table
- `id` - Primary key
- `national_id` - National ID number (13 digits)
- `name` - First name
- `lastname` - Last name
- `address` - Address
- `birthday` - Date of birth

**Default User:**
- Name: Bobby Watson
- National ID: 1234567890123
- Birthday: 1990-01-15

### Tax Submissions Table
- `id` - Primary key
- `user_id` - Foreign key to users table
- `submission_date` - Timestamp of submission
- `income_data` - JSON string containing income details

## API Endpoints

### POST `/api/validate-user`
Validate user credentials before submission.

**Request:**
```json
{
  "name": "Bobby Watson",
  "national_id": "1234567890123"
}
```

**Response:**
```json
{
  "valid": true,
  "message": "User validated successfully"
}
```

### POST `/api/submit-tax`
Submit a new tax form.

**Request:**
```json
{
  "name": "Bobby Watson",
  "national_id": "1234567890123",
  "income_data": [
    {
      "type": "เงินเดือนหรือเงินได้ตามสัญญาจ้างแรงงาน",
      "amount": 50000,
      "details": "Monthly salary"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "submission_id": 1,
  "message": "Tax form submitted successfully"
}
```

### GET `/api/history`
Retrieve all tax submissions.

**Response:**
```json
{
  "submissions": [
    {
      "id": 1,
      "submission_date": "2026-05-05T15:30:00",
      "income_data": [
        {
          "type": "เงินเดือนหรือเงินได้ตามสัญญาจ้างแรงงาน",
          "amount": 50000,
          "details": "Monthly salary"
        }
      ]
    }
  ]
}
```

## Project Structure

```
tax-submission-app/
├── app.py                      # Flask application and routes
├── database.py                 # Database operations
├── requirements.txt            # Python dependencies
├── README.md                   # This file
├── static/
│   ├── css/
│   │   └── style.css          # Application styles
│   └── js/
│       ├── submit.js          # Tax submission form logic
│       └── history.js         # History page logic
└── templates/
    ├── base.html              # Base template
    ├── home.html              # Home page
    ├── submit.html            # Tax submission form
    └── history.html           # Submission history
```

## Technologies Used

- **Backend:** Python Flask
- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Database:** SQLite
- **Styling:** Custom CSS with gradient design

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, you can change it in `app.py`:
```python
app.run(debug=True, port=5001)  # Change to any available port
```

### Database Issues
If you encounter database issues, delete `tax_submissions.db` and restart the application. It will recreate the database automatically.

### Module Not Found
Make sure you've installed the requirements:
```bash
pip install -r requirements.txt
```

## License

This project is for educational purposes.

## Support

For issues or questions, please refer to the documentation or contact the development team.