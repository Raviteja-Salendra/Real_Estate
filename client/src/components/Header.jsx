//import { IoSearch } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate} from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";

export default function Header() {
  const {currentUser}= useSelector(state=>state.user)
  const [searchTerm, setSearchTerm ] = useState('');
  const navigate= useNavigate();


  // for searchterm
  const submitHandler = (e)=>{
    e.preventDefault();

    //to get previous data in search params
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm',searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  };

  useEffect(()=>{
    const urlParams =new URLSearchParams(window.location.search);
    const searchTermofUrl = urlParams.get('searchTerm');
    if(searchTermofUrl){
      setSearchTerm(searchTermofUrl)
    }
  },[location.search])

  return (
    <header className='bg-[#47495c] shadow-md'>
       <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
       <Link to="/">
       <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
        <span className='text-white font-extrabold '>SatvikSai </span>
        <span className='text-white font-bold'> RealEstates</span>
      </h1>
      </Link>
      <form onSubmit={submitHandler} className='bg-slate-100 p-3 rounded-lg flex items-center'>
        <input 
        type='text' placeholder='Search..'  
        className='bg-transparent focus:outline-none w-32 sm:w-64 md:w-64' 
        onChange={(e)=> setSearchTerm(e.target.value)} 
        value={searchTerm}
        />

        <button>
        <FaSearch className='text-slate-500' />
        </button>
       
      
      </form>
      <ul className="flex  gap-4">
        <Link to='/'>
        
        <li className="hidden sm:inline text-white hover:underline">Home</li>
        </Link>
        <Link to="/about">
        <li className="hidden sm:inline text-white hover:underline">About</li>
        </Link>
        <Link to="/profile">
        {currentUser ?(
          <img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt="Profile" />
         // <img className="rounded-full h-7 w-7 object-cover" src="{currentUser.avatar}" alt="Profile" />
        ): <li className=" text-white hover:underline">Sign in</li>}
        
      
        </Link>
      </ul>
       </div>

    </header>
  )
}
