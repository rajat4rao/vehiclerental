import { createSlice } from '@reduxjs/toolkit'

export const CarSlice=createSlice({
    name:'cardetails',
    initialState:
    {
        bookAuth:'',
        FilterAuth:'',
        car_no:'',
        start_date:'',
        drop_date:'',
        status:"BookingDetails"
    },
    reducers:{

        Filldetails(state,action)
        {
            state.start_date=action.payload.start_date
            state.drop_date=action.payload.drop_date
        },
        Fillstartdate(state,action)
        {
            state.start_date=action.payload.start_date
        },
        Filldropdate(state,action)
        {
            state.drop_date=action.payload.drop_date
        },

        FillCarNumber(state,action)
        {
            state.bookAuth=true;
            state.car_no=action.payload.car_no
        },
        FillOutCarNumber(state,action)
        {
            state.bookAuth=false
        }
        
    }
})


export const { Filldetails,FillCarNumber,FillOutCarNumber,Fillstartdate,Filldropdate} = CarSlice.actions;

export default CarSlice.reducer