import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

export const verifytoken = (req,res,next) =>{
   
   // through cookieparser -> to get the data from cookie
    const token = req.cookies.access_token;
    if(!token) return next(errorHandler(401,"User is Unauthorized"));

    jwt.verify(token,process.env.JWT_SECRET,(err,user)=>{
        if(err) return next(errorHandler(403,'Forbidden'));

       // sending the user to execute next functions
        req.user=user;
        next();
    })

}