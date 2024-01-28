import express from 'express';
import { createListing, deleteListing, editListing, getListing, searchListings } from '../controllers/listing.js';
import { verifytoken } from '../utils/verifyUser.js';

const router = express.Router();


router.post('/create',verifytoken,createListing);
router.delete('/delete/:id',verifytoken,deleteListing);
router.post('/edit/:id',verifytoken,editListing);
router.get('/get/:id',getListing)
router.get('/searchproperty',searchListings);




export default router;