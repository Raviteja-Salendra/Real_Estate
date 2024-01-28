import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";


export const createListing = async( req,res,next)=>{
    try {
        const listing= await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error);
    }
}

export const deleteListing = async(req,res,next) =>{
    const listing = await Listing.findById(req.params.id);
    if(!listing){
        return next(errorHandler(404,'Listing not found'));
    }
    if(req.user.id !== listing.useRef)
    {
        return next(errorHandler(401,'You can only delete your own listings'));
    }
    try {
       await Listing.findByIdAndDelete(req.params.id); 
       res.status(200).json('Listing Deleted successfully');
    } catch (error) {
        next(error);
    }
}


    export const editListing = async (req,res,next) =>{
        const listing = await Listing.findById(req.params.id);
        if(!listing){
            return next(errorHandler(404,'Listing not found'));
        }

        if(req.user.id !== listing.useRef){
            return next(errorHandler(401,"you can only update your own listings"));

        }

        try {
            const editedListing = await Listing.findByIdAndUpdate(req.params.id,req.body, {
                new: true
            });

            res.status(200).json(editedListing)
        } catch (error) {
            next(error)
        }
    }


    export const getListing = async( req, res,next)=>{
        try {
            const listing = await Listing.findById(req.params.id);
            if(!listing){
                return next(errorHandler(404,'Listing not found'));
            }

            res.status(200).json(listing);
        } catch (error) {
            next(error)
        }
    }


    export const searchListings = async(req,res,next) =>{
        try {
            //pagination 
            const limit = parseInt(req.query.limit) || 9;
            // startIndex is for which page we are in
            const startIndex = parseInt(req.query.startIndex) || 0;
            let offer = req.query.offer ;

            if(offer === undefined || offer ==='false'){
                //search inside the database of undefined offers 
                offer ={$in: [false,true] };
            }

            let furnished = req.query.furnished;
            if(furnished === undefined || furnished === 'false'){
                furnished ={ $in : [false,true]};
            }
            

            let parking = req.query.parking;
            if(parking === undefined || parking === 'false'){
                parking= {$in: [false, true]};
            }

            let type = req.query.type;
            if(type === undefined || type === 'all'){
                type ={$in: ['sale','rent']};
            }

            //from the user request
            const searchTerm = req.query.searchTerm || '';

            const sort = req.query.sort || 'createdAt';

            const order = req.query.order || 'desc';

            const listings = await Listing.find({
                //regex -> builtin search functiona;lity in mongoDb
                //options ;i -> dont care about lowercase / uppercase
                name :{ $regex :searchTerm, $options:'i'},
                offer,
                furnished,
                parking,
                type,

            }).sort(
                {
                    [sort] : order
                }
            ).limit(limit).skip(startIndex);  // limit to 9

            return res.status(200).json(listings);


        } catch (error) {
            next(error);
        }
    }