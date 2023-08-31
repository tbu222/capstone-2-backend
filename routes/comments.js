import express from "express";
import { addCommment, getCommment, removeCommment } from "../controllers/comment.js"
import { verifyToken } from "../verifyToken.js";
const router = express.Router()

router.post("/", verifyToken, addCommment)

router.get("/:videoId", getCommment)

router.delete("/:id", verifyToken, removeCommment)
export default router;
