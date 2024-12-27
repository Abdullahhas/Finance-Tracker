const express = require("express")
const User = require("../models/users");
const router = express.Router()

router.get("/login" , (req , res)=> {
    res.render("admin/login" , { layout: "layouts/panel"  , user : []})
})

const bcrypt = require("bcrypt");


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("admin/login", {
        layout: "layouts/panel",
        user: { message: "Invalid username or password" },
      });
    }

    // Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.render("admin/login", {
        layout: "layouts/panel",
        user: { message: "Invalid username or password" },
      });
    }

    // Password is valid, set session and redirect
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send("An error occurred during login.");
  }
});


router.get("/signup" , (req , res)=>{
    res.render("admin/signup" , {layout : "layouts/panel"})
})



router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.send("User already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user with the hashed password
    const user = new User({
      ...req.body,
      password: hashedPassword,
    });

    await user.save();

    res.redirect("/login");
  } catch (err) {
    console.error("Error during sign-up:", err);
    res.status(500).send("An error occurred during sign-up.");
  }
});

  

router.get('/logout' , (req , res)=>{
    req.session.user = null
    res.redirect('/login')
})

module.exports = router