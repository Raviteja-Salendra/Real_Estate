import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs';

export const test =(req,res)=>{
    res.json({
        message:"Heloooo ravitejdvvcba"
    })
};

export const updateUser= async (req,res,next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401,"you can only update your own account!"))
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password,10)

        }
        // here below req.params.id indicates which user to update
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            // set says that only updated one should change other fields should have previous data
            $set : {
                username : req.body.username,
                email : req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        },{new: true})  //return and save the updated information

        //separate the password
        const{password, ...rest}= updatedUser._doc;

        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}


export const deleteUser = async (req,res,next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401,"You can only Delete Your own account"))
    try {
        await User.findByIdAndDelete(req.params.id);
        //for deleting the cookiee as well
        res.clearCookie('access_token');
        res.status(200).json('User has been Deleted');
    } catch (error) {
        next(error)
    }
}

export const getUserListings = async( req,res,next) =>{
    if(req.user.id === req.params.id){
        try {
            const listings = await Listing.find({useRef: req.params.id});
            res.status(200).json(listings);
        } catch (error) {
            next(error)
        }
    } 
    else{
        return next(errorHandler(401,'You can only view your own Listings'));
    }
}

export const getUser = async (req,res,next)=>{
    try {
        const user = await User.findById(req.params.id);

    if(!user) return next(errorHandler(404 ,' User Not Found '));
    const {password: pass, confirmpassword: passe, ...rest} =user._doc;
    res.status(200).json(rest);
    } catch (error) {
        next(error)
    }
}