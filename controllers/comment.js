import { createError } from "../error.js"
import Comment from "../models/Comment.js"
import Video from "../models/Video.js"
export const addCommment = async (req,res,next)=>{
    const newComment = new Comment({...req.body, userId: req.user.id})
    try{
        const savedComment = await newComment.save()
        res.status(200).send(savedComment)
    }catch(err){
        next(err)
    }
}

export const removeCommment = async (req,res,next)=>{
    try{
        const comment = await Comment.findById(req.params.id)
        const video = await Video.findById(comment.videoId)
        console.log(comment.userId )
        console.log(req.user.id )
        console.log(video.userId)
        if (req.user.id === comment.userId || req.user.id === video.userId){
            await Comment.findByIdAndDelete(req.params.id)
            res.status(200).json("Comment Deleted.")
        }else{
            return next(createError(403, "you are not allowed to do this"))
        }
    }catch(err){
        next(err)
    }
}

export const getCommment = async (req,res,next)=>{
    try{
        const comments = await Comment.find({videoId:req.params.videoId})
        res.status(200).json(comments);
    }catch(err){
        next(err);
    }
};