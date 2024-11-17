//React
import { useState,useEffect } from "react";
import axios from "./api/axios";
import { useDispatch } from "react-redux";

//Firebase
//import auth from "./config/firebase";

//Slice
import { SignInDetails, SignOutDetails } from "./Slice/userSlice";

//Modules
import Loading from './Loading/Loading'


const Container=({ children })=> {
    const [loading, setLoading] = useState(true);
    const dispatch =useDispatch()

    const FetchUserDetails=async(sid)=>
    {
        try
        {
            const { data } = await axios.post("/findUser", { sid });
            dispatch(SignInDetails(data))
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
                    FetchUserDetails(data.user.sid)
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