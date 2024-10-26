//Firebase 
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../config/firebase";

//React 
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../api/axios";

//Slice
import { SignInDetails } from "../Slice/userSlice";

//Module
import ForgotPassword from "../ForgotPassword/ForgotPassword";

import ForgotImage from "../Images/ForgotImage.avif";


//Antd-Framework
import { ConfigProvider, notification } from 'antd'

const Login = () => {
    const [formdata, Setformdata] = useState({ email: '', password: '' })
    const [Ack, SetAck] = useState(false)
    const [Errmsg, SetErr] = useState({ email: '', password: '' })
    const [PasswordReset, SetPasswordReset] = useState(false)
    const user = useSelector((state) => state.user)
    const [api, contextHolder] = notification.useNotification();

    const dispatch = useDispatch();
    const Navigate = useNavigate()

    const openNotification = (message) => {
        api.warning(
            {
                message: message,
                placement: "topRight",
                duration: 2,
                style: {
                    background: "#EED202",
                }
            }
        )
    };

    const ValidateForm = () => {
        if (formdata.email.trim() === "" || formdata.email === null) {
            SetErr((prev) => { return ({ ...prev, email: 'Enter your email' }) })
            SetAck(true)
        }
        else if (!formdata.email.includes("@gmail.com")) {
            SetErr((prev) => { return ({ ...prev, email: 'Enter a valid email' }) })
            SetAck(true)
        }
        else {
            SetErr((prev) => { return ({ ...prev, email: '' }) })
            SetAck(false)
        }

        if (formdata.password.trim() === "" || formdata.password === null) {
            SetErr((prev) => { return ({ ...prev, password: 'Enter your password' }) })
            SetAck(true)
        }
        else {
            SetErr((prev) => { return ({ ...prev, password: '' }) })
            SetAck(false)
        }

        if (formdata.email !== "" && formdata.email !== null && formdata.email.includes("@gmail.com") && formdata.password !== "" && formdata.password !== null) {
            LoginInDetails()
        }
    }

    const FetchUserDetails = async (sid) => {
        const { data } = await axios.post("/findUser", { sid });
        dispatch(SignInDetails(data))
        Navigate("/Dashboard")
    }

    const LoginInDetails = async () => {
        try {
            const result = await signInWithEmailAndPassword(auth, formdata.email, formdata.password);
            FetchUserDetails(result.user.uid)
        } catch (error) {
            openNotification('Invalid Details')
        }
    }

    const LoginChange = (e) => {
        const { name, value } = e.target;
        Setformdata({ ...formdata, [name]: value.trim() })
    }

    useEffect(() => {
        if (user.isAuth) {
            Navigate('/Dashboard')
        }
    }, [])

    return (<>
        {PasswordReset ? (<>
            <ForgotPassword SetPasswordReset={SetPasswordReset} />
        </>) : (
            <>
                <div className="h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center" style={{ backgroundImage: `url(${ForgotImage})` }}>
                    <div className="w-1/2 h-fit bg-white rounded-md p-4 backdrop-blur-md bg-opacity-85 border border-gray-300 shadow-md md:w-1/3">
                        <h1 className="text-center text-2xl font-bold mb-4">Login Page</h1>
                        <label htmlFor="Login-Email" className="block text-lg font-bold mb-1 ml-1">Email Address:</label>
                        <input type="email" name='email' onChange={LoginChange} className="border-2 border-gray-700 rounded-md w-full p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email Address" autoComplete="off" required />
                        {Ack ? (<span className="text-red-500 text-sm ml-1">{Errmsg.email}</span>) : (<span className="text-red-500 text-sm ml-1">{Errmsg.email}</span>)}

                        <label htmlFor="Login-Password" className="block text-lg font-bold mt-4 mb-1 ml-1">Password:</label>
                        <input type="password" name='password' onChange={LoginChange} className="border-2 border-gray-700 rounded-md w-full p-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Password" autoComplete="off" aria-required />
                        {Ack ? (<span className="text-red-500 text-sm ml-1">{Errmsg.password}</span>) : (<>{Errmsg.password}</>)}

                        <div className="mt-4 ml-1">
                            <p className="text-purple-700 font-bold cursor-pointer hover:underline" onClick={() => { SetPasswordReset(true) }}>Forgot Password?</p>
                        </div>

                        <div className="flex justify-center mt-4">
                            <button className="bg-gray-700 hover:bg-gray-800 text-white rounded-md px-4 py-2 transition-colors duration-300 cursor-pointer w-1/3 md:w-1/4" onClick={ValidateForm}>Login</button>
                        </div>

                        <div className="text-center mt-4">
                            <p className="font-bold">Doesn't have an account yet? <Link className="text-purple-700 hover:underline" to="/SignUp">SignUp</Link></p>
                        </div>
                    </div>
                </div>
            </>
        )}
        <ConfigProvider
            theme={{
                token: {
                    colorText: "white",
                    colorSuccess: "white",
                    colorError: "white"
                },
                components: { Notification: { zIndexPopup: 99999 } }
            }}>
            {contextHolder}
        </ConfigProvider>
    </>
    )
}

export default Login;