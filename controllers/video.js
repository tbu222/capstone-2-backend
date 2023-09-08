import User from "../models/User.js";
import Video from "../models/Video.js";
import mongoose from 'mongoose';
import { createError } from "../error.js";
//add video
export const addVideo = async (req, res, next)=>{
    console.log("data",req.userData.id);
    console.log("user",req.user.id)
    try{
        const id = req.userData.id;
        const newVideo =  new Video({...req.body});
        const savedVideo = await newVideo.save();
        await  User.findByIdAndUpdate(id, {
            $addToSet: { userVideos: newVideo._id},
        });
        res.status(200).json(savedVideo);
    }catch(err){
        next(err)
    }
}

export const updateVideo = async (req, res, next)=>{
    try{
        const video = await Video.findById(req.params.id)
        if(!video) return next(createError(404, "Video not found!"))
        if (req.user.id === video.userId){
            const updatedVideo= await Video.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            },{new:true});
            res.status(200).json(updatedVideo);
        } else{
            return next(createError(403, "Not Allowed"))
        }
    }catch(err){
        next(err)
    }
    
}
export const removeVideo = async (req, res, next)=>{
    try{
        const video = await Video.findById(req.params.id)
        if(!video) return next(createError(404, "Video not found!"))
        if (req.user.id === video.userId){
            await Video.findByIdAndDelete(req.params.id);
            res.status(200).json("successful removed Video");
        } else{
            return next(createError(403, "Not Allowed"))
        }
    }catch(err){
        next(err)
    }
}
//get 1 video
export const getVideo = async (req, res, next)=>{
    try{
        const videoId = req.params.id;
		if (!videoId || !mongoose.isValidObjectId(videoId))
			return next(createError(401, 'not a valid videoId'));

		const video = await Video.findOne({ _id: videoId }).populate({
			path: 'userId',
			model: 'User',
			select: { password: 0, __v: 0 },
		});
		if (!video) 
            return next(createError(404, 'video does not exist '));

		res.status(200).json({ ...video._doc });
    }catch(err){
        next(err)
    }
}
//all video
export const getAllVideos = async (req, res, next) => {
	try {
		const videos = await Video.find().sort({ createdAt: -1 }).populate({
			path: 'userId',
			model: 'User',
			select: 'name img',
		});
		res.status(200).json({
			count: videos.length,
			videos,
		});
	} catch (error) {
		next(error);
	}
};
//trend video
export const trend = async (req, res, next)=>{
    try {
		const videos = await Video.find()
			.populate({
				path: 'userId',
				model: 'User',
				select: 'name img',
			})
			.sort({ views: -1 });
		res.status(200).json({ videos });
	} catch (error) {
		next(error);
    }
}
//add view
export const addView = async (req, res, next)=>{
    try{
        const videoId = req.params.id;
		if (!videoId || !mongoose.isValidObjectId(videoId))
			return next(createError(401, 'Not a valid videoId'));

		await Video.findByIdAndUpdate(videoId, {
			$inc: { views: 1 },
		});
        res.status(200).json("View increased")
    }catch(err){
        next(err)
    }
}
//get random video
export const random = async (req, res, next)=>{
    try{
        const video = await Video.aggregate([{$sample:{size:40}}])
        res.status(200).json(video);
    }catch(err){
        next(err)
    }
}
//subscribe video
export const sub = async (req, res, next)=>{
    try {
		const userId = req.userData.id;
        console.log("req.userData",req.userData.id);
        console.log("req.user",req.user.id)
		const user = await User.findById(userId);
		const subscribed = await User.find({
			_id: { $in: user.subscribedUsers },
		}).select('userVideos');
		if (!subscribed) return res.status(200).json({ videos: [] });

		let subVideos = subscribed.map((sub) => sub.userVideos);
		subVideos = subVideos.flat();
		const videos = await Video.find({
			_id: { $in: subVideos },
		}).populate({
			path: 'userId',
			model: 'User',
			select: 'name img',
		});

		res.status(200).json({ count: videos.length, videos, subscribed });
	} catch (error) {
		next(error);
	}
}

export const getByTag = async (req, res, next)=>{
    const tags = req.query.tags.split(",")
    console.log(tags)
    try{
        const video = await Video.find({tags:{$in:tags}}).limit(20);
        res.status(200).json(video);
    }catch(err){
        next(err)
    }
}


export const search = async (req, res, next)=>{
    const query = req.query.q;
    try{
        const video = await Video.find({title:{$regex:query,$options:"i"}}).limit(40);
        res.status(200).json(video);
    }catch(err){
        next(err);
    }
}

export const updateHistory = async (req, res, next) => {
	try {
		const videoId = req.params.id;
		const userId = req.userData.id;

		if (!videoId || !mongoose.isValidObjectId(videoId))
			return next(createError(401, 'not a valid videoId'));
		let video = await Video.findById(videoId);
		let user = await User.findById(userId);

		if (!video) return next(createError(404, 'video does not exist'));
		if (!user) return next(createError(404, 'user does not exist'));

		await User.findByIdAndUpdate(userId, { $addToSet: { history: videoId } });

		res.status(200).json('video added to watched list');
	} catch (error) {
		next(error);
	}
};

export const getHistory = async (req, res, next) => {
	try {
		const userId = req.userData.id;
		const user = await User.findById(userId).populate({
			path: 'history',
			model: 'Video',
			populate: {
				path: 'userId',
				model: 'User',
				select: 'name img',
			},
		});

		res.status(200).json({ videos: user.history });
	} catch (error) {
		next(error);
	}
};

export const getLikedVideos = async (req, res, next) => {
	try {
		const userId = req.userData.id;
		let user = await User.findById(userId).populate({
			path: 'likedVideos',
			model: 'Video',
		});
		if (!user) return next(createError(404, 'user does not exists'));

		res.status(200).json({ liked: user.likedVideos });
	} catch (error) {
		next(error);
	}
};
export const getDislikedVideos = async (req, res, next) => {
	try {
		const userId = req.userData.id;
		let user = await User.findById(userId).populate({
			path: 'dislikedVideos',
			model: 'Video',
		});
		if (!user) return next(createError(404, 'user does not exist'));

		res.status(200).json({ disliked: user.dislikedVideos });
	} catch (error) {
		next(error);
	}
};
export const getSavedVideos = async (req, res, next) => {
	try {
		const userId = req.userData.id;
		let user = await User.findById(userId).populate({
			path: 'savedVideos',
			model: 'Video',
			populate: {
				path: 'userId',
				model: 'User',
				select: 'name img',
			},
		});
		if (!user) return next(createError(404, 'user does not exist'));

		res.status(200).json({ videos: user.savedVideos });
	} catch (error) {
		next(error);
	}
};
