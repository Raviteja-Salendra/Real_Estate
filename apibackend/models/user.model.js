import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique :true,
    },
    email:{
        type:String,
        required:true,
        unique :true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmpassword:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        
    }
},{ timestamps: true}); // timestamps say about the time of the creation of the user and updation of the user

const User = mongoose.model('User',userSchema);

export default User;