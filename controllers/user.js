import User from "../models/User.js"
import { createError } from "../error.js"
import Video from "../models/Video.js";
import mongoose from "mongoose";
export const update = async (req, res,next)=>{
    if (req.params.id === req.user.id){
        try{
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body
            },{ new: true});
            res.status(200).json(updatedUser);
        }catch(err){
        next(err)
        }
    }else{
        return next(createError(403, "Not authenticated to update user info"))
    }
}

export const like = async (req, res,next)=>{
    try{
        const userId = req.user.id;
        const videoId = req.params.id;
        if (!videoId || !mongoose.isValidObjectId(videoId))
            return next(createError(401), 'not a valid videoId');
        let video = await Video.findById(videoId);
        let user = await User.findById(userId);
        if (!video || !user)
            return next(createError(401), 'video or user does not exist');
            
        if (!user.likedVideos.includes(videoId) && !user.dislikedVideos.includes(videoId)){
            await Video.findByIdAndUpdate(videoId, {$inc: { likes: 1}})
            await User.findByIdAndUpdate(userId, {$addToSet: {likedVideos: videoId}})
            res.status(200).json("Liked");
        }
        else if (!user.likedVideos.includes(videoId) && user.dislikedVideos.includes(videoId)){
            await Video.findByIdAndUpdate(videoId, {$inc: { likes: 1}})
            await Video.findByIdAndUpdate(videoId, {$inc: { dislikes: -1}})
            await User.findByIdAndUpdate(userId, {$addToSet: {likedVideos: videoId}})
            res.status(200).json("Liked");
        }
        else{
            await Video.findByIdAndUpdate(videoId, {$inc: { likes: -1}})
            await User.findByIdAndUpdate(userId, {$pull: {likedVideos: videoId}})
            res.status(200).json("Unliked");
        }
    }catch(err){
        next(err)
    }
}
export const dislike = async (req, res,next)=>{
    try{
        const userId = req.user.id;
        const videoId = req.params.id;
        if (!videoId || !mongoose.isValidObjectId(videoId))
            return next(createError(401), 'not a valid videoId');
        let video = await Video.findById(videoId);
        let user = await User.findById(userId);
        if (!video || !user)
            return next(createError(401), 'video or user does not exist');
            
        if (!user.likedVideos.includes(videoId) && !user.dislikedVideos.includes(videoId)){
            await Video.findByIdAndUpdate(videoId, {$inc: { dislikes: 1}})
            await User.findByIdAndUpdate(userId, {$addToSet: {dislikedVideos: videoId}})
            res.status(200).json("DisLiked");
        }
        else if (!user.dislikedVideos.includes(videoId) && user.likedVideos.includes(videoId)){
            await Video.findByIdAndUpdate(videoId, {$inc: { dislikes: 1}})
            await Video.findByIdAndUpdate(videoId, {$inc: { likes: -1}})
            await User.findByIdAndUpdate(userId, {$addToSet: {dislikedVideos: videoId}})
            res.status(200).json("DisLiked");
        }
        else{
            await Video.findByIdAndUpdate(videoId, {$inc: { dislikes: -1}})
            await User.findByIdAndUpdate(userId, {$pull: {dislikedVideos: videoId}})
            res.status(200).json("UnDisliked");
        }
    }catch(err){
        next(err)
    }
}
export const remove = async (req, res,next)=>{
    if (req.params.id === req.user.id){
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Removed User");
        }catch(err){
        next(err)
        }
    }else{
        return next(createError(403, "Not authenticated to delete user"))
    }
    
}
export const subscribe = async (req, res,next)=>{
    try{
        const otherId = req.params.id;
        const personalId = req.user.id;
        if (!otherId || !mongoose.isValidObjectId(otherId))
            return next(createError(401, 'not a valid id'))

        let other = await User.findById(otherId);
        let  personal = await User.findById(personalId);
        if (!other || !personal)
            return next(createError(404,'user does not exist'));
        if (personal.subscribedUsers.includes(otherId)){
            await User.findByIdAndUpdate(otherId, {$inc: {subscribers:  -1}})
            await User.findByIdAndUpdate(personalId, {$pull:{ subscribedUsers: otherId}})
            return res.status(200).json("unsubscribe");
        }
        else {
            await User.findByIdAndUpdate(otherId, {$inc: {subscribers:  1}})
            await User.findByIdAndUpdate(personalId, {$addToSet:{ subscribedUsers: otherId}})
            return res.status(200).json("subscribed");
        }
    }catch(err){
        next(err)
    }
}

export const unsubscribe = async (req, res,next)=>{
    try{
        const otherId = req.params.id;
        const personalId = req.user.id;
        if (!otherId || !mongoose.isValidObjectId(otherId))
            return next(createError(401, 'not a valid id'))
        if (personalId === otherId)
            return next(createError(400, 'you cant subscribe yourself'))
        let other = await User.findById(otherId);
        let  personal = await User.findById(personalId);
        if (!other || !personal)
            return next(createError(404,'user does not exist'));

        const founded = personal.subscribedUsers.find((ch)=>{ch.equals(other._id)})
        if (!founded)
            return next(createError(404, 'you did not subscribe the user'))
        await User.findByIdAndUpdate(otherId, {$inc: {subscribers:  -1}})
        await User.findByIdAndUpdate(personalId, {$pull:{ subscribedUsers: otherId}})
        return res.status(200).json("unsubscribe");
    }catch(err){
        next(err)
    }
}
export const getUser = async (req, res,next)=>{
    try{
        const userId = req.params.id;
        if (!userId || !mongoose.isValidObjectId(userId))
            return next(createError(401, 'not a valid userId'))
        const user = await User.findOne({ _id: userId });
        if (!user) 
            return next(createError(404, 'user does not exist'))
        res.status(200).json({ user })
    }catch(err){
        next(err)
    }
}

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({
            count: users.length,
            users
        })
    } catch (error) {
        next(error)
    }
}
export const save = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.id;
        if (!videoId || !mongoose.isValidObjectId(videoId))
            return next(createError(401, 'not a valid videoId'))

        let video = await Video.findById(videoId);
        let user = await User.findById(userId);
        if (!video || !user)
            return next(createError(404, 'video or user does not exist'))

        if (user.savedVideos.includes(videoId)) {
            await User.findByIdAndUpdate(userId, { $pull: { savedVideos: videoId } })
            res.status(200).json("Remove from Saved Video");
        } else {
            await User.findByIdAndUpdate(userId, { $addToSet: { savedVideos: videoId } })
            res.status(200).json("Add to Saved Videos");
        }
    } catch (error) {
        next(error)
    }
}

export const unsave = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const userId = req.user.id;
        if (!videoId || !mongoose.isValidObjectId(videoId))
            return next(createError(401, 'not a valid videoId'))

        let video = await Video.findById(videoId);
        let user = await User.findById(userId);
        if (!video || !user)
            return next(createError(404, 'video or user does not exist'))

        if (!user.savedVideos.includes(videoId))
            return next(createError(400, 'Video not in Saved Videos'));


        await User.findByIdAndUpdate(userId, { $pull: { savedVideos: videoId } })
        res.status(200).json("Remove from Saved Video");
    } catch (error) {
        next(error)
    }
}