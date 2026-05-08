# Tax Submission Application - Architecture

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Client Browser"
        A[Home Page]
        B[Submit Form Step 1]
        C[Submit Form Step 2]
        D[History Page]
    end
    
    subgraph "Flask Application"
        E[app.py - Routes]
        F[database.py - DB Operations]
    end
    
    subgraph "Database"
        G[(SQLite DB)]
        H[users table]
        I[tax_submissions table]
    end
    
    A -->|Navigate| B
    A -->|Navigate| D
    B -->|POST /api/validate-user| E
    B -->|Valid| C
    C -->|POST /api/submit-tax| E
    D -->|GET /api/history| E
    E -->|Query/Insert| F
    F -->|SQL Operations| G
    G --> H
    G --> I
    
    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#e1f5ff
    style D fill:#e1f5ff
    style E fill:#fff4e1
    style F fill:#fff4e1
    style G fill:#e8f5e9
    style H fill:#e8f5e9
    style I fill:#e8f5e9
```

## Data Flow - Submit Tax Form

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Flask
    participant Database
    
    User->>Browser: Click "Submit New Tax Form"
    Browser->>Flask: GET /submit
    Flask-->>Browser: Return submit.html
    
    User->>Browser: Enter Name & National ID
    User->>Browser: Click "Next"
    Browser->>Flask: POST /api/validate-user
    Flask->>Database: Check user exists
    Database-->>Flask: User found
    Flask-->>Browser: {valid: true}
    
    Browser->>Browser: Show Step 2 (Income Types)
    User->>Browser: Select income types & fill amounts
    User->>Browser: Click "Submit"
    Browser->>Flask: POST /api/submit-tax
    Flask->>Database: INSERT into tax_submissions
    Database-->>Flask: Success
    Flask-->>Browser: {success: true, submission_id: 1}
    Browser-->>User: Show success message
```

## Data Flow - View History

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Flask
    participant Database
    
    User->>Browser: Click "View Submission History"
    Browser->>Flask: GET /history
    Flask-->>Browser: Return history.html
    
    Browser->>Flask: GET /api/history
    Flask->>Database: SELECT * FROM tax_submissions
    Database-->>Flask: Return all submissions
    Flask-->>Browser: JSON array of submissions
    Browser->>Browser: Render submission list
    Browser-->>User: Display history
```

## Component Breakdown

### Frontend Components

1. **Home Page (home.html)**
   - Navigation buttons
   - Simple landing interface

2. **Submit Form (submit.html)**
   - Step 1: User validation form
   - Step 2: Income types selection (17 types from 5 categories)
   - Dynamic field visibility
   - Form validation

3. **History Page (history.html)**
   - List of all submissions
   - Expandable details view
   - Date formatting

### Backend Components

1. **Flask Routes (app.py)**
   - `/` - Home page
   - `/submit` - Submit form page
   - `/history` - History page
   - `/api/validate-user` - User validation endpoint
   - `/api/submit-tax` - Tax submission endpoint
   - `/api/history` - Get submissions endpoint

2. **Database Operations (database.py)**
   - `init_db()` - Create tables and seed data
   - `validate_user()` - Check user credentials
   - `submit_tax_form()` - Insert new submission
   - `get_all_submissions()` - Retrieve history

### Database Schema

```mermaid
erDiagram
    users ||--o{ tax_submissions : submits
    users {
        int id PK
        text national_id UK
        text name
        text lastname
        text address
        date birthday
    }
    tax_submissions {
        int id PK
        int user_id FK
        datetime submission_date
        text name
        text national_id
        text income_data
    }
```

## File Organization

```
tax-submission-app/
│
├── Backend (Python)
│   ├── app.py              # Flask routes and API endpoints
│   └── database.py         # Database initialization and operations
│
├── Frontend (HTML/CSS/JS)
│   ├── templates/          # Jinja2 HTML templates
│   │   ├── base.html       # Base template with common elements
│   │   ├── home.html       # Landing page
│   │   ├── submit.html     # Tax submission form
│   │   └── history.html    # Submission history
│   │
│   └── static/             # Static assets
│       ├── css/
│       │   └── style.css   # All styling
│       └── js/
│           ├── home.js     # Home page logic
│           ├── submit.js   # Form handling and validation
│           └── history.js  # History display logic
│
├── Database
│   └── tax_database.db     # SQLite database (auto-generated)
│
└── Configuration
    ├── requirements.txt    # Python dependencies
    ├── README.md          # Setup instructions
    ├── TECHNICAL_SPEC.md  # Technical specification
    └── ARCHITECTURE.md    # This file
```

## Technology Choices Rationale

1. **Flask**: Lightweight, easy to set up, perfect for local applications
2. **SQLite**: No server setup required, file-based, ideal for single-user local apps
3. **Vanilla JavaScript**: No build process, simple deployment, sufficient for this use case
4. **Jinja2 Templates**: Built into Flask, server-side rendering for simplicity

## Security Considerations

Since this is a local, single-user application:
- No authentication required
- No HTTPS needed (localhost only)
- No CORS issues
- No external API calls
- Data stored locally in SQLite file

## Performance Considerations

- Small dataset (single user, limited submissions)
- No pagination needed initially
- Simple queries (no complex joins)
- Local database (fast access)
- Minimal JavaScript (fast page loads)

## Future Enhancements (Out of Scope)

- Multi-user support with authentication
- PDF export of tax forms
- Tax calculation features
- Data backup/export functionality
- Mobile responsive design
- Form auto-save functionality