import { createSlice } from '@reduxjs/toolkit'

export const UserSlice = createSlice({
  name: 'user',
  initialState: {
    isAuth:localStorage.getItem('isAuth') === 'true' || false,
    uid:'',
    location:'',
},
  reducers:{
    SignInDetails(state,action)
    {
        state.uid=action.payload.uid;
        state.location=action.payload.location;
        state.isAuth=true;
        localStorage.setItem('isAuth', 'true');
    },
    SignOutDetails(state,action)
    {
        state.uid='';
        state.location='';
        state.isAuth=false;
        localStorage.removeItem('isAuth'); 
    },

  }

})
  export const { SignInDetails, SignOutDetails } = UserSlice.actions

export default UserSlice.reducer