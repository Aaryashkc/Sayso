import express from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';

import connectDB from './db/mongodb.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();
const PORT= process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())


app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);



app.listen(PORT, ()=>{
  
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})