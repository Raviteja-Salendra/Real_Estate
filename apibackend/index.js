import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js'
import authRouter from  './routes/auth.route.js';
import listingRouter from  './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';


mongoose.connect("mongodb+srv://raviteja:raviteja123@realestatefsd.g4khrga.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log('Database Connected')
}).catch((err)=>{
    console.log(err);
});




const app=express();

app.use(express.json());


// getting any data from the cookie we use cookieParser
app.use(cookieParser());

app.listen(4000,()=>{
    console.log('Server is running on port 4000!!');
});


app.use('/api/user',userRouter);

app.use('/api/auth',authRouter);

app.use('/api/listing',listingRouter);




app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;   // status code come from the middleware
    const message=err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message
    });
});