import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import  { Swiper , SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {

  const [offerdata,setOfferdata] = useState([]);
  const [saledata,setSaledata] =useState([]);
  const [ rentdata, setRentdata] = useState([]);
  SwiperCore.use([Navigation])
  
  useEffect(()=>{
    const fetchofferdata = async()=>{
      try {
        const res = await fetch(`/api/listing/searchproperty?offer=true&limit=4`);
        const data =await res.json();
        setOfferdata(data);
        fetchrentdata();
      } catch (error) {
        console.log(error);
      }
    }
    fetchofferdata();

    const fetchrentdata = async()=>{
      try {
        const res = await fetch(`/api/listing/searchproperty?type=rent&limit=4`);

        const data =await res.json();
        setRentdata(data);
        fetchsaledata();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchsaledata = async () =>{
      try {
        const res = await fetch(`/api/listing/searchproperty?type=sale&limit=4`);

        const data =await res.json();
        setSaledata(data);
        
      } catch (error) {
       console.log(error); 
      }
    }
  },[])

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto ">
        <h1 className='text-slate-700 font-extrabold text-3xl lg:text-6xl '>Dream Homes. <span className='text-slate-900 font-extrabold uppercase '>Satviksai Real Estates</span></h1>
        <div className="text-gray-400 text-xs  sm: text-sm">
          Satvik Estates is the best place to find your next home place to live.
          Satvik Estates is the best place to find your next home place to live.
          <br />
          More description get from chatgpt
        </div>
        <Link className='text-xs sm:text-sm text-blue-900 font-bold hover:underline' to={'/search'}>
          Get Started......
        </Link>
      </div>




      {/* swiper*/}

      <Swiper navigation>
      {
        offerdata && offerdata.length>0 &&  offerdata.map((property)=>(
          <SwiperSlide>
            <div style={{background :`url(${property.imageUrls[0]}) center no-repeat `,backgroundSize : "cover"}} className="h-[500px] " key={property._id}>

            </div>
          </SwiperSlide>
        ))
      }

      </Swiper>

      





      { /* listing results for offer,sale and rent */}

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        
        {
          offerdata && offerdata.length>0 && (
            <div className="">
            <div className="my-3 ">
              <h2 className='text-2xl font-semibold text-slate-600 '>Recent Offers</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>
                Show More Offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 ">
              {
                offerdata.map((listing)=>(
                  <ListingItem listing={listing} key={listing._id} />
                ))
              }
            </div>
            </div>
          )
        }
        

        {
          rentdata && rentdata.length>0 && (
            <div className="">
            <div className="my-3 ">
              <h2 className='text-2xl font-semibold text-slate-600 '>Recent Properties for Rent</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>
                Show more Properties for Rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 ">
              {
                rentdata.map((listing)=>(
                  <ListingItem listing={listing} key={listing._id} />
                ))
              }
            </div>
            </div>
          )
        }


{
          saledata && saledata.length>0 && (
            <div className="">
            <div className="my-3 ">
              <h2 className='text-2xl font-semibold text-slate-600 '>Recent Properties for Sale</h2>
              <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>
                Show More Properties for Sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 ">
              {
                saledata.map((listing)=>(
                  <ListingItem listing={listing} key={listing._id} />
                ))
              }
            </div>
            </div>
          )
        }


      </div>




    </div>
  )
}
