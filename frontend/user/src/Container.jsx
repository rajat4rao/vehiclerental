import { useState,useEffect } from "react";
import axios from "./api/axios";
import { useDispatch, useSelector } from "react-redux";

//Slice
import { SignInDetails, SignOutDetails } from "./Slice/userSlice";

//Firebase
import auth from "./config/firebase";
//Modules
import Loading from './Loading/Loading'

const Container=({ children })=> {

    const [loading, setLoading] = useState(true);
    const dispatch =useDispatch()

    const FetchUserDetails=async(uid)=>
    {
        try
        {
            const { data } = await axios.post("/findUser", { uid });
            dispatch(SignInDetails(data))
            setLoading(false);

        }
        catch(error)
        {
            console.log(error)
        }
            

    }
    useEffect(() => {
        
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("Logged")
                FetchUserDetails(user.uid)


            }
            else {
                console.log("Logged off")
                setLoading(false);
                dispatch(SignOutDetails())
            }
        })
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