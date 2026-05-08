# Tax Submission Agent

A comprehensive tax submission application with WatsonX Orchestrate integration for automated tax workflows.

## Repository Information

- **Repository**: [th-bob-rd-aree-agent](https://github.com/tanyaaton/th-bob-rd-aree-agent)
- **Owner**: tanyaaton
- **Branch**: main

## Agent Tools

The Tax Submission Agent provides three core tools for tax-related operations:

### 1. validateUser
**Operation ID**: `validateUser`  
**Endpoint**: `POST /api/validate-user`  
**Purpose**: Validates a user's identity using their 13-digit Thai national ID

**Required Parameters**:
- `national_id` (string): 13-digit Thai national ID

**Response**:
- Success: Returns user validation status and profile information
- Error: Returns validation failure message

### 2. submitTax
**Operation ID**: `submitTax`  
**Endpoint**: `POST /api/submit-tax`  
**Purpose**: Submits tax forms with user details and income information

**Required Parameters**:
- `name` (string): User's full name
- `national_id` (string): 13-digit Thai national ID
- `income_data` (array): Array of income items, each containing:
  - `type` (integer 1-17): Income type ID
  - `amount` (number): Income amount
  - `details` (string, optional): Additional details

**Response**:
- Success: Returns submission ID and confirmation message
- Error: Returns validation or submission failure message

### 3. getSubmissionHistory
**Operation ID**: `getSubmissionHistory`  
**Endpoint**: `GET /api/history`  
**Purpose**: Retrieves all tax submissions from the system

**Required Parameters**: None

**Response**:
- Success: Returns array of submission records with full details
- Error: Returns error message

## Income Types

The system supports 17 income types as defined in Thai tax regulations:

1. เงินเดือนหรือเงินได้ตามสัญญาจ้างแรงงาน (Salary/employment income)
2. เงินได้ที่นายจ้างจ่ายให้ครั้งเดียวเพราะเหตุออกจากงาน (Severance pay)
3. เงินได้จากการรับจ้าง ฟรีแลนซ์ (Freelance/contract work)
4. ค่าลิขสิทธิ์ ค่าสิทธิ์ในทรัพย์สินทางปัญญา (Royalties/intellectual property)
5. ค่าเช่า ค่าผิดสัญญาเช่าซื้อ (Rental income)
6. ค่าตอบแทนจากการประกอบวิชาชีพอิสระ (Professional services)
7. เงินได้จากการรับเหมา (Contracting income)
8. เงินได้จากธุรกิจ การพาณิชย์ (Business/commercial income)
9. เงินได้จากการขายอสังหาริมทรัพย์ (Real estate sales)
10. ดอกเบี้ย เงินปันผล (Interest/dividends)
11. เงินปันผล ส่วนแบ่งกำไร (Dividends/profit sharing)
12. กำไรจากการขาย RMF (RMF fund gains)
13. กำไรจากการขาย LTF (LTF fund gains)
14. กำไรจากการขาย SSF (SSF fund gains)
15. กำไรจากการขาย Thai ESG/ESGX (ESG fund gains)
16. เงินได้พึงประเมินที่เลือกเสียภาษีแยก (Separately taxed income)
17. เงินได้จากการให้หรือการรับ (Gifts/donations)

## Project Structure

```
th-bob-rd-aree-agent/
├── tax-submission-app/          # Main application directory
│   ├── backend/                 # Backend API service
│   │   ├── app.py              # Backend Flask application
│   │   ├── database.py         # Database operations
│   │   └── requirements.txt    # Backend dependencies
│   ├── static/                  # Frontend static assets
│   │   ├── css/                # Stylesheets
│   │   └── js/                 # JavaScript files
│   ├── templates/              # HTML templates
│   ├── wxo/                    # WatsonX Orchestrate configurations
│   │   ├── tax_submission_agent.yaml  # Agent configuration
│   │   └── openapi.yaml        # OpenAPI specification
│   └── README.md               # Application documentation
├── ARCHITECTURE.md             # System architecture documentation
├── IMPLEMENTATION_GUIDE.md     # Implementation guide
├── TECHNICAL_SPEC.md          # Technical specifications
└── README.md                  # This file
```

## Getting Started

See the [tax-submission-app/README.md](tax-submission-app/README.md) for detailed setup and deployment instructions.

## Documentation

- [Architecture Documentation](ARCHITECTURE.md)
- [Implementation Guide](IMPLEMENTATION_GUIDE.md)
- [Technical Specifications](TECHNICAL_SPEC.md)
- [Income Type Reference](income_type.md)

## License

This project is part of the IBM WatsonX ecosystem.