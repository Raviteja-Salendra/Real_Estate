// import React from 'react'
//importing useSelector to get currentUser which is in userslice.js

import { useSelector } from 'react-redux'

//to run children routes of PrivateRoute in App.jsx we use outlet
import { Outlet, Navigate } from 'react-router-dom'

export default function PrivateRoute() {
    const {currentUser} = useSelector((state)=>state.user)

  return (
    currentUser ? <Outlet /> : <Navigate to='/sign-in' />
  )
}
