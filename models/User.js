import mongoose from "mongoose"
const UserSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            unique:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password: {
            type:String,
        },
        img: {
            type: String,
        },
        subscribers:{
            type: Number,
            default: 0,
            min:0,
        },
        fromGoogle:{
            type:Boolean,
            default: false,
        },
        subscribedUsers:{
            type:[{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            default: [],
        },
        likedVideos: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
            default:[],
        },
        dislikedVideos: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
            default:[],
        },
        savedVideos: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
            default:[],
        },
        userVideos: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
            default:[],
        },
        history: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
            default:[],
        },
    },
    {timestamps:true}
);

export default mongoose.model("User", UserSchema);