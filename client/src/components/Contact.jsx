
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';




export default function Contact({listing}) {
  
    const [person ,setPerson] = useState(null);
    const [message, setMessage] = useState('');




    const changeHandler =(e) =>{
        setMessage(e.target.value);
    }
    useEffect(()=>{
        const fetchPerson = async ()=>{
            try {
                const res = await fetch(`/api/user/${listing.useRef}`);
                const data = await res.json();
                setPerson(data);

            } catch (error) {
                console.log(error);
            }
        }

        fetchPerson();
    }, [listing.useRef])
  
    return (
   
        <>
        {person && (
            <div className="flex flex-col gap-2">
                <p>Contact <span className='text-blue-500 font-bold '>{person.username}</span> for <span className='font-bold text-black-400'>{listing.name.toLowerCase()}</span> </p>
                <textarea className='w-full border p-3 rounded-lg' placeholder='Enter Your Message...' name='message ' id='message' rows='2' value={message} onChange={changeHandler}>

                </textarea>

               

<Link to={`mailto:${person.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-90'>
    Send Message
</Link>

            </div>
        )}

        </>

  )
}
