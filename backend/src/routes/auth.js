import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password: plainPass } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = new User({ username, email, password: plainPass });
    await user.save();

    const { password, ...rest } = user.toObject();

    // Create JWT
    const payload = { user: { id: user._id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: rest });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password: plainPass } = req.body;

    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(plainPass, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user._id } };

    const { password, ...reset } = user;

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: reset });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;
