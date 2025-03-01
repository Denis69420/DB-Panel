// backend/app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const morgan = require('./middleware/logger');
const rateLimit = require('./middleware/rateLimit');
const passport = require('passport');
const session = require('express-session');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan); // HTTP request logging
app.use(rateLimit); // Global rate limiting

// Setup session (needed by Passport)
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));


const universalSearch = require('./routes/universalSearch');
app.use('/api', universalSearch);


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Load authentication routes (also configures Passport)
app.use('/auth', require('./routes/auth'));

// Protected API routes (e.g., search)
app.use('/api', require('./routes/users'));

// Serve React production build (if built)
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
