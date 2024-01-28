//redux tool kit helps to access userdata in different places in our appliacttion'



import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice';

// redux -persist
//without redux persist if we refresh the page 
//we can loose the user data. We need to sign in again to avoid this 
//we use redux persist

//redux -persist WORKING Ais located in local storage


//Redux Persist is a library for persisting Redux state to storage, 
//which helps in maintaining the state across page reloads,
// app restarts, or even device reboots. This is particularly useful
// for scenarios where you want to preserve user data, such as 
//authentication status, user preferences, and other application state.

import {persistReducer , persistStore} from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const rootReducer = combineReducers({user:userReducer})


const persistConfig ={
    key:'root', // key is a string that is used to uniquely
    // identify your persist store. It is typically named 'root'.
    storage,  //redux-persist provides several storage engines,
    version:1,
}
const persistedReducer = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
    serializableCheck:false,
  }),            // to avoid error from serializable check of variables
});


// persistStore is a function that takes a Redux 
//store and returns a persisted version of that store along 
//with a promise that resolves once the rehydration is complete.

export const persistor= persistStore(store);
// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch