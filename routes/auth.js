const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.redirect('/login.html');
};

// POST /login - Handle login authentication
router.post('/login', (req, res) => {
  const { employeeId, password } = req.body;

  // Validate input
  if (!employeeId || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Employee ID and Password are required' 
    });
  }

  // Read users from JSON file
  const usersPath = path.join(__dirname, '../data/users.json');
  
  try {
    const usersData = fs.readFileSync(usersPath, 'utf8');
    const users = JSON.parse(usersData);

    // Find user with matching credentials
    const user = users.find(
      u => u.employeeId === employeeId && u.password === password
    );

    if (user) {
      // Create session
      req.session.user = {
        employeeId: user.employeeId,
        name: user.name,
        role: user.role,
        department: user.department
      };

      // Send success response
      return res.json({ 
        success: true, 
        message: 'Login successful',
        redirectUrl: '/reimbursement'
      });
    } else {
      // Invalid credentials
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid Employee ID or Password' 
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again.' 
    });
  }
});

// GET /logout - Handle logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/login.html');
  });
});

// GET /check-auth - Check authentication status
router.get('/check-auth', (req, res) => {
  if (req.session && req.session.user) {
    res.json({ authenticated: true, user: req.session.user });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = { router, isAuthenticated };
