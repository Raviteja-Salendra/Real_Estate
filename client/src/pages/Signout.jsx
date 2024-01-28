

import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';


export default function Signout() {
  const[formData, setFormData]= useState({})
  const[ error, setError]
 = useState(null);
 const[loading,setLoading] =useState(false);
 const navigate = useNavigate();
  const changeHandler = (e)=>{
    setFormData({
            ...formData, // keeping the information using spread operator
            [e.target.id]:e.target.value,
          });
  };

  const submitHandler = async (e)=>{
    e.preventDefault();
    try {
      setLoading(true);
      const res= await fetch('/api/auth/sign-up',  //'http://localhost:4000' come from proxy in vite.config.js
      {
        method: 'POST',
        headers:{
          'Content-Type' : 'application/json',
        },
        body: JSON.stringify(formData),
      }
      );
      const data = await res.json();
      console.log(data);
      if(data.success === false)
      {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }

  };

  

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={submitHandler} className='flex flex-col gap-4 '>
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' onChange={changeHandler}/>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email'  onChange={changeHandler} />
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password'  onChange={changeHandler}/>
        <input type="password" placeholder='confirmpassword' className='border p-3 rounded-lg' id='confirmpassword'  onChange={changeHandler}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 '>{loading ? 'Loading..':'Sign Up'}</button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Already Have an Account?</p>
        <Link to={'/sign-in'}>
          <span className='text-red-700'>Sign In</span>
        </Link>
        {error && <p className='text-blue-500'>{error}</p>}
      </div>
    </div>
  )

}









// import React, { useState } from 'react'
// import { Link , useNavigate } from 'react-router-dom';






// // export default function Signout() {
// //   const[formData,setFormData]  = useState({})
// //   const [error, setError] = useState(null);
  
// //   const [loading,setLoading] = useState(false);
// //   const navigate=useNavigate();
// //   const changeHandler = (e)=>{
// //     setFormData({
// //       ...formData,
// //       [e.target.id]:e.target.value,
// //     })
// //   };

// //   // const submitHandler =async (e)=>{
// //   //   e.preventDefault();
// //   //   const res = await fetch('/api/auth/sign-up',
// //   //   {
// //   //     method:'POST',
// //   //     headers:{
// //   //       'Content-Type':'application/json',
// //   //     },
// //   //     body: JSON.stringify(formData),
// //   //   });
// //   //   const data= await res.json();
// //   //   console.log(data);
// //   // }
// //   const submitHandler = async (e) => {
// //     e.preventDefault();
// //     try {
// //       setLoading(true);
   
  
// //     const res = await fetch('/api/auth/sign-up', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify({
// //         username: formData.username,
// //         email: formData.email,
// //         password: formData.password,
// //         confirmpassword: formData.confirmpassword,
// //       }),
// //     });
    
// //     const data = await res.text(); // Read response as text
// //     console.log(data);
// //     if(data.success === false){
// //       setLoading(false);
// //       setError(data.message);
// //       return;
// //     }
// //     setLoading(false);
// //     setError(null);
// //     //navigate('/sign-in');
// //      // Log the response content
    
// //     // Now try to parse the response as JSON
// //     try {
// //       const jsonData = JSON.parse(data);
// //       console.log(jsonData);
// //     } catch (error) {
// //       console.error('Error parsing JSON:', error);
// //     }
// //     } catch (error) {
// //       setLoading(false);
// //       setError(error.message);
// //     }
    
    
// //   };
  

//   return (
//     <div className='p-3 max-w-lg mx-auto'>
//       <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
//       <form onSubmit={submitHandler} className='flex flex-col gap-4 '>
//         <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' onChange={changeHandler}/>
//         <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email'  onChange={changeHandler} />
//         <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password'  onChange={changeHandler}/>
//         <input type="password" placeholder='confirmpassword' className='border p-3 rounded-lg' id='confirmpassword'  onChange={changeHandler}/>
//         <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 '>{loading ? 'Loading..':'Sign Up'}</button>
//       </form>
//       <div className='flex gap-2 mt-5'>
//         <p>Already Have an Account?</p>
//         <Link to={'/sign-in'}>
//           <span className='text-blue-700'>Sign In</span>
//         </Link>
//       </div>
//       {error && <p className='text-red-500'>{error}</p>}
//     </div>
//   )
// }
