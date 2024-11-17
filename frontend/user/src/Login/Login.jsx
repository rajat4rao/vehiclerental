//import auth from "../config/firebase";
//import { signInWithEmailAndPassword } from "firebase/auth";

import axios from "../api/axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import { SignInDetails } from "../Slice/userSlice";

import ForgotPassword from "../ForgotPassword/ForgotPassword";
import Navbar from "../Navbar/Navbar";
import Footer from "../Home/Footer/Footer";

import { ConfigProvider, notification } from 'antd'

import LoginImage from '../Images/Login/LoginImage.jpg'

const Login = () => {
    const [formdata, Setformdata] = useState({ email: '', password: '' })
    const [Ack, SetAck] = useState(false)
    const [Errmsg, SetErr] = useState({ email: '', password: '' })
    const [PasswordReset, SetPasswordReset] = useState(false)

    const dispatch = useDispatch();
    const Navigate = useNavigate()
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (message) => {

        api.warning(
            {
                message: message,
                placement: "topRight",
                duration: 2,
                style: {
                    background: "#EED202	",
                }

            }
        )
    };

    const ValidateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formdata.email.trim() === "" || formdata.email === null) {
            SetErr((prev) => { return ({ ...prev, email: 'Enter your email' }) })
            SetAck(true)
        }
        else if (!emailRegex.test(formdata.email)) {
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

        if (formdata.email !== "" && formdata.email !== null && formdata.email.includes('@gmail.com') && formdata.password !== "" && formdata.password !== null) {
            LoginInDetails()
        }
    }

    const FetchUserDetails = async (uid) => {
        const { data } = await axios.post("/findUser", { uid });
        dispatch(SignInDetails(data))
        Navigate("/")
    }

    const LoginInDetails = async () => {
        try {
            //const result = await signInWithEmailAndPassword(auth, formdata.email, formdata.password) 
            const email = formdata.email;
            const password = formdata.password; 
            const { data } = await axios.post("/login", {email, password});

            FetchUserDetails(data.uid)
        } catch (error) {
            openNotification('Invalid Details')
        }
    }

    const LoginChange = (e) => {
        const { name, value } = e.target;
        Setformdata({ ...formdata, [name]: value.trim() })
    }

    return (
        <>
            <Navbar />
            {PasswordReset ? (<>
                <ForgotPassword SetPasswordReset={SetPasswordReset} />
            </>) : (
                <div className="flex min-h-[80vh] w-full justify-center items-center p-4">
                    <div className="flex flex-col md:flex-row w-full md:w-3/4 bg-gray-100 shadow-md rounded-md p-2">
                        <div className="md:w-1/2 p-4">
                            <div className="mb-8">
                                <h1 className="text-3xl font-bold">Login</h1>
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-2" htmlFor="email">Email Address:</label>
                                <input className="w-full p-2 border border-black outline-none" type="email" name='email' onChange={LoginChange} placeholder="Email Address" autoComplete="off" required />
                                {Ack ? (<span className="text-red-500 text-sm">{Errmsg.email}</span>) : (<span className="text-red-500 text-sm">{Errmsg.email}</span>)}
                            </div>
                            <div className="mb-4">
                                <label className="block font-bold mb-2" htmlFor="password">Password:</label>
                                <input className="w-full p-2 border border-black outline-none" type="password" name='password' onChange={LoginChange} placeholder="Password" autoComplete="off" aria-required />
                                {Ack ? (<span className="text-red-500 text-sm">{Errmsg.password}</span>) : (<span className="text-red-500 text-sm">{Errmsg.password}</span>)}
                            </div>
                            <div className="mb-4">
                                <p className="text-purple-700 font-bold cursor-pointer hover:underline" onClick={() => { SetPasswordReset(true) }}>Forgot Password?</p>
                            </div>
                            <div className="text-center">
                                <button className="bg-gray-800 text-white w-full md:w-4/5 py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-300" onClick={ValidateForm}>Login</button>
                                <p className="mt-2">Doesn't have an account yet?<Link className="text-purple-700 font-bold ml-2 hover:underline" to="/SignUp">SignUp</Link></p>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <img src={LoginImage} alt="LoginImage" className="w-full h-full object-cover rounded-md" />
                        </div>
                    </div>

                </div>
            )}
            <Footer />
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