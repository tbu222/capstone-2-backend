import express from "express";
import { addVideo, addView, getByTag, getVideo, random, removeVideo, search, sub, trend, updateVideo } from "../controllers/video.js"
import { verifyToken } from "../verifyToken.js";
const router = express.Router()
//Add Video
router.post("/", verifyToken, addVideo)

//Delete
router.delete("/:id", verifyToken, removeVideo)
//Get
router.get("/find/:id", getVideo)
//Update
router.put("/:id", verifyToken, updateVideo)
//view
router.put("/view/:id",  addView)
//trend video
router.get("/trend",  trend)
//random video
router.get("/random",  random)
//subscribe
router.get("/sub",verifyToken, sub)
//tags
router.get("/tags", getByTag)
//search
router.get("/search", search)
export default router;
