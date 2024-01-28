import express from 'express';
import {  google, signin, signout, signup } from '../controllers/auth.controller.js';

const router= express.Router();

router.post('/sign-up',signup);
router.post('/sign-in',signin);
router.post('/google',google);
router.get('/sign-out',signout);
export default router;