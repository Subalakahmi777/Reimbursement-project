const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const dataFile = path.join(__dirname, '../data/reimbursements.json');

// Manager dashboard
router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  res.render('manager', { requests: data });
});

// Approve request
router.post('/approve/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  const reqId = parseInt(req.params.id);
  const idx = data.findIndex(r => r.id === reqId);
  if (idx !== -1) {
    data[idx].status = 'Approved';
    data[idx].managerDecision = 'Approved';
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  }
  res.redirect('/manager');
});

// Reject request
router.post('/reject/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataFile));
  const reqId = parseInt(req.params.id);
  const idx = data.findIndex(r => r.id === reqId);
  if (idx !== -1) {
    data[idx].status = 'Rejected';
    data[idx].managerDecision = 'Rejected';
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  }
  res.redirect('/manager');
});

module.exports = router;
