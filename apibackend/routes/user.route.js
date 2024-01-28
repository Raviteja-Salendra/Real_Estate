import express from 'express';
import { deleteUser, getUser, getUserListings, test, updateUser } from '../controllers/user.controller.js';
import { verifytoken } from '../utils/verifyUser.js';

const router= express.Router();


router.get('/test',test);

// using the created token by verifyToken
router.post('/update/:id', verifytoken ,updateUser)
router.delete('/delete/:id',verifytoken,deleteUser)
router.get('/listings/:id',verifytoken,getUserListings)
router.get('/:id',verifytoken,getUser)



export default router;
