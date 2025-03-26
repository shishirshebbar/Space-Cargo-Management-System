const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ✅ Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        // Create and save new user (password hashing handled in model)
        const newUser = new User({ username, password });
        await newUser.save();

        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error("Register Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Login a user and generate JWT token
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid username or password" });
        }

        // Compare passwords
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid username or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.json({ success: true, token, user: { id: user._id, username: user.username } });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};

// ✅ Get user profile (protected route)
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ 
            success: true, 
            user: {
                id: user._id,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            } 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};