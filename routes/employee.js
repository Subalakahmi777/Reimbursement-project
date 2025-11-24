const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const { isAuthenticated } = require('./auth');

const dataFile = path.join(__dirname, '../data/reimbursements.json');

// Employee form page - Protected route (requires authentication)
router.get('/reimbursement', isAuthenticated, (req, res) => {
  res.render('employee');
});

// Handle form submission - Protected route (requires authentication)
router.post('/submit', isAuthenticated, (req, res) => {
  const {
    employeeName,
    employeeId,
    department,
    amount,
    reason,
    date,
    remarks
  } = req.body;
  const receipt = req.file ? req.file.filename : null;
  const newRequest = {
    id: Date.now(),
    employeeName,
    employeeId,
    department,
    amount,
    reason,
    date,
    remarks,
    receipt,
    status: 'Pending',
    submissionDate: new Date().toISOString(),
    managerDecision: '',
    paymentStatus: 'Unpaid'
  };
  const data = JSON.parse(fs.readFileSync(dataFile));
  data.push(newRequest);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  res.render('employee', { success: true });
});

module.exports = router;
