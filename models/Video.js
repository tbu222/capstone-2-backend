import mongoose from "mongoose"
const VideoSchema = new mongoose.Schema(
    {
        userId:{
            type:String,
            required:true,
        },
        title:{
            type:String,
            required:true,
        },
        desc: {
            type:String,
            required:true,
        },
        imgUrl: {
            type:String,
            required:true,
        },
        videoUrl: {
            type:String,
            required:true,
        },
        views: {
            type:Number,
            default: 0,
            min: 0,
        },
        tags: {
            type:[String],
            default: [],
        },
        likes: {
            type: Number,
            default: 0,
            min: 0,
        },
        dislikes: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    {timestamps:true}
);

export default mongoose.model("Video", VideoSchema);