import { createSlice } from '@reduxjs/toolkit'

export const FilterSlice=createSlice({
    name:'FilterDetails',
    initialState:
    {
        FilterAuth:'',
        location:'',
        status:'FilterDetails',
        Fuel:[],
        Make:[],
        Model:[],
        Type:[],
        price:[], 
        ratings:0,
        start_date:'', 
        drop_date:''
    },
    reducers:{

        FillFilter(state,action)
        {
            state.location=action.payload.location;
            state.Fuel=action.payload.Fuel;
            state.Make=action.payload.Make;
            state.Model=action.payload.Model
            state.Type=action.payload.Type;
            state.price=action.payload.price;
            state.ratings=action.payload.ratings;
            state.FilterAuth=true
        },
        FillFilterOut(state,action)
        {
            state.location=""
            state.Fuel=[]
            state.Make=[]
            state.Model=[]
            state.Type=[]
            state.price=[]
            state.ratings=0
            state.FilterAuth=false
        },
        FillFilterDate(state,action)
        {
            state.start_date=action.payload.start_date
            state.drop_date=action.payload.drop_date
        }
    }
})


export const { FillFilter, FillFilterOut,FillFilterDate} = FilterSlice.actions;

export default FilterSlice.reducer