const express = require('express');
const router = express.Router();
const Reimbursement = require('../models/Reimbursement');

// Manager dashboard
router.get('/', async (req, res) => {
  try {
    const requests = await Reimbursement.find().sort({ createdAt: -1 });
    res.render('manager', { requests });
  } catch (error) {
    console.error('Error fetching reimbursements:', error);
    res.render('manager', { requests: [] });
  }
});

// Approve request
router.post('/approve/:id', async (req, res) => {
  try {
    await Reimbursement.findByIdAndUpdate(req.params.id, {
      status: 'Approved',
      managerDecision: 'Approved'
    });
  } catch (error) {
    console.error('Error approving request:', error);
  }
  res.redirect('/manager');
});

// Reject request
router.post('/reject/:id', async (req, res) => {
  try {
    await Reimbursement.findByIdAndUpdate(req.params.id, {
      status: 'Rejected',
      managerDecision: 'Rejected'
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
  }
  res.redirect('/manager');
});

module.exports = router;
