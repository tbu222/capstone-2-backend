import express from "express";
import {signup, signin, googleAuth} from "../controllers/auth.js"
const router = express.Router()

//Sign up
router.post("/signup", signup)
//Sign in
router.post("/signin", signin)
//Google login

router.post("/google", googleAuth)

export default router;
