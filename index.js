const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from the project's root directory
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://niteshraj355yadav:<db_password>@cluster0.rx2zd8x.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Define Schema with required fields
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String
});

// Create Model
const UserModel = mongoose.model("User", userSchema);

// API Endpoint to Handle Form Submission
app.post("/api/contact", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Create a new user instance
        const newUser = new UserModel({
            name,
            email,
            subject,
            message
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: "✅ Your message has been sent successfully!" });
    } catch (err) {
        console.error("❌ Error saving data:", err);
        res.status(500).json({ message: "❌ An error occurred while sending your message. Please try again later." });
    }
});

// The express.static middleware will automatically serve index.html for the root path '/'
// and also handle all other static files like about.html, contact.html, and everything in /assets.

// Start Server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
