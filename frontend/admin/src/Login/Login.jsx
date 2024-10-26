//Hooks Imports
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../api/axios';
import { signInWithEmailAndPassword } from "firebase/auth";
import auth from "../Config/firebase";




//Antd-Framework
import { ConfigProvider, notification } from 'antd'

const Login = () => {

    const [formdata, Setformdata] = useState({ email: "", password: "" });
    const [Ack, SetAck] = useState(false);
    const [Errmsg, SetErr] = useState({ email: "", password: "" });
    const [api, contextHolder] = notification.useNotification();

    const Navigate = useNavigate();

    const openNotification = (message) => {
        api.warning({
            message: message,
            placement: "topRight",
            duration: 2,
            style: {
                background: "#EED202",
            },
        });
    };

    const ValidateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formdata.email.trim() === "" || formdata.email === null) {
            SetErr((prev) => {
                return { ...prev, email: "Enter your email" };
            });
            SetAck(true);
        } else if (!emailRegex.test(formdata.email)) {
            SetErr((prev) => {
                return { ...prev, email: "Enter a valid email" };
            });
            SetAck(true);
        } else {
            SetErr((prev) => {
                return { ...prev, email: "" };
            });
            SetAck(false);
        }

        if (formdata.password.trim() === "" || formdata.password === null) {
            SetErr((prev) => {
                return { ...prev, password: "Enter your password" };
            });
            SetAck(true);
        } else {
            SetErr((prev) => {
                return { ...prev, password: "" };
            });
            SetAck(false);
        }

        if (formdata.email !== "" && formdata.email != null  && formdata.password !== "" && formdata.password !== null) {
            LoginInDetails();
        }
    };

    const LoginInDetails = async () => {


        try {
        const result = await signInWithEmailAndPassword(auth, formdata.email, formdata.password);
            sessionStorage.setItem("userAuth", true);
            Navigate("/Dashboard");

        } catch(error) {
            openNotification("Invalid Details");
        }
    };

    const LoginChange = (e) => {
        const { name, value } = e.target;
        Setformdata({ ...formdata, [name]: value.trim() });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center bg-[url('../Images/LoginImage.avif')]">
            <div className="absolute inset-0 bg-black opacity-70"></div> 

            <div className="z-10 w-1/2 max-w-md p-6 rounded-md bg-white bg-opacity-70 backdrop-blur-sm border border-gray-300 shadow-md">
                <h1 className="text-3xl font-bold text-center mb-6">Login Page</h1>

                <label htmlFor="Login-Email" className="block text-lg font-bold mb-2">
                    Email Address:
                </label>
                <input
                    type="email"
                    name="email"
                    onChange={LoginChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-400 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Email Address"
                    autoComplete="off"
                    required
                />
                {Ack && <span className="text-red-500 mt-1">{Errmsg.email}</span>}

                <label htmlFor="Login-Password" className="block text-lg font-bold mt-4 mb-2">
                    Password:
                </label>
                <input
                    type="password"
                    name="password"
                    onChange={LoginChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-400 focus:ring-2 focus:ring-indigo-500"
                    placeholder="Password"
                    autoComplete="off"
                    required
                />
                {Ack && <span className="text-red-500 mt-1">{Errmsg.password}</span>}


                <div className="flex justify-center mt-6">
                    <button className="px-6 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-white font-medium" onClick={ValidateForm}>
                        Login
                    </button>
                </div>

            </div>
            <ConfigProvider
                theme={{
                    token: {
                        colorText: "white",
                        colorSuccess: "white",
                        colorError: "white",
                    },
                    components: { Notification: { zIndexPopup: 99999 } },
                }}
            >
                {contextHolder}
            </ConfigProvider>
        </div>
    );
};

export default Login;