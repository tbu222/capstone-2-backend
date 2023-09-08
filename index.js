import express from "express"
import mongoose from "mongoose"
import morgan from 'morgan';
import dotenv from "dotenv"
import userRoutes from "./routes/users.js"
import videoRoutes from "./routes/videos.js"
import commentRoutes from "./routes/comments.js"
import authRoutes from "./routes/auth.js"
import cors from "cors";
import cookieParser from "cookie-parser"
const app = express()
dotenv.config()

const mongoURI = process.env.MONGO;
const PORT = process.env.PORT || 3000;

mongoose
	.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		console.log('DB connected');
		console.log('Port#: ' + PORT);
		app.listen(PORT);
	})
	.catch((err) => console.log(err));
Promise = global.Promise;
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

app.use(cors());
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/users", userRoutes)
app.use((err, req, res, next)=>{
    const status = err.status || 500;
    const message = err.message || "Something wrong going on";
    return res.status(status).json({
        success: false,
        status: status,
        message: message,
    })
})

app.use('*', (req, res)=> {
    console.log('Route not found');
    res.status(404).json({
        error: 'Route not found',
    });
});

export default app;