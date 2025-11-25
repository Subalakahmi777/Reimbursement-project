const express = require('express');
const router = express.Router();
const Reimbursement = require('../models/Reimbursement');
const { isAuthenticated } = require('./auth');

// Employee form page - Protected route (requires authentication)
router.get('/reimbursement', isAuthenticated, (req, res) => {
  res.render('employee');
});

// Handle form submission - Protected route (requires authentication)
router.post('/submit', isAuthenticated, async (req, res) => {
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

  try {
    const newReimbursement = new Reimbursement({
      employeeName,
      employeeId,
      department,
      amount,
      reason,
      date,
      remarks,
      receipt,
      status: 'Pending',
      managerDecision: '',
      paymentStatus: 'Unpaid'
    });

    await newReimbursement.save();
    res.render('employee', { success: true });
  } catch (error) {
    console.error('Submission error:', error);
    res.render('employee', { success: false, error: 'Failed to submit reimbursement' });
  }
});

module.exports = router;
