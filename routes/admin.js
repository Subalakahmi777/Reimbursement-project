const express = require('express');
const router = express.Router();
const Reimbursement = require('../models/Reimbursement');

// Admin panel
router.get('/', async (req, res) => {
  try {
    const requests = await Reimbursement.find().sort({ createdAt: -1 });
    res.render('admin', { requests });
  } catch (error) {
    console.error('Error fetching reimbursements:', error);
    res.render('admin', { requests: [] });
  }
});

// Mark as Paid
router.post('/markPaid/:id', async (req, res) => {
  try {
    await Reimbursement.findByIdAndUpdate(req.params.id, {
      paid: true,
      paymentStatus: 'Paid'
    });
  } catch (error) {
    console.error('Error marking as paid:', error);
  }
  res.redirect('/admin');
});

// Mark as Unpaid (Cancel)
router.post('/unpaid/:id', async (req, res) => {
  try {
    await Reimbursement.findByIdAndUpdate(req.params.id, {
      paid: false,
      paymentStatus: 'Unpaid'
    });
  } catch (error) {
    console.error('Error marking as unpaid:', error);
  }
  res.redirect('/admin');
});

module.exports = router;
