# Implementation Guide - Tax Submission Application

This guide provides detailed instructions for implementing each component of the tax submission application.

## Phase 1: Project Setup

### 1.1 Create Project Structure
```bash
mkdir tax-submission-app
cd tax-submission-app
mkdir -p static/css static/js templates
```

### 1.2 Create requirements.txt
```
Flask==3.0.0
```

### 1.3 Install Dependencies
```bash
pip install -r requirements.txt
```

## Phase 2: Database Setup

### 2.1 Create database.py

Key functions to implement:
- `init_db()` - Create tables and seed Bobby Watson data
- `validate_user(name, national_id)` - Verify user credentials
- `submit_tax_form(name, national_id, income_data)` - Save submission
- `get_all_submissions()` - Retrieve all submissions

**Bobby Watson Initial Data:**
- Name: Bobby
- Lastname: Watson
- National ID: 1234567890123 (13 digits)
- Address: 123 Main Street, Bangkok, Thailand
- Birthday: 1990-01-15

### 2.2 Database Schema

**users table:**
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    national_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    lastname TEXT NOT NULL,
    address TEXT,
    birthday DATE
)
```

**tax_submissions table:**
```sql
CREATE TABLE tax_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    name TEXT NOT NULL,
    national_id TEXT NOT NULL,
    income_data TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
```

## Phase 3: Flask Application

### 3.1 Create app.py

**Required Routes:**

1. `GET /` - Render home.html
2. `GET /submit` - Render submit.html
3. `GET /history` - Render history.html
4. `POST /api/validate-user` - Validate user info
5. `POST /api/submit-tax` - Submit tax form
6. `GET /api/history` - Get all submissions

**Flask Configuration:**
```python
app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev-secret-key'
```

## Phase 4: Frontend Templates

### 4.1 Create base.html

Base template with:
- HTML5 doctype
- Meta tags for charset and viewport
- Link to style.css
- Common header/footer
- Block for page-specific content
- Block for page-specific scripts

### 4.2 Create home.html

Features:
- Extends base.html
- Title: "Tax Submission System"
- Two large buttons:
  - "Submit New Tax Form" → /submit
  - "View Submission History" → /history
- Clean, centered layout

### 4.3 Create submit.html

Features:
- Two-step form (controlled by JavaScript)
- Step 1: User validation
  - Name input field
  - National ID input field
  - "Next" button
- Step 2: Income types (initially hidden)
  - All 17 income types from income_type.md
  - Organized by 5 categories
  - Each type has: checkbox, amount field, details field
  - "Back" and "Submit" buttons
- Success/error message display area

**Income Types Structure:**
```
Category 1: รายได้จากเงินเดือน (2 types)
Category 2: รายได้จากฟรีแลนซ์, รับจ้างทั่วไป (1 type)
Category 3: รายได้จากทรัพย์สิน, การทำธุรกิจ, อาชีพอิสระ (6 types)
Category 4: รายได้จากการลงทุน (7 types)
Category 5: รายได้จากมรดกหรือได้รับมา (1 type)
```

### 4.4 Create history.html

Features:
- List of all submissions
- Each submission shows:
  - Submission ID
  - Date and time
  - Name and National ID
  - Number of income types
  - Expandable details section
- "Back to Home" button
- Empty state message if no submissions

## Phase 5: CSS Styling

### 5.1 Create static/css/style.css

**Key Styles:**

1. **Global Styles**
   - Reset margins/padding
   - Set font family (Arial, sans-serif)
   - Background color
   - Text color

2. **Container**
   - Max width: 1200px
   - Centered with margin auto
   - Padding for mobile

3. **Header**
   - Background color
   - Padding
   - Text alignment

4. **Buttons**
   - Primary button style (blue)
   - Hover effects
   - Disabled state
   - Large buttons for home page

5. **Forms**
   - Input field styling
   - Label styling
   - Form group spacing
   - Checkbox styling

6. **Income Type Sections**
   - Category headers
   - Income type containers
   - Collapsible sections

7. **History Cards**
   - Card layout
   - Shadow effects
   - Expandable details

8. **Responsive Design**
   - Mobile breakpoints
   - Flexible layouts

## Phase 6: JavaScript Implementation

### 6.1 Create static/js/submit.js

**Key Functions:**

1. `showStep(stepNumber)` - Toggle between step 1 and 2
2. `validateUser()` - Call API to validate user
3. `toggleIncomeFields(checkbox)` - Show/hide amount/details fields
4. `collectIncomeData()` - Gather all selected income types
5. `submitTaxForm()` - Submit form to API
6. `displayMessage(message, type)` - Show success/error messages

**Event Listeners:**
- Next button click → validate user
- Back button click → return to step 1
- Submit button click → submit form
- Checkbox change → toggle fields

### 6.2 Create static/js/history.js

**Key Functions:**

1. `loadHistory()` - Fetch submissions from API
2. `displaySubmissions(submissions)` - Render submission list
3. `toggleDetails(submissionId)` - Expand/collapse details
4. `formatDate(dateString)` - Format date for display
5. `displayIncomeData(incomeData)` - Format income data

**On Page Load:**
- Call loadHistory()
- Display loading state
- Handle empty state

### 6.3 Create static/js/home.js (Optional)

Simple navigation logic if needed.

## Phase 7: Income Types Data

### 7.1 Parse income_type.md

Extract all 17 income types organized by 5 categories:

**Category 1: รายได้จากเงินเดือน**
1. เงินเดือนหรือเงินได้ตามสัญญาจ้างแรงงาน (มาตรา 40(1))
2. เงินได้ที่นายจ้างจ่ายให้ครั้งเดียวเพราะเหตุออกจากงาน (กรณีไม่นำไปรวมคำนวณภาษี) (มาตรา 40(1))

**Category 2: รายได้จากฟรีแลนซ์, รับจ้างทั่วไป**
3. เงินได้จากการรับจ้าง ฟรีแลนซ์ ค่าตำแหน่ง เบี้ยประชุม หรือค่านายหน้า (มาตรา 40(2))

**Category 3: รายได้จากทรัพย์สิน, การทำธุรกิจ, อาชีพอิสระ**
4. ค่าลิขสิทธิ์ ค่าสิทธิ์ในทรัพย์สินทางปัญญา (Royalty) และ ค่ากู๊ดวิลล์ (Goodwill) หรือ เงินได้รายปีที่ได้มาจากนิติกรรม และคำพิพากษาของศาล (มาตรา 40(3))
5. ค่าเช่า ค่าผิดสัญญาเช่าซื้อหรือซื้อขายเงินผ่อน (มาตรา 40(5))
6. ค่าตอบแทนจากการประกอบวิชาชีพอิสระ วิชากฎหมาย การประกอบโรคศิลปะ วิศวกรรม สถาปัตยกรรม การบัญชี ประณีตศิลปกรรม (มาตรา 40(6))
7. เงินได้จากการรับเหมาที่ผู้รับเหมาทั้งค่าแรงและค่าของ ที่ต้องลงทุนด้วยการจัดหาสัมภาระ ในส่วนสำคัญ นอกจากเครื่องมือ (มาตรา 40(7))
8. เงินได้จากธุรกิจ การพาณิชย์ การเกษตร การอุตสาหกรรม การขนส่ง และเงินได้อื่นๆ (มาตรา 40(8))
9. เงินได้จากการขายอสังหาริมทรัพย์ฯ (มาตรา 40(8))

**Category 4: รายได้จากการลงทุน**
10. ดอกเบี้ย เงินเทียบเท่าเงินปันผล เงินปันผลจากบริษัทต่างประเทศ ประโยชน์ใดๆ จากคริปโทเคอร์เรนซีหรือโทเคนดิจิทัล เงินเพิ่มทุน เงินลดทุน (มาตรา 40(4))
11. เงินปันผล ส่วนแบ่งกำไรจากหุ้น/กองทุน (มาตรา 40(4)(ข))
12. กำไรจากการขายกองทุนรวมเพื่อการเลี้ยงชีพ (RMF)
13. กำไรจากการขายกองทุนรวมหุ้นระยะยาว (LTF)
14. กำไรจากการขายกองทุนเพื่อการออม (SSF)
15. กำไรจากการขายหน่วยลงทุนในกองทุนรวมไทยเพื่อความยั่งยืน (Thai ESG)/แบบพิเศษ (Thai ESGX)
16. เงินได้พึงประเมินที่ได้ใช้สิทธิเลือกเสียภาษีโดยไม่ต้องนำมารวมคำนวณภาษีกับเงินได้อื่น

**Category 5: รายได้จากมรดกหรือได้รับมา**
17. เงินได้จากการให้หรือการรับ (มาตรา 40(8))

## Phase 8: Testing

### 8.1 Database Testing
- Verify tables created correctly
- Check Bobby Watson data inserted
- Test all database functions

### 8.2 API Testing
- Test /api/validate-user with correct/incorrect data
- Test /api/submit-tax with various income combinations
- Test /api/history returns all submissions

### 8.3 UI Testing
- Navigate between all pages
- Submit form with step 1 validation
- Select multiple income types
- Submit complete form
- View history with details
- Test responsive design

### 8.4 Integration Testing
- Complete end-to-end submission flow
- Verify data persistence
- Check error handling

## Phase 9: Documentation

### 9.1 Create README.md

Include:
- Project description
- Prerequisites (Python 3.8+)
- Installation steps
- Running the application
- Usage instructions
- Project structure
- Troubleshooting

## Implementation Order

Follow this sequence for efficient development:

1. ✅ Create project structure
2. ✅ Set up database (database.py)
3. ✅ Initialize database with Bobby Watson
4. ✅ Create Flask app with routes (app.py)
5. ✅ Create base.html template
6. ✅ Create home.html
7. ✅ Create submit.html with all income types
8. ✅ Create history.html
9. ✅ Add CSS styling (style.css)
10. ✅ Implement submit.js for form handling
11. ✅ Implement history.js for display
12. ✅ Test complete flow
13. ✅ Write README.md

## Common Pitfalls to Avoid

1. **Database**: Don't forget to commit transactions
2. **JSON**: Properly serialize/deserialize income_data
3. **Validation**: Check both client-side and server-side
4. **Error Handling**: Add try-catch blocks for API calls
5. **Date Formatting**: Use consistent datetime format
6. **Thai Characters**: Ensure UTF-8 encoding everywhere

## Success Criteria

- ✅ Application runs on localhost:5000
- ✅ Database initializes with Bobby Watson
- ✅ Can submit tax form with multiple income types
- ✅ Can view submission history
- ✅ All 17 income types are available
- ✅ Data persists across sessions
- ✅ UI is clean and functional
- ✅ No authentication required