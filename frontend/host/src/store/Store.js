import { configureStore } from '@reduxjs/toolkit'
import UserReducer from '../Slice/userSlice';
 const Store= configureStore({
  reducer: {
    user:UserReducer,
  },
})

export default Store;