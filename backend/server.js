import path from 'path'
import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';
import postRoutes from './routes/post.route.js';
import notificationsRoutes from './routes/notifications.route.js';

import connectDB from './db/mongodb.js';
import cookieParser from 'cookie-parser';
import {v2 as cloudinary} from 'cloudinary';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();
const PORT= process.env.PORT || 5000;
const __dirname = path.resolve()

app.use(express.json({ limit: "10mb" })); // to parse req.body
// limit shouldn't be too high to prevent DOS
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser())


app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationsRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
  app.get(/.*/, (req, res) => {
      res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}



app.listen(PORT, ()=>{
  
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})