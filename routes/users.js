import express from "express";
import {update, remove,getAllUsers, getUser, subscribe, unsubscribe, like, dislike, save, unsave} from "../controllers/user.js"
import { verifyToken } from "../verifyToken.js";
const router = express.Router();

//update info
router.put("/:id",verifyToken, update)

//delete
router.delete("/:id",verifyToken, remove)

//get all user
router.get('/', getAllUsers);

//get 1 user
router.get("/find/:id", getUser)

//subscribe
router.put("/sub/:id",verifyToken, subscribe)
//unsub
router.put("/unsub/:id",verifyToken, unsubscribe)
//like
router.put("/like/:id",verifyToken, like)
//dislike
router.put("/dislike/:id",verifyToken, dislike)
//save video
router.put('/save/:id', verifyToken, save);
//remove from saved video
router.put('/unsave/:id', verifyToken, unsave);
export default router;
