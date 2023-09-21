import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();

dotenv.config();

import userRoute from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';
import videoRoute from './routes/videoRoute.js';
import commentRoute from './routes/commentRoute.js';


const dbURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

mongoose
	.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		console.log('connected to db');
		console.log('backend server is running on port ' + PORT);
		app.listen(PORT);
	})
	.catch((err) => console.log(err));
Promise = global.Promise;


app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());


app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/videos', videoRoute);
app.use('/api/comments', commentRoute);

app.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || 'Something went wrong!';
	return res.status(status).json({
		success: false,
		status,
		message,
	});
});

app.use('*', (req, res) => {
	console.log('wrong route');
	res.status(404).json({
		error: 'Not found',
	});
});

export default app;
