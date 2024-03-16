const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const PORT=8000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// mongoose connection
mongoose.connect("mongodb://localhost:27017/socialMedia-db")
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error("MongoDB connection error:", error));

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Please porvide user name']
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});
// define Model
const User = mongoose.model('User', userSchema);
// =====signUp handler===
app.post('/signup', async (req, res) => {
    const { username,email, password } = req.body;
    try {
        const check = await User.findOne({ email: email });
        if (check) {
            res.status(409).json("User already exists");

        } else {
            await User.create({ username,email, password });
            res.status(201).json("User created successfully");
        }
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json("Error signing up");
    }
});
//=== create login Page=====//
app.get('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email, password: password });
        if (user) {
            res.status(200).json("Login successful");
            console.log(req.body);
        } else {
            res.status(401).json("Invalid email or password");
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json("Error logging in");
    }
});
app.listen(PORT,()=>{console.log(`server is listening at ${PORT}`)});
