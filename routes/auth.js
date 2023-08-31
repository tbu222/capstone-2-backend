import express from "express";
import {signup, signin, googleAuth, logout} from "../controllers/auth.js"
const router = express.Router()

//Sign up
router.post("/signup", signup)
//Sign in
router.post("/signin", signin)
//Google login

router.post("/google", googleAuth)
//Logout
router.post("/logout", logout)
export default router;
