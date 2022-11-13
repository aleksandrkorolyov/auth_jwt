require("dotenv").config();
require("./config/database").connect();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const express = require("express");

const app = express();

app.use(express.json());

// Logic goes here

module.exports = app;

// importing user context
const User = require("./model/user");

// Register
app.post("/register", (req, res) => {
    try {
        

        const user = register(req, res)

        // return new user
        res.status(201).json(user);
      } catch (err) {
        console.log(err);
      }
});

async function register(req,res) {
    
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    // const oldUser = await User.findOne({ email });

    // if (oldUser) {
    //   return res.status(409).send("User Already Exist. Please Login");
    // }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;
    return user
}

// Login
app.post("/login", (req, res) => {
// our login logic goes here
});
