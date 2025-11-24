<<<<<<< HEAD
# Reimbursement Form Web App

A Node.js Express application for managing employee reimbursement requests with three roles: Employee, Manager, and Admin.

## Features
- Employee submits reimbursement requests with file upload
- Manager reviews, approves, or rejects requests
- Admin processes payments
- Status tracking through all stages

## Tech Stack
- Node.js
- Express.js
- EJS (views)
- Multer (file uploads)
- JSON file for data storage (simple, beginner-friendly)

## Project Structure
```
/ (project root)
├── app.js                # Main Express app
├── package.json          # Project metadata & dependencies
├── /routes               # Route handlers for each role
│   ├── employee.js
│   ├── manager.js
│   └── admin.js
├── /views                # EJS templates
│   ├── employee.ejs
│   ├── manager.ejs
│   ├── admin.ejs
│   └── partials/
├── /public               # Static assets (CSS, uploads)
│   ├── styles.css
│   └── /uploads          # Uploaded receipts
├── /data                 # Data storage
│   └── reimbursements.json
├── /.github
│   └── copilot-instructions.md
└── README.md
```

## Setup & Run
1. Install dependencies: `npm install`
2. Start server: `node app.js`
3. Access app at `http://localhost:3000`

## Roles & Workflow
- Employee: Fill and submit form
- Manager: Review, approve/reject
- Admin: Mark as paid/unpaid

---

See code files for implementation details.
=======
# Reimbursement-project
>>>>>>> a1444a0c6edb77e2036b0b803993d12c8fb0ea0d
