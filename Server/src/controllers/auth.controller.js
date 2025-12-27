const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// RegisterController
async function registerUser(req, res) {
  try {
    const { username, email, password, dietaryPreferences } = req.body;

    // Check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "User or Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
      dietaryPreferences,
    });

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // Send Cookie
    res.cookie("token", token, {
      httpOnly: true,
    });

    res.status(201).json({
      message: "User Registered Successfully",
      status: "success",
      data: { user: newUser },
    });
  } catch (error) {
    console.log("Register User Error :", error);
    res.status(500).json({ message: error.message });
  }
}

//loginController
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Check if email and password exist
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user & explicitly select password (because select: false in schema)
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
        return res.status(401).send({ message: "Invalid email or password" });
      }

       // Check password into DB
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

     //Create jwt Token
     const token = jwt.sign(
        {
          id: user._id,
          username: user.username,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
  
      res.cookie("token", token, {
        httpOnly: true,
      });

    res.status(200).json({
      message: "User Login Successfully",
      status: "success",
      data: { user },
    });
  } catch (err) {
    console.log("UserLogin Error :", err);
    res.status(500).json({ message: err.message });
  }
}

//logoutUser Controller
async function logoutUser(req,res){
    try{
        const { token } = req.cookies;
        if (!token) {
            res.status(400).json({ status: 'Failed', message: 'Logged IN First' });
          }

          res.clearCookie("token", {
            httpOnly: true,
            secure: true,
          });
          
          res.status(200).json({ status: 'success', message: 'Logged out successfully' });
    }catch(err){
        console.log("Logout User Error :",err)
        res.status(401).json({ status: 'Failed', message: 'Logged out Failed' });
    }
}

// Update Dietary Preferences
async function updateDietaryPreferences(req, res) {
  try {
    const { dietaryPreferences } = req.body;
    
    if (!Array.isArray(dietaryPreferences)) {
      return res.status(400).json({ message: "Dietary preferences must be an array" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { dietaryPreferences },
      { new: true, select: "-password" }
    );

    res.status(200).json({
      message: "Dietary preferences updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.log("Update Dietary Preferences Error:", error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { registerUser, loginUser, logoutUser, updateDietaryPreferences };
