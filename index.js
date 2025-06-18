const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const expressLayout = require('express-ejs-layouts');

// Middleware
const isAuthenticated = require('./middlewares/auth');

// Route Files
const signupRoute = require('./routes/signup');
const savingGoalRoute = require('./routes/savingGoalRoutes');
const transactionRoute = require('./routes/transcationRoutes');
const forgotPasswordRoute = require('./routes/forgotPassword');
const mainRoutes = require('./routes/mainRoutes');

// App Init
const app = express();

// Middleware Setup
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'abd',
  resave: false,
  saveUninitialized: true
}));
app.use(expressLayout);
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.use(signupRoute);
app.use(savingGoalRoute);
app.use(transactionRoute);
app.use(forgotPasswordRoute);
app.use(mainRoutes); // includes /, /dashboard, /reports

// Database Connection
const connectionString = 'mongodb://localhost:27017/db-project';
mongoose
  .connect(connectionString)
  .then(() => console.log(`Connected to: ${connectionString}`))
  .catch(err => console.error(err.message));

// Start Server
app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
