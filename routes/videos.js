import express from "express";
import { addVideo,getAllVideos, addView, getByTag, getSavedVideos, getVideo, random, removeVideo, search, sub, trend, updateVideo, getLikedVideos, getDislikedVideos, getHistory, updateHistory } from "../controllers/video.js"
import { verifyToken } from "../verifyToken.js";
const router = express.Router()
//Add Video
router.post("/", verifyToken, addVideo)

//get all video
router.post("/", getAllVideos);
//Delete
router.delete("/:id", verifyToken, removeVideo)
//Get 1 video
router.get("/find/:id", getVideo)
//Update
router.put("/:id", verifyToken, updateVideo)
//view
router.put("/view/:id",  addView);
//liked video
router.get('/likes', verifyToken, getLikedVideos)
//disliked video
router.get('/dislikes', verifyToken, getDislikedVideos);
//trend video
router.get("/trend",  trend);
//random video
router.get("/random",  random);
//subscribe
router.get("/sub",verifyToken, sub)
//tags
router.get("/tags", getByTag);
//search
router.get("/search", search);
//saved videos
router.get('/saved', verifyToken, getSavedVideos);
//watched
router.get('/history', verifyToken, getHistory);
//edit watched
router.put('/history/:id',verifyToken, updateHistory);
export default router;
