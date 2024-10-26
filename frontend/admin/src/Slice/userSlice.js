import { createSlice } from '@reduxjs/toolkit'

export const UserSlice = createSlice({
  name: 'user',
  initialState: {
    isAuth:false,
    uid:'',
    location:'',
},
  reducers:{
    SignInDetails(state,action)
    {
        state.uid=action.payload.uid;
        state.location=action.payload.location;
        state.isAuth=true;
    },
    SignOutDetails(state,action)
    {
        state.uid='';
        state.location='';
        state.isAuth=false;
    },

  }

})
  export const { SignInDetails, SignOutDetails } = UserSlice.actions

export default UserSlice.reducer