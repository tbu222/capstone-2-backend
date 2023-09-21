import mongoose from "mongoose";
import User from "../models/userModel.js";
import Video from "../models/videoModel.js";
import createError from "../utils/error.js";


const getAllUsers = async (req, res, next) => {
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
const getUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id || !mongoose.isValidObjectId(id))
            return next(createError(401, 'This is not a valid id'))

        const user = await User.findOne({ _id: id });
        if (!user) return next(createError(404, 'user does not exist'))

        res.status(200).json({ user })
    } catch (error) {
        next(error)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id || !mongoose.isValidObjectId(id))
            return next(createError(401, 'This is not a valid id'))

        if (req.userData.id !== id)
            return next(createError(403, 'You can only update your info'))

        let user = await User.findOne({ _id: id });
        if (!user) return next(createError(404, 'user does not exist'))
        for (let key in req.body) {
            user[key] = req.body[key];
        }
        user = await user.save();
        res.status(200).json({ user })
    } catch (error) {
        next(error)
    }
}
const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id || !mongoose.isValidObjectId(id))
            return next(createError(401, 'This is not a valid id'))

        if (req.userData.id !== id)
            return next(createError(403, 'you can only delete your own info'))
        let user = await User.findById(id)
        if (!user) return next(createError(404, 'user does not exist'));

        await User.deleteOne({ _id: id });
        res.status(200).json("user has been deleted")
    } catch (error) {
        next(error)
    }
}

const subscribeUser = async (req, res, next) => {
    try {
        const friendId = req.params.id;
        const myId = req.userData.id;
        if (!friendId || !mongoose.isValidObjectId(friendId))
            return next(createError(401, 'this is not a valid id'))
        let friend = await User.findById(friendId);
        let user = await User.findById(myId);
        if (!friend || !user)
            return next(createError(404, 'user not found'))

        if (user.subscribedChannels.includes(friendId)) {

            await User.findByIdAndUpdate(friendId, { $inc: { subscribers: -1 } })
            await User.findByIdAndUpdate(myId, { $pull: { subscribedChannels: friendId } })

            return res.status(200).json("unsubscribed");
        } else {
            await User.findByIdAndUpdate(friendId, { $inc: { subscribers: 1 } })
            await User.findByIdAndUpdate(myId, { $addToSet: { subscribedChannels: friendId } })

            return res.status(200).json("subscribed");
        }

    } catch (error) {
        next(error)
    }
}
const unsubscribeUser = async (req, res, next) => {
    try {
        const friendId = req.params.id;
        const myId = req.userData.id;
        if (!friendId || !mongoose.isValidObjectId(friendId))
            return next(createError(401, 'This is not a valid id'))

        let friend = await User.findById(friendId);
        let user = await User.findById(myId);
        if (!friend || !user)
            return next(createError(404, 'User does not exist'))

        const isFound = user.subscribedChannels.find((ch) => ch === friendId)
        if (!isFound)
            return next(createError(404, 'You did not subscribe to this channel'))

        await User.findByIdAndUpdate(friendId, { $inc: { subscribers: -1 } })
        await User.findByIdAndUpdate(myId, { $pull: { subscribedChannels: friendId } })
        res.status(200).json("unsubscribed");
    } catch (error) {
        next(error)
    }
}
const likeVideo = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const userId = req.userData.id;
        if (!videoId || !mongoose.isValidObjectId(videoId))
            return next(createError(401, 'valid id is required'))

        let video = await Video.findById(videoId);
        let user = await User.findById(userId);
        if (!video || !user)
            return next(createError(404, 'video or user not found'))

        if (user.likedVideos.includes(videoId)) {
            await Video.findByIdAndUpdate(videoId, { $inc: { likes: -1 } })
            await User.findByIdAndUpdate(userId, { $pull: { likedVideos: videoId } })
            res.status(200).json("unlike done");
        } else {
            await Video.findByIdAndUpdate(videoId, { $inc: { likes: 1 } })
            await User.findByIdAndUpdate(userId, { $addToSet: { likedVideos: videoId } })
            res.status(200).json("like done");

        }


    } catch (error) {
        next(error)
    }
}
const unlikeVideo = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const userId = req.userData.id;
        if (!videoId || !mongoose.isValidObjectId(videoId))
            return next(createError(401, 'valid id is required'))

        let video = await Video.findById(videoId);
        let user = await User.findById(userId);
        if (!video || !user)
            return next(createError(404, 'video or user not found'))

        if (user.dislikedVideos.includes(videoId)) {
            await Video.findByIdAndUpdate(videoId, { $inc: { dislikes: -1 } })
            await User.findByIdAndUpdate(userId, { $pull: { dislikedVideos: videoId } })
            res.status(200).json("remove dislike done");

        } else {
            await Video.findByIdAndUpdate(videoId, { $inc: { dislikes: 1 } })
            await User.findByIdAndUpdate(userId, { $addToSet: { dislikedVideos: videoId } })
            res.status(200).json("dislike done");
        }


    } catch (error) {
        next(error)
    }
}
const saveVideo = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const userId = req.userData.id;
        if (!videoId || !mongoose.isValidObjectId(videoId))
            return next(createError(401, 'valid id is required'))

        let video = await Video.findById(videoId);
        let user = await User.findById(userId);
        if (!video || !user)
            return next(createError(404, 'video or user not found'))

        if (user.savedVideos.includes(videoId)) {
            await User.findByIdAndUpdate(userId, { $pull: { savedVideos: videoId } })
            res.status(200).json("unSave video done");
        } else {
            await User.findByIdAndUpdate(userId, { $addToSet: { savedVideos: videoId } })
            res.status(200).json("saving video done");
        }


    } catch (error) {
        next(error)
    }
}
const unsaveVideo = async (req, res, next) => {
    try {
        const videoId = req.params.id;
        const userId = req.userData.id;
        if (!videoId || !mongoose.isValidObjectId(videoId))
            return next(createError(401, 'valid id is required'))

        let video = await Video.findById(videoId);
        let user = await User.findById(userId);
        if (!video || !user)
            return next(createError(404, 'video or user not found'))

        if (!user.savedVideos.includes(videoId))
            return next(createError(400, 'you didnot save it'));


        await User.findByIdAndUpdate(userId, { $pull: { savedVideos: videoId } })
        res.status(200).json("unsaving video done");
    } catch (error) {
        next(error)
    }
}



export {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    subscribeUser,
    unsubscribeUser,
    likeVideo,
    unlikeVideo,
    saveVideo,
    unsaveVideo
} 