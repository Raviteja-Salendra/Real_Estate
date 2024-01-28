import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export const signup = async (req,res,next)=>{
    const { username, email, password, confirmpassword}=req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);
    const hashedConfirmPassword = bcryptjs.hashSync(confirmpassword,10);
    const newUser = new User({
        username,
        email,
        password : hashedPassword,
        confirmpassword: hashedConfirmPassword
    });
   try {
    await newUser.save();
   res.status(201).json('Registered Successfully');
   } catch (error) {
    next(error);
   }
}





export const signin = async (req,res,next)=>{
    const {email,password } =req.body;
    try {
        const validUser = await User.findOne({ email });
        if(!validUser) return next(errorHandler(404,'User Not Found'));
        const validPasswords = bcryptjs.compareSync(password,validUser.password);
        if(!validPasswords) return next(errorHandler(401,'Invalid Username and Password'));
        // Authenticating the user by adding the cookie in browser -to do this create token.
        //
        const token = jwt.sign({ id: validUser._id},process.env.JWT_SECRET); // to secure the secret token we saving in environmental variable .env
        const { password: pass, confirmpassword:confirm, ...rest}=validUser._doc;
        res.cookie('access_token',token,{ httpOnly: true}).status(200).json(rest); 
         // httponly : true => no other third party applications can have access to the cookie
    } catch (error) {
        next(error);
    }
}


export const google = async(req,res,next)=>{
    try {
        const user = await User.findOne({email: req.body.email})
        if(user){
            const token =jwt.sign({id: user._id},process.env.JWT_SECRET);
            const { password: pass,confirmpassword:confirm, ...rest }= user._doc;

            res.cookie('access_token',token, { httpOnly: true}).status(200).json(rest);


        }
        else{
            // in the model we created we require the password so creating a random password
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const generatedPasswordConfirm= Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

            const hashedPassword= bcryptjs.hashSync(generatedPassword,10);
            const hashedConfirmPassword= bcryptjs.hashSync(generatedPasswordConfirm,10);
            const newUser = new User({username:req.body.name.split(" ").join("").toLowerCase() +Math.random().toString(36).slice(-4) , email: req.body.email, password:hashedPassword ,confirmpassword:hashedConfirmPassword, avatar: req.body.photo})  
            //to have a username connected -> we use the above syntax ex: ravitejasalendra12        
            await newUser.save();
            const token= jwt.sign({id: newUser._id},process.env.JWT_SECRET);
            const { password: pass,confirmpassword:confirm, ...rest }= newUser._doc;
            res.cookie('access_token',token,{ httpOnly:true}).status(200).json(rest);
            
        }
    } catch (error) {
        next(error)
    }
}


export const signout= async(req,res,next)=>{
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been logged out');
    } catch (error) {
        next(error);
    }
}

// export const signup= async (req,res)=>{
//     // const { username, email, password, confirmpassword}=req.body;
//     // let newUser= new User({
//     //         username,
//     //         email,
//     //         password,
//     //         confirmpassword
//     // });
//     // await newUser.save()
//     // res.status(201).json("User created Succesfully");





//     try{
//         const {username,email,password,confirmpassword} =req.body;
//         let exist = await User.findOne({email:email})
//         if(exist){
//             return res.status(200).send('User already Registered')
//         }
//         if(password !== confirmpassword){
//             return res.status(200).send('Passwords are not Matching');
//         }
//         let newUser= new User({
//             username,
//             email,
//             password,
//             confirmpassword
//         })
//         await newUser.save();
//         res.status(200).send('Registered Successfully')
//     }
//     catch(err)
//     {
//         console.log(err)
//         return res.status(500).send('Internal Server Error')
//     }


// };
// export const signup = async (req, res,next) => {
//     try {
//         const { username, email, password, confirmpassword } = req.body;
//         // ... rest of the code

//         const hashedPassword = bcryptjs.hashSync(password,10);
//         const hashedConfirmPassword = bcryptjs.hashSync(confirmpassword,10);
//         // let exist = await User.findOne({ email: email });
//         // if (exist) {
//         //     return res.status(200).send('User already Registered');
//         // }
//         if (password !== confirmpassword) {
//             return res.status(200).send('Passwords are not Matching');
//         }

//         let newUser = new User({
//             username,
//             email,
//             password :hashedPassword,
//             confirmpassword:hashedConfirmPassword
//         });

//         await newUser.save();
//         res.status(201).json({ message: 'Registered Successfully' });

//     } catch (err) {
//         next(err);
//     }
// };


// export const signin = async (req,res,next)=>{
//     const {username ,password } =req.body;
//     try {
//         const validUser = await User.findOne({ username:username });
//         if(!validUser) return next(errorHandler(404,'User Not Found'));
//         const validPassword = bcryptjs.compareSync(password,validUser.password);
//         if(!validPassword) return next(errorHandler(401,'Invalid Username and Password'));
//         const token = jwt.sign({ id: validUser._id},process.env.JWT_SECRET);
//         res.cookie('access_token',token,{ httpOnly: true}).status(200).json(validUser);
//     } catch (error) {
//         next(error);
//     }
// }