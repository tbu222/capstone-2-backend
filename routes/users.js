import express from "express";
import {update, remove, getUser, subscribe, unsubscribe, like, dislike} from "../controllers/user.js"
import { verifyToken } from "../verifyToken.js";
const router = express.Router()

//update info
router.put("/:id",verifyToken, update)

//delete
router.delete("/:id",verifyToken, remove)

//get info
router.get("/find/:id", getUser)

//subscribe
router.put("/sub/:id",verifyToken, subscribe)
//unsub
router.put("/unsub/:id",verifyToken, unsubscribe)
//like
router.put("/like/:videoId",verifyToken, like)
//dislike
router.put("/dislike/:videoId",verifyToken, dislike)
export default router;
