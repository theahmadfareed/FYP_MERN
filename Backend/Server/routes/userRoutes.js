const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt"); // You need to install the bcrypt library for password hashing

const User = require("../models/user"); // Replace with the actual path to your user model

router.post("/sign-up", async (req, res) => {
  try {
    const { u_name, u_email, u_password } = req.body;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ u_name }, { u_email }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(u_password, 10);

    // Create a new user with the hashed password
    const newUser = new User({
      username: u_name,
      email: u_email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const { u_name, u_password } = req.body;
    console.log(u_name);
    console.log(u_password);

    // Find the user by username
    const existingUser = await User.findOne({ username: u_name }); // Fix here
    if (!existingUser) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(
      u_password,
      existingUser.password
    ); // Add await here
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "Sign-in successful", user: existingUser });
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
