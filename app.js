require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

const employeeRoutes = require('./routes/employee');
const managerRoutes = require('./routes/manager');
const adminRoutes = require('./routes/admin');
const { router: authRouter } = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3005;

// Connect to MongoDB
connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'reimbursement-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Root route redirect to login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// Routes (auth routes BEFORE multer)
app.use('/', authRouter);

// File upload setup - only for employee routes
const upload = multer({ dest: path.join(__dirname, 'public', 'uploads') });
app.use('/', upload.single('receipt'), employeeRoutes);
app.use('/manager', managerRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
