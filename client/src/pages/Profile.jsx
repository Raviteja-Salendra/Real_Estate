import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

//useState will re-render when there is content - change and update i UI
// to add references for input  here we used for image upload in profile 
// useRef does not notify when content is changed . Mutating the property 
// does not cause change in re-render
import { useRef } from 'react'
import { getDownloadURL, getStorage , list, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { updateUserStart, updateUserSuccess, updateUserFailure , deleteUserStart, deleteUserSuccess, deleteUserFailure, signoutStart, signoutFailure, signoutSuccess} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom';

export default function Profile() {
  const {currentUser, loading, error} = useSelector((state)=>state.user)
  const fileref= useRef(null);
const [file,setFiles]=useState(undefined);
const[fileper, setFileper] =useState(0);
const[fileuploaderror, setFileuploaderror]= useState(false);

const[formData,setFormData]= useState({});
const[ showListingsError, setShowListingsError] = useState(false);
const [ userListings, setUserListings] = useState([]);
const [updateSuccess, setUpdateSuccess]= useState(false);
const [displayUpload,setDisplayUpload] = useState(false);
const dispatch= useDispatch();


  //firebase storage
  // allow read;
  //     allow write: if 
  //     request.resource.size < 2* 1024 * 1024 &&
  //     request.resource.contentType.matches('image/.*')

  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }

  },[file]);

 
  const handleFileUpload = (file)=>{
    const storage= getStorage(app); // storing the uploaded image in google firebase storegae
    const fileName= new Date().getTime() + file.name;// to have unique name
    const storageRef= ref(storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);
// uploadBytesResumable to see the percentage of upload
    uploadTask.on('state_changed',
    (snapshot)=>{
      const progress =  (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
      setFileper(Math.round(progress));
    },
  
      
      (error)=>{
        setFileuploaderror(true);
      },
      // getting the file
      ()=>{
        getDownloadURL(uploadTask.snapshot.ref).then((
          downloadURL
        )=>{
          setFormData({...formData,avatar:downloadURL});
        });
      }
    );
    };

    const changeHandler =(e)=>{
      setFormData({...formData,[e.target.id]: e.target.value });
    }

    const submitHandler = async (e)=>{
      e.preventDefault();
      try {
        dispatch(updateUserStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`,{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify(formData),
        })
        const data= await res.json();
        if(data.success === false){
          dispatch(updateUserFailure(data.message));
          return;
        }

        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);

      } catch (error) {
        dispatch(updateUserFailure(error.message));
      }
    }

    const deleteHandler = async()=>{
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`,{
          method:'DELETE',
        });
        const data= await res.json();
        if(data.success === false){
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
      } catch (error) {
        dispatch(deleteUserFailure(error.message))
      }
    }

    const signoutHandler = async ()=>{
      try {
        dispatch(signoutStart());
        const res= await fetch('api/auth/sign-out');
        const data = await res.json();
        if(data.success == false){
          dispatch(signoutFailure(data.message));
          return;
        }
        dispatch(signoutSuccess(data));
      } catch (error) {
        dispatch(signoutFailure(error.message));
      }
    }

    const showListingsHandler = async()=>{
try {
  // can also add loading effect
  setDisplayUpload(true);
  setShowListingsError(false)
  const res = await fetch(`/api/user/listings/${currentUser._id}`);
  const data = await res.json();
  if(data.success === false){
    setShowListingsError(true);
    return;
  }

  setUserListings(data);
  setDisplayUpload(false);
} catch (error) {
  setShowListingsError(true)
  setDisplayUpload(false);
}
    }

    const deleteListingHandler = async(lisingId)=>{
      try {
        const res = await fetch(`/api/listing/delete/${lisingId}`,{
          method:'DELETE',
        });
        const data= await res.json();
        if(data.success === false){
          console.log(data.message);
          return;
        }

        setUserListings((prevdata)=>prevdata.filter((listing)=>listing._id !== lisingId))
      } catch (error) {
        console.log(error.message);
      }
    }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className=' text-blue-700 text-3xl font-semibold text-center my-7'>Profile</h1>

      <form onSubmit={submitHandler} className='flex flex-col gap-4'>
        <input onChange={(e)=>setFiles(e.target.files[0])} type='file' ref={fileref} hidden accept='image/*' />
      
        <img onClick={()=>fileref.current.click()} src={formData.avatar || currentUser.avatar} alt='profile' className='rounded-full h-30 w-30 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm font-semibold self-center'>
          {fileuploaderror ? 
          <span className='text-red-700'>Error Image Upload(Image must be less than 2 MB)</span> :
          fileper > 0 && fileper<100 ?(
            <span className='text-slate-700'>{`Uploading ${fileper}%`}</span> 
          ) : fileper === 100 ?(
            <span className='text-green-700'>Uploaded image Successfully</span>
          ) :(
            ''
          )
        }
        </p>
        <input onChange={changeHandler} type='text' placeholder='username' defaultValue={currentUser.username} className='border p-3 rounded-lg font-semibold'  id='username'/>
        <input onChange={changeHandler} type='email' placeholder='email' className='border p-3 rounded-lg font-semibold' defaultValue={currentUser.email} id='email' />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password'/>
      <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-75'>{loading? 'Loading..':'Update'}</button>
      <Link className='bg-pink-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90' to={'/create-listing'}>
        Create Listings
      </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={deleteHandler} className='text-black font-bold cursor-pointer '>Delete Account</span>
        <span onClick={signoutHandler} className='text-black font-bold cursor-pointer'>Sign Out</span>
      </div>

<p className='text-red-700 font-semibold mt-5 text-center'>{error ? error : ""}</p>
<p className='text-green-600 font-semibold mt-5 text-center'>{updateSuccess ? 'User Updated' : ''}</p>

<button disabled={displayUpload} onClick={showListingsHandler} className='bg-blue-500 text-white p-3 rounded-lg text-center hover:opacity-80 font-bold '> {displayUpload ? 'Loading the Listings' : 'Display Listings'}</button>
    <p className='text-red-700 mt-5'>{showListingsError ? 'Error displaying Listings ' : ''}</p>

        {userListings && userListings.length > 0 &&
        <div className=" flex flex-col gap-4 ">
          <h1 className='text-center mt-7 text-2xl font-semibold '>Your Listings </h1>
        {userListings.map((listing)=>
          <div key={listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
            <Link to={`/listing/${listing._id}`}>
              <img className='h-20 w-20 object-contain ' src={listing.imageUrls[0]} alt='listing cover' />

               </Link>

               <Link className='text-slate-600 font-semibold  hover:underline truncate flex-1' to={`/listing/${listing._id}`}>
                <p className=''>{listing.name}</p>
               </Link>

               <div className="flex flex-col items-center">
                <button onClick={()=>deleteListingHandler(listing._id)} className='text-red-600 uppercase text-sm font-semibold'>Delete</button>
                
                <Link to={`/edit-listing/${listing._id}`}>
                <button className='text-green-600 uppercase text-sm font-semibold'>Edit</button>
                </Link>
               </div>

          </div>
        )}
        </div>
        }

    </div>
  )
}
