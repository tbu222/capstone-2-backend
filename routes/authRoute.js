import express from 'express';
const router = express.Router();
import { login, singup } from '../controllers/authController.js';


router.post('/signup', singup);

router.post('/login', login);



export default router;