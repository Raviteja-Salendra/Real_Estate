import React, { useState } from 'react'
import { getDownloadURL, getStorage,ref, uploadBytesResumable } from 'firebase/storage';
import{ app } from '../firebase'
import {useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {

    const {currentUser} = useSelector(state=>state.user)
    const [files,setFiles] = useState([]) //files of images
    const [formdata,setFormdata]= useState({
        imageUrls:[],
        name:'',
        description:'',
        address:'',
        type: 'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:10000,
        discountPrice:0,
        offer: false,
        parking: false,
        furnished: false,

        })
        const navigate = useNavigate();
        //console.log(formdata);
   const [imageuploaderror, setImageuploaderror] = useState(false);

   const [uploading,setUploading] = useState(false);

   const[error,setError] =useState(false);
   const[loading, setLoading] = useState(false);

    const handleImageSubmit =(e)=>{
        if(files.length >0 && files.length + formdata.imageUrls.length<8){
            setUploading(true);
            setImageuploaderror(false);

            //we are uploading more than one image 
            // so we should have more than one ASYNCHRONOUS BEHAVIOUR
            // so we can also use async await 
            const promises =[];

            for(let i=0 ;i<files.length ;i++){
                promises.push(storeImage(files[i]));

            }
            Promise.all(promises).then((urls)=>{
                setFormdata({...formdata,imageUrls: formdata.imageUrls.concat(urls)});
                setImageuploaderror(false);
                setUploading(false)
            }).catch((err)=>{
                setImageuploaderror('Image Upload failed (2 MB max Per image)');
            });
        }
        else{
            setImageuploaderror('You can upload only 7 Images per Listing')
            setUploading(false);
        }
    }


    const storeImage = async (file)=>{
        // promise - wait
        return new Promise((resolve,reject)=>{
            const storage = getStorage(app);
            const filename= new Date().getTime()+ file.name;
            const storageRef = ref(storage,filename);
            const uploadtask = uploadBytesResumable(storageRef,file);

            uploadtask.on(
                "state_changed",
                (snapshot)=>{
                    const progress =
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                    //console.log(`Upload is ${progress}% done`);
                },
                (error)=>{
                    reject(error);
                },
                ()=>{
                    getDownloadURL(uploadtask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL);
                    })
                }
            )

        })
    }

    const removeimageHandler =(index)=>{
        setFormdata({
            ...formdata,
            imageUrls: formdata.imageUrls.filter((_,i)=> i !==index ),

        })
    }

    const changeHandler= (e)=>{
        if(e.target.id === 'sale' || e.target.id === 'rent'  ){
            setFormdata({
                ...formdata,
                type: e.target.id
            })
        }

            if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
                setFormdata({
                    ...formdata,
                    [e.target.id]: e.target.checked,
                })
            }

            if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea'){
                setFormdata({
                    ...formdata,
                    [e.target.id]: e.target.value

                })
            }
        
    }

    const submitHandler = async (e)=>{
        e.preventDefault();
        try {
            if(formdata.imageUrls.length<1) return setError('You must upload atleast one image');
            if(formdata.regularPrice < formdata.discountPrice) return setError('Discount Price Should be lower than Regular price');
            setLoading(true);
            setError(false);
            const res = await fetch('/api/listing/create',{
                method : 'POST',
                headers:{
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({
                    ...formdata,
                    useRef: currentUser._id,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if(data.success === false){
                setError(data.message);
                //setLoading(false);
            }
            navigate(`/listing/${data._id}`)

        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

  return (
   <main className='p-3 max-w-4xl mx-auto'>
    <h1 className='text-3xl font-bold text-center my-7'>Create a Listing</h1>
    <form onSubmit={submitHandler} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex flex-col gap-4 flex-1 '>
            <input onChange={changeHandler} type='text' placeholder='Name' value={formdata.name} className='border p-3 rounded-lg' id='name' maxLength='62' minLength='8' required />
            <input onChange={changeHandler} type='text'value={formdata.description} placeholder='Description' className='border p-3 rounded-lg' id='description'  required />
            <input onChange={changeHandler} type='text' value={formdata.address} placeholder='Address' className='border p-3 rounded-lg' id='address'  required />
        

        <div className='flex gap-6 flex-wrap '>
            <div className='flex gap-2 '>
                <input type='checkbox' id='sale' className='w-5 'onChange={changeHandler} checked={formdata.type === 'sale'} />
                <span>Sell</span>
            </div>
            <div className='flex gap-2 '>
                <input type='checkbox' id='rent' className='w-5 ' onChange={changeHandler} checked={formdata.type === 'rent'} />
                <span>Rent</span>
            </div>
            <div className='flex gap-2 '>
                <input type='checkbox' id='parking' className='w-5 ' onChange={changeHandler} checked={formdata.parking} />
                <span>Parking Spot</span>
            </div>
            <div className='flex gap-2 '>
                <input type='checkbox' id='furnished' className='w-5 ' onChange={changeHandler} checked={formdata.furnished} />
                <span>Furnished</span>
            </div>
            <div className='flex gap-2 '>
                <input type='checkbox' id='offer' className='w-5 ' onChange={changeHandler} checked={formdata.offer} />
                <span>Offer</span>
            </div>
        </div>
        <div className='flex flex-wrap gap-8'>
            <div className='flex items-center gap-2'>
                <input onChange={changeHandler} value={formdata.bedrooms} className='p-3 border border-gray-300 rounded-lg' type='number' id='bedrooms' min='1' max='10' required />
                <p>Beds</p>
            </div>

            <div className='flex items-center gap-2'>
                <input onChange={changeHandler} value={formdata.bathrooms} className='p-3 border border-gray-300 rounded-lg' type='number' id='bathrooms' min='1' max='10' required />
                <p>Baths</p>
            </div>

            <div className='flex items-center gap-2'>
                <input onChange={changeHandler} value={formdata.regularPrice} className='p-3 border border-gray-300 rounded-lg' type='number' id='regularPrice' min='10000' max='100000000' required />
                <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span className='text-xs'>(Rs / Month) </span>
                </div>
                
            </div>

            {formdata.offer && (
                <div className='flex items-center gap-2'>
                <input onChange={changeHandler} value={formdata.discountPrice} className='p-3 border border-gray-300 rounded-lg' type='number' id='discountPrice' min='0' max='1000000' required />
                <div className='flex flex-col items-center'>
                <p>Discounted Price</p>
                <span className='text-xs'>(Rs / Month) </span>
                </div>
                
            </div>
            ) }
        
        </div>
        </div>

        <div className='flex flex-col flex-1 gap-4'>
            <p className='font-semibold'>Images:
            <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
            </p>

            <div className="flex gap-4">
                <input onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type='file' id='images' accept='image/*' multiple/>
                <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-600 border border-green-600 rounded uppercase hover:shadow-lg disabled:opacity-80' >{uploading ? 'Uploading..': 'Upload'}</button>
            </div>
            <p className='text-red-600 text-xs'>{imageuploaderror && imageuploaderror}</p>
            {
                formdata.imageUrls.length>0 && formdata.imageUrls.map((url,index)=>(
                    <div key={url} className='flex justify-between p-3 border items-center'>
                        <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
                        <button type='button' onClick={()=>removeimageHandler(index)} className='p-3 text-purple-700 rounded-lg uppercase hover:opacity-60'>Delete</button>
                        </div>
                ))
            }

            <button disabled={loading || uploading} className='p-3 bg-slate-600 text-white rounded-lg uppercase hover:opacity-80 disabled:opacity-70'>{loading ? 'Creating..': 'Create Listing'}</button>
            {error && <p className='text-red-700 text-xs font-semibold'>{error}</p>}
        </div>

    

    </form>
   </main>
  )
}