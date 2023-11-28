import express from 'express';
import mongoose from 'mongoose';

mongoose.connect("mongodb+srv://raviteja:raviteja123@realestatefsd.g4khrga.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log('Database Connected')
})

const app=express();


app.listen(4000,()=>{
    console.log('Server is running on port 4000!!');
});
