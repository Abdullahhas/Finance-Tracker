const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const session = require("express-session")
const isAuthenticated = require("./middlewares/auth"); 
const Transaction = require("./models/transcations")
const SavingsGoal = require("./models/savingGoals")


const expressLayout = require('express-ejs-layouts');
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret : "abd",
  resave : false,
  saveUninitialized : true
}))


// Middleware to parse JSON data
app.use(bodyParser.json());

app.use(express.json());
app.use(expressLayout);
app.use(express.static("public"))
app.set("view engine" , "ejs")


const signupRout = require('./routes/signup')
app.use(signupRout)

const savingGoalRout = require('./routes/savingGoalRoutes')
app.use(savingGoalRout)

const transactionRout = require('./routes/transcationRoutes')
app.use(transactionRout)





app.get('/', (req, res) => {
 res.render("admin/landing" , {layout : "layouts/panel"} )
});

app.get('/dashboard', isAuthenticated, (req, res) => {
      res.render("admin/dashboard" , {layout : "layouts/panel" ,user: req.session.user} )
 });

// Route to fetch reports
app.get("/reports", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login"); // Ensure user is logged in
  }

  try {
    // Get the transactions for the logged-in user
    const transactions = await Transaction.find({ userId: req.session.user._id });

    // Process data for charts (you can filter by category, type, etc.)
    const expenseData = transactions.filter(transaction => transaction.type === 'expense');
    const incomeData = transactions.filter(transaction => transaction.type === 'income');

    const expensesByCategory = expenseData.reduce((acc, curr) => {
      if (!acc[curr.category]) {
        acc[curr.category] = 0;
      }
      acc[curr.category] += curr.amount;
      return acc;
    }, {});

     // Process data for savings chart
     const savingsGoals = await SavingsGoal.find({ user_id: req.session.user._id });

     const savingsProgress = savingsGoals.map(goal => ({
       goalName: goal.goal_name,
       target: goal.target_amount,
       current: goal.current_amount
     }));
     console.log("Savings Progress Data:", savingsProgress);

    // Pass data to the frontend for chart rendering
    res.render("admin/reports", {
      layout: "layouts/panel",
      user: req.session.user,
      transactions,
      expensesByCategory,
      savingsProgress,
      incomeData
    }
    

  );
  console.log("Expenses by Category:", expensesByCategory);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: err.message });
  }
});




let connectionString = "mongodb://localhost:27017/db-project";

mongoose
  .connect(connectionString)
  .then(() => {
    console.log(`Connected To: ${connectionString}`);
  })
  .catch((err) => {
    console.log(err.message);
  });



app.listen(3000, () => {
  console.log("Server started at localhost:3000");
});


app.get('/forgot-password', (req, res) => {
  res.render('admin/forgot-password', { layout: 'layouts/panel' });
});



const User = require('./models/users');
const bcrypt = require("bcrypt")


app.post("/forgot-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const user = await User.findOne({ email });

    if (!user) {
      return res.send("User not found.");
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);


    user.password = hashedPassword;

   
    await user.save({ validateModifiedOnly: true });

    res.send("Password successfully updated.");
  } catch (err) {
    console.error("Error during password reset:", err);
    res.status(500).send("An error occurred while resetting the password.");
  }
});


app.get("/forgot-password", (req, res) => {
  res.render("forgot-password"); // Render the forgot password page with the form
});








// email


