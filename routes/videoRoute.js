import express from 'express';
const router = express.Router();
import verifyAuth from '../middlewares/authMiddleware.js';
import {
	addVideo,
	getAllVideos,
	getVideoById,
	updateVideo,
	deleteVideo,
	getLikedVideos,
	getDislikedVideos,
	getSavedVideos,
	getSubscribed,
	getTrend,
	getRandomVideos,
	search,
	viewVideo,
	getHistory,
	addToHistory,
} from '../controllers/videoController.js';

router.post('/', verifyAuth, addVideo);

router.get('/', getAllVideos);
router.get('/find/:id', getVideoById);

router.delete('/:id', verifyAuth, deleteVideo);
router.put('/:id', verifyAuth, updateVideo);
router.put('/view/:id', verifyAuth, viewVideo);

router.get('/likes', verifyAuth, getLikedVideos);
router.get('/dislikes', verifyAuth, getDislikedVideos);
router.get('/saved', verifyAuth, getSavedVideos);
router.get('/subscribes', verifyAuth, getSubscribed);


router.get('/trend', getTrend);
router.get('/random', getRandomVideos);

router.get('/search', search);

router.get('/history', verifyAuth, getHistory);
router.put('/history/:id', verifyAuth, addToHistory);

export default router;
