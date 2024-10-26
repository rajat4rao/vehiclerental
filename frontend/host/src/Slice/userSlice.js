import { createSlice } from '@reduxjs/toolkit'

export const UserSlice = createSlice({
  name: 'user',
  initialState: {
    isAuth:false,
    sid:'',
    location:''
},
  reducers:{
    SignInDetails(state,action)
    {
      state.sid=action.payload.sid;
      state.location=action.payload.location;
      state.isAuth=true;
    },
    SignOutDetails(state,action)
    {
      state.sid='';
      state.location='';
      state.isAuth=false;
    }
  }
})

export const { SignInDetails, SignOutDetails } = UserSlice.actions
export default UserSlice.reducer