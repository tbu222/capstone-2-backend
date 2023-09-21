import mongoose from "mongoose";
import User from "../models/userModel.js";
import Video from "../models/videoModel.js";
import Comment from "../models/commentModel.js";
import createError from "../utils/error.js";


const getAllComments = async (req, res, next) => {
    try {
        const videoId = req.params.videoId;
        if (!videoId || !mongoose.isValidObjectId(videoId))
            return next(createError(401, 'This is not a valid videoId'))

        const video = await Video.findOne({ _id: videoId });
        if (!video) return next(createError(404, 'video does not exist '))


        const comments = await Comment
            .find({ videoId })
            .populate({
                path: 'userId',
                model: 'User',
                select: { 'password': 0 }
            })
            .populate({
                path: 'videoId',
                model: 'Video'
            }).sort({ createdAt: -1 });
        res.status(200).json({
            count: comments.length,
            comments
        })
    } catch (error) {
        next(error)
    }
}
const addComment = async (req, res, next) => {
    try {
        const videoId = req.params.videoId;
        const userId = req.userData.id;
        if (!videoId || !mongoose.isValidObjectId(videoId))
            return next(createError(401, 'This is not a valid videoId'))

        const video = await Video.findOne({ _id: videoId });
        if (!video) return next(createError(404, 'video does not exist  '))

        const user = await User.findOne({ _id: userId });
        if (!user) return next(createError(404, 'user does not exist'))
        const comment = new Comment({ ...req.body, userId, videoId });
        await comment.save();
        const returnedComment = await Comment
            .findById(comment._id)
            .populate({
                path: 'userId',
                model: 'User',
                select: { 'password': 0 }
            })
            .populate({
                path: 'videoId',
                model: 'Video'
            });
        res.status(200).json({ comment: returnedComment })
    } catch (error) {
        next(error)
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const userId = req.userData.id;
        if (!commentId || !mongoose.isValidObjectId(commentId))
            return next(createError(401, 'This is not a valid commentId'))

        const comment = await Comment.findById(commentId);
        if (!comment) return next(createError(404, 'comment does not exist'))

        if (!comment.userId.equals(userId))
            next(createError(403, 'You are only authorize to delete your own comment'));

        await Comment.deleteOne({ _id: commentId });
        res.status(200).json('comment has been deleted')
    } catch (error) {
        next(error)
    }
}


export {
    getAllComments,
    addComment,
    deleteComment
} 