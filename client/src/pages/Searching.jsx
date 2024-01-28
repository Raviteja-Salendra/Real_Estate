import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

// after search we have to list the properties
import ListingItem from '../components/ListingItem';
export default function Searching() {
  const navigate = useNavigate();
  const[sidebardata,setSIdebarData] = useState({
    searchTerm :'',
    type :'all',
    parking: false,
    furnished : false,
    offer: false,
    sort:'created_at',
    order: 'desc',
  });


  const [loading,setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const[showmore ,setShowmore] = useState(false);

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermofUrl =urlParams.get('searchTerm');
    const typeofUrl = urlParams.get('type');
    const parkingofUrl = urlParams.get('parking');
    const furnishedofUrl = urlParams.get('furnished');
    const offerofUrl = urlParams.get('offer');
    const sortofUrl = urlParams.get('sort');
    const orderofUrl = urlParams.get('order');

    if(searchTermofUrl || 
      typeofUrl || 
      parkingofUrl || 
      furnishedofUrl || 
      offerofUrl || 
      sortofUrl || orderofUrl
      )

      {
        setSIdebarData({
          
          searchTerm : searchTermofUrl || '',
          type : typeofUrl || 'all',
          parking : parkingofUrl === 'true'? true : false,
          furnished : furnishedofUrl === 'true'? true : false,
          offer : offerofUrl === 'true'? true : false,
          sort : sortofUrl || 'created_at',
          order : orderofUrl || 'desc',
        })
      }

      const fetchdataListings = async ()=>{
        setLoading(true); 
        setShowmore(false);
        const searchQuerys = urlParams.toString();
        const res = await fetch(`/api/listing/searchproperty? ${searchQuerys}`);
        const data = await res.json();
        if(data.length>8)
        {
          setShowmore(true);
        }
        else
        {
          setShowmore(false)
        }
        setListings(data);
        setLoading(false);
      }

      fetchdataListings();

  },[location.search]);

  const changeHandler =(e)=>{
    if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale'){
      setSIdebarData({...sidebardata, type:e.target.id})
    }

    if(e.target.id === 'searchTerm'){
      //search term is updated
      setSIdebarData({...sidebardata, searchTerm:e.target.value})
    }

    if(e.target.id ==='parking' || e.target.id === 'furnished' || e.target.id === 'offer'){
      setSIdebarData({...sidebardata,[e.target.id] : e.target.checked || e.target.checked === 'true' ? true : false});
    }

    if(e.target.id === 'sort_order'){
      const sort = e.target.value.split('_')[0] || 'created_at';

      const order =  e.target.value.split('_')[1] || 'desc';

      setSIdebarData({...sidebardata , sort, order})
    }


  };


  


  const submitHandler = (e)=>{
    e.preventDefault();

    //to render previous data
    const urlParams = new URLSearchParams()

    urlParams.set('searchTerm',sidebardata.searchTerm);
    urlParams.set('type',sidebardata.type);
    urlParams.set('parking',sidebardata.parking);
    urlParams.set('furnished',sidebardata.furnished);
    urlParams.set('offer',sidebardata.offer);
    urlParams.set('sort',sidebardata.sort);
    urlParams.set('order',sidebardata.order);

    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);


  }


  const onShowMoreClick = async() =>{
    const numofListings = listings.length;
    const startIndex = numofListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex',startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/searchproperty?${searchQuery}`);
    const data = await res.json();
    if(data.length<9){
      setShowmore(false);
    }
    setListings([...listings, ...data]);


  }

  return (

    <div className='flex flex-col md:flex-row'>
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={submitHandler} className='flex flex-col gap-8'>
          <div className="flex items-center gap-3">
            <label className='whitespace-nowrap font-semibold'>
              Search Properties :
            </label>
            <input 
             type='text' id='searchTerm' placeholder='Search...' 
             className='border rounded-lg p-3 w-full'
             value={sidebardata.searchTerm} onChange={changeHandler}
              />

          </div>

          <div className="flex gap-3 flex-wrap items-center">
            <label className='font-semibold'>Type:</label>
            <div className="flex gap-3">
              <input onChange={changeHandler}  type="checkbox" id='all' className='w-5 ' checked={sidebardata.type === 'all'} />
              <span>Rent & Sale</span>
            </div>

            <div className="flex gap-3">
              <input type="checkbox" id='rent' className='w-5 ' 
              onChange={changeHandler}
              checked={sidebardata.type ==='rent'}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-3">
              <input type="checkbox" id='sale' className='w-5 '
              onChange={changeHandler}
              checked={sidebardata.type === 'sale'}
               />
              <span>Sale</span>
            </div>

            <div className="flex gap-3">
              <input type="checkbox" id='offer' className='w-5 '
              onChange={changeHandler}
              checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>




          <div className="flex gap-3 flex-wrap items-center">
            <label className='font-semibold' >Availabilities:</label>
            <div className="flex gap-3">
              <input type="checkbox" id='parking' className='w-5 '
               onChange={changeHandler}
               checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>

            <div className="flex gap-3">
              <input type="checkbox" id='furnished' className='w-5 '
               onChange={changeHandler}
               checked={sidebardata.furnished}
              />
              <span>Furnished</span>


             
            </div>
          </div>



        <div className="flex items-center gap-3">
          <label className='font-semibold'>Sort:</label>
          <select onChange={changeHandler} defaultValue={'created_at_desc'} name="" id="sort_order" className='border rounded-lg p-3'>
            <option value="regularPrice_desc">Price high to low</option>
            <option value="regularPrice_asc">Price low to high</option>
            <option value="createdAt_desc">latest</option>
            <option value="createdAt_asc">Oldest</option>
          </select>
        </div>

        <button className='bg-blue-900 text-white p-3 rounded-lg uppercase hover:opacity-90'>Search</button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className='text-3xl font-bold border-b p-3 text-slate-700 mt-5'>Listing Properties:</h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 &&(
            <p className='text-xl text-slate-600'>No Properties Found</p>
          )}

          { loading && (
            <p className='text-xl text-slate-600 text-center w-full'>Loading....</p>
          )
          }

          {
            !loading && listings && listings.map ((listing)=> <ListingItem key={listing._id} listing={listing} />)
          }

          {
            showmore && (
              <button onClick={onShowMoreClick}  className='text-black hover:underline p-7 text-center w-full'>Show More</button>
            )
          }
        </div>
      </div>
    </div>
  )
}
