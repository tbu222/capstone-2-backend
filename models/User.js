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
            default: 0
        },
        fromGoogle:{
            type:Boolean,
            default: false,
        },
        subscribedUsers:{
            type:[String]
        },
    },
    {timestamps:true}
);

export default mongoose.model("User", UserSchema);