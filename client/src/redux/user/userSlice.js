// REDUX STATE SLICE


import {createSlice} from '@reduxjs/toolkit';


// similar to seterror, setloading usestates
const initialState={
    currentUser:null,
    error: null,
    loading: false,
};


// creating REDUX STATE SLICE for user
// which helps to helps to access userdata
// in different places in our appliacttion'
const userSlice = createSlice({
    name:'user',
    initialState,
    // functions which are for global using 
    reducers:{
        signInStart: (state)=>{
            state.loading=true; // similar to setloadind in usestate
        },

        //action is  the data receiving from database
        signInSuccess: (state,action)=>{
            state.currentUser=action.payload;
            state.loading=false,
            state.error=null;
        },
        signInFailure :(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        updateUserStart:(state)=>{
            state.loading=true;
        },
        updateUserSuccess:(state,action)=>{
            state.currentUser=action.payload;
            state.loading=false;
            state.error=null;
        },
        updateUserFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        deleteUserStart:(state)=>{
            state.loading=true;
        },
        deleteUserSuccess:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;
        },
        deleteUserFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },

        signoutStart:(state)=>{
            state.loading=true;
        },
        signoutSuccess:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;
        },
        signoutFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
    }
})

export const { 
    signInStart, 
    signInSuccess , 
    signInFailure, 
    updateUserStart, 
    updateUserSuccess, 
    updateUserFailure ,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutStart,
    signoutSuccess,
    signoutFailure,
} = userSlice.actions;  // use in other places

export default userSlice.reducer;  // exporting the reducer to store.js