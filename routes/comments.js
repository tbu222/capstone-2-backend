import express from "express";
import { addCommment, getCommment, removeCommment } from "../controllers/comment.js"
import { verifyToken } from "../verifyToken.js";
const router = express.Router()
//add comment
router.post("/:videoId", verifyToken, addCommment)

//get comment
router.get("/:videoId", getCommment)

//remove comment
router.delete("/:id", verifyToken, removeCommment)
export default router;
