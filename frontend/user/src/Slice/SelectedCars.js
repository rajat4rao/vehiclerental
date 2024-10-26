import { createSlice } from '@reduxjs/toolkit'

export const SelectedCarsSlice=createSlice({
    name:'SelectedCars',
    initialState:
    {
        location:'',
        Fuel:[],
        Make:[],
        Model:[],
        Type:[],
        price:[], 
    },
    reducers:{

        FillSelectedCars(state,action)
        {
            state.location=action.payload.location
            state.Fuel=action.payload.Fuel;
            state.Make=action.payload.Make;
            state.Model=action.payload.Model
            state.Type=action.payload.Type;
        },
        FillSelectedCarsOut(state,action)
        {
            state.location=false
            state.Fuel=[]
            state.Make=[]
            state.Model=[]
            state.Type=[]
        },
    }
})


export const { FillSelectedCars, FillSelectedCarsOut} = SelectedCarsSlice.actions;

export default SelectedCarsSlice.reducer