import { useState,useEffect } from "react";
import axios from "./api/axios";
import { useDispatch, useSelector } from "react-redux";

//Slice
import { SignInDetails, SignOutDetails } from "./Slice/userSlice";

//Firebase
//import auth from "./Config/firebase";
//Modules
import Loading from './Loading/Loading'

const Container=({ children })=> {

    const [loading, setLoading] = useState(true);
    const dispatch =useDispatch()

    const FetchUserDetails=async(uid)=>
    {
        try
        {
            // const { data } = await axios.post("/findUser", { uid });
            // dispatch(SignInDetails(data))
            setLoading(false);

        }
        catch(error)
        {
            console.log(error)
        }
            

    }
    useEffect(() => {  
        const checkAuthStatus = async () => {
            try {
                const { data } = await axios.get('/check-auth-status'); 
    
                if (data.isAuthenticated) {
                    FetchUserDetails(data.user.uid)
                } else {
                    dispatch(SignOutDetails());
                }
            } catch (error) {
                console.error("Authentication check failed:", error);
                dispatch(SignOutDetails());
            } finally {
                setLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    if (loading) {
        return (
            <Loading/>
            )
    }

    return (
        children
    )

}

export default Container;