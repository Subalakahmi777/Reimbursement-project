const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const dataFile = path.join(__dirname, '../data/reimbursements.json');

// Admin panel
router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  res.render('admin', { requests: data });
});

// Mark as Paid
router.post('/paid/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  const reqId = parseInt(req.params.id);
  const idx = data.findIndex(r => r.id === reqId);
  if (idx !== -1) {
    data[idx].paymentStatus = 'Paid';
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  }
  res.redirect('/admin');
});

// Mark as Unpaid (Cancel)
router.post('/unpaid/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  const reqId = parseInt(req.params.id);
  const idx = data.findIndex(r => r.id === reqId);
  if (idx !== -1) {
    data[idx].paymentStatus = 'Unpaid';
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  }
  res.redirect('/admin');
});

module.exports = router;
