// google AUTHENTICATION USING GOOGLE  FIREBASE





import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import  { useNavigate } from 'react-router-dom'

export default function OAuth() {

    const dispatch = useDispatch();
    const navigate= useNavigate();
    const googleHandler =async () =>{
        try {
            const provider = new GoogleAuthProvider() //for google auth
            const auth = getAuth(app)

            const result= await signInWithPopup(auth,provider)

            const res = await fetch('/api/auth/google',
            {
            method :'POST',
            headers :{
                'Content-Type': 'application/json',
            },

            // sending the data to backend
            body : JSON.stringify({name:result.user.displayName,email: result.user.email,photo: result.user.photoURL})

            }
            )

            const data= await res.json()
            dispatch(signInSuccess(data));
            navigate('/');

        } catch (error) {
            console.log("Could not sign in with google",error);
        }
    }
  return (
    <button onClick={googleHandler} type='button' className='bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-90'>signin in with Google</button>
  )
}
