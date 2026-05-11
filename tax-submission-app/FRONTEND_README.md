# Tax Submission Frontend Application

## Overview
This is a modern, Thai-language web application frontend for the Tax Submission API. The application provides a user-friendly interface for submitting tax forms and viewing submission history.

## Features

### 🎨 Design
- **Modern Corporate Design**: Clean, professional interface with IBM Plex Sans Thai font
- **Color Scheme**: White and dark blue (#001d6c, #0f62fe) for a corporate look
- **Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Thai Language**: All content and interface elements in Thai

### 📄 Pages

#### 1. Homepage (`index.html`)
- Two main action buttons:
  - 📋 View Tax Submission History
  - 📝 Submit Tax Form

#### 2. History Page (`history.html`)
- Displays all tax submission records in a table format
- Shows: Name, National ID, Number of Income Types, Total Income, Submission Date
- Back button to return to homepage
- Empty state when no submissions exist

#### 3. Submit Form Page (`submit.html`)
- Table with 17 income type rows (based on Thai tax law)
- Each row has:
  - Income type description (in Thai)
  - Input field for amount
- Users only fill in income types they have
- Next button to proceed to confirmation

#### 4. Confirmation Page (`confirmation.html`)
- Summary table showing all entered income data
- Total amount calculation
- Two options:
  - Back button to edit data
  - Submit button to send to API
- After successful submission, redirects to homepage

## File Structure

```
tax-submission-app/
├── static/
│   ├── css/
│   │   └── styles.css          # All styling with IBM font
│   └── js/
│       └── app.js              # Frontend logic and API calls
├── templates/
│   ├── index.html              # Homepage
│   ├── history.html            # Submission history
│   ├── submit.html             # Income form
│   └── confirmation.html       # Confirmation page
└── FRONTEND_README.md          # This file
```

## API Integration

The frontend connects to the deployed backend API:
- **Base URL**: `https://application-18.29mcwwdwrirt.us-south.codeengine.appdomain.cloud`

### API Endpoints Used

1. **GET /api/history**
   - Retrieves all tax submissions
   - Used in: `history.html`

2. **POST /api/submit-tax**
   - Submits new tax form
   - Used in: `confirmation.html`
   - Payload format:
   ```json
   {
     "name": "John Doe",
     "national_id": "1234567890123",
     "income_data": [
       {
         "type": 1,
         "amount": 50000
       }
     ]
   }
   ```

## Income Types (17 Types)

The application supports all 17 Thai income types as defined in the OpenAPI specification:

1. เงินเดือนหรือเงินได้ตามสัญญาจ้างแรงงาน (มาตรา 40(1))
2. เงินได้ที่นายจ้างจ่ายให้ครั้งเดียวเพราะเหตุออกจากงาน (มาตรา 40(1))
3. เงินได้จากการรับจ้าง ฟรีแลนซ์ ค่าตำแหน่ง เบี้ยประชุม หรือค่านายหน้า (มาตรา 40(2))
4. ค่าลิขสิทธิ์ ค่าสิทธิ์ในทรัพย์สินทางปัญญา (Royalty) และค่ากู๊ดวิลล์ (มาตรา 40(3))
5. ค่าเช่า ค่าผิดสัญญาเช่าซื้อหรือซื้อขายเงินผ่อน (มาตรา 40(5))
6. ค่าตอบแทนจากการประกอบวิชาชีพอิสระ (มาตรา 40(6))
7. เงินได้จากการรับเหมา (มาตรา 40(7))
8. เงินได้จากธุรกิจ การพาณิชย์ การเกษตร การอุตสาหกรรม การขนส่ง (มาตรา 40(8))
9. เงินได้จากการขายอสังหาริมทรัพย์ฯ (มาตรา 40(8))
10. ดอกเบี้ย เงินเทียบเท่าเงินปันผล (มาตรา 40(4))
11. เงินปันผล ส่วนแบ่งกำไรจากหุ้น/กองทุน (มาตรา 40(4)(ข))
12. กำไรจากการขายกองทุนรวมเพื่อการเลี้ยงชีพ (RMF)
13. กำไรจากการขายกองทุนรวมหุ้นระยะยาว (LTF)
14. กำไรจากการขายกองทุนเพื่อการออม (SSF)
15. กำไรจากการขายหน่วยลงทุนในกองทุนรวมไทยเพื่อความยั่งยืน (Thai ESG)
16. เงินได้พึงประเมินที่ได้ใช้สิทธิเลือกเสียภาษี
17. เงินได้จากการให้หรือการรับ (มาตรา 40(8))

## How to Use

### Opening the Application

1. **Option 1: Direct File Access**
   - Navigate to `tax-submission-app/templates/`
   - Open `index.html` in a web browser

2. **Option 2: Local Web Server** (Recommended)
   ```bash
   cd tax-submission-app
   python -m http.server 8000
   ```
   Then open: `http://localhost:8000/templates/index.html`

### User Flow

1. **Start**: Open `index.html`
2. **View History**: Click "ดูประวัติการยื่นแบบฟอร์ม" → See all submissions
3. **Submit Tax**:
   - Click "ยื่นแบบฟอร์มภาษี"
   - Fill in income amounts for applicable types
   - Click "ถัดไป"
   - Review summary on confirmation page
   - Click "ยืนยันและส่ง"
   - Automatically redirected to homepage after success

## Technical Details

### CSS Features
- CSS Variables for consistent theming
- Flexbox and Grid layouts
- Smooth transitions and hover effects
- Loading spinner animations
- Responsive breakpoints for mobile devices

### JavaScript Features
- Async/await for API calls
- LocalStorage for temporary data storage
- Dynamic table generation
- Number formatting (Thai locale)
- Date/time formatting (Thai locale)
- Error handling with user-friendly messages
- Loading states during API calls

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Requires internet connection for API calls

## Error Handling

The application handles various error scenarios:
- Network errors
- API errors (400, 401, 500)
- Missing data validation
- Empty form submission prevention
- User-friendly Thai error messages

## Data Validation

- At least one income type must have an amount > 0
- Amounts must be positive numbers
- Data is validated before API submission
- Confirmation step prevents accidental submissions

## Security Notes

- Currently hardcoded to use National ID: `1234567890123`
- Name is automatically set to: `John Doe`
- CORS is enabled on the backend for cross-origin requests
- No sensitive data is stored in browser (cleared after submission)

## Future Enhancements

Potential improvements:
- User authentication system
- Multiple user support
- PDF export of submissions
- Print functionality
- Advanced filtering in history
- Data visualization (charts/graphs)
- Multi-language support
- Offline mode with sync

## Support

For issues or questions:
- Check the OpenAPI specification: `tax-submission-app/wxo/openapi.yaml`
- Review backend API documentation: `tax-submission-app/backend/README.md`
- Test API endpoints: `tax-submission-app/wxo/code_engine_endpoint.txt`

---

**Made with ❤️ for Thai taxpayers**