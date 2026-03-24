import jwt from "jsonwebtoken";
import express from "express";
import user from "/db/init.sql";


const router = express.Router();

// // register a new user
// router.post("/register", async (req, res) => {
//   const { username, email, user_password } = req.body;
//   try {
//     const newUser = new user({ username, email, user_password });
//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(400).json({ error: "User already exists" });
//   }
// });

// export default router;
