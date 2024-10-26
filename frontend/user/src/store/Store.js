import { configureStore } from '@reduxjs/toolkit'
import UserReducer from '../Slice/userSlice';
import CarSlice from '../Slice/CarSLice';
import FilterSlice from '../Slice/FilterSlice';
import SelectedCarsSlice from '../Slice/SelectedCars';
 const Store= configureStore({
  reducer: {
    user:UserReducer,
    cardetails:CarSlice,
    FilterDetails:FilterSlice,
    SelectedCars:SelectedCarsSlice
  },
})

export default Store;