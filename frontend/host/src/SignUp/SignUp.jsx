import axios from "../api/axios";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

//Antd-Framework
import { ConfigProvider, notification } from 'antd'

const SignUp = () => {
    const [formdata, Setformdata] = useState({ sid: '', name: '', email: '', password: '', confirmpassword: '', phone: '', location: '' })
    const [Ack, SetAck] = useState(false)
    const [Errmsg, SetErr] = useState({ email: '', password: '', confirmpassword: '', name: '', phone: '', location: '' })
    const [api, contextHolder] = notification.useNotification();

    const navigate = useNavigate();

    const openNotification = (message) => {
        {
            message.includes("registered")
                ? api.warning({
                    message: message,
                    placement: "topRight",
                    duration: 2,
                    style: {
                        background: "#EED202",
                    },
                })
                : api.success({
                    message: message,
                    placement: "topRight",
                    duration: 2,
                    style: {
                        background: "#5cb85c",
                    },
                });
        }
    };

    const ValidateForm = () => {
        if (formdata.email === "" || formdata.email === null) {
            SetErr((prev) => { return ({ ...prev, email: 'Enter your email' }) })
            SetAck(true)
        } else if (!formdata.email.includes("@gmail.com")) {
            SetErr((prev) => { return ({ ...prev, email: 'Enter a valid email' }) })
            SetAck(true)
        } else {
            SetErr((prev) => { return ({ ...prev, email: '' }) })
            SetAck(false)
        }

        if(formdata.password==="" || formdata.password===null)
        {
            SetErr((prev)=>{return({...prev,password:'Enter your password'})})
            SetAck(true)
        }
        else if(formdata.password.length<6)
        {
            SetErr((prev)=>{return({...prev,password:'Password must contain minimum of 6 length'})})
            SetAck(true)
        }
        else
        {
            SetErr((prev)=>{return({...prev,password:''})})
            SetAck(false)
        }

        if(formdata.confirmpassword==='' || formdata.confirmpassword===null)
        {
            SetErr((prev)=>{return({...prev,confirmpassword:'Enter your password'})})
            SetAck(true)
        }
        else if(formdata.confirmpassword!==formdata.password)
        {
            SetErr((prev)=>{return({...prev,confirmpassword:'Password doesnt match'})})
            SetAck(true)
        }
        else
        {
            SetErr((prev)=>{return({...prev,confirmpassword:''})})
            SetAck(false)
        }

        if(formdata.name==="" || formdata.name==null)
        {
            SetErr((prev)=>{return({...prev,name:"Enter your name"})})
            SetAck(true)
        }
        else
        {
            SetErr((prev)=>{return({...prev,name:''})})
            SetAck(false)
        }

        if(formdata.phone==="" || formdata.phone==null)
        {
            SetErr((prev)=>{return({...prev,phone:"Enter your phone number"})})
            SetAck(true)
        }
        else if(formdata.phone.length!=10)
        {
            SetErr((prev)=>{return({...prev,phone:"Enter a valid phone number"})})
            SetAck(true)
        }
        else
        {
            SetErr((prev)=>{return({...prev,phone:""})})
            SetAck(false)
        }

        if(formdata.location==='' || formdata.location===null)
        {
            SetErr((prev)=>{return({...prev,location:"Enter your location"})})
            SetAck(true)
        }
        else
        {
            SetErr((prev)=>{return({...prev,location:""})})
            SetAck(false)
        }
        if (formdata.email !== "" && formdata.email !== null && formdata.password.length >= 6 && formdata.confirmpassword !== '' && formdata.password === formdata.confirmpassword && formdata.password !== "" && formdata.password !== null && formdata.name !== "" && formdata.name !== null && formdata.phone !== "" && formdata.phone !== null && formdata.phone.length === 10 && formdata.location !== "" && formdata.location !== null) {
            CreateUser();
        }
    }

    const CreateUser = async () => {
        try {
            if (formdata.email != '' && formdata.password != '' && formdata.name != '' && formdata.phone != '' && formdata.location != '') {
                const { data } = await axios.post("/CreateUser", formdata);
                if (data.action) {
                    navigate("/")
                } else {
                    openNotification(data.status)
                }
            }

        } catch (error) {
            alert(error);
        }
    }

    const SignUpChange = (e) => {
        const { name, value } = e.target;
        Setformdata({ ...formdata, [name]: value.trim() })
    }

    return (
        <div className="h-screen w-screen bg-cover bg-center bg-[url('../Images/ForgotImage.avif')] bg-no-repeat flex flex-col items-center justify-center bg-gray-800">
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
            <div className="bg-white bg-opacity-85 backdrop-blur-md rounded-md shadow-md p-4 w-full md:w-3/4 lg:w-1/2 xl:w-1/3 border border-gray-300">
                <h1 className="text-3xl font-bold mb-4 text-center">Register</h1>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="w-full sm:w-1/2">
                            <label className="text-lg font-bold mb-1" htmlFor="SignUp-Name">Name:</label>
                            <input type='text' name="name" onChange={SignUpChange} className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none focus:border-blue-500" placeholder="Name" autoComplete='off' required />
                            {Ack ? (<span className='text-red-500 text-sm'>{Errmsg.name}</span>) : (<span className='text-red-500 text-sm'>{Errmsg.name}</span>)}
                        </div>
                        <div className="w-full sm:w-1/2">
                        <label className="text-lg font-bold mb-1" htmlFor="SignUp-Email">Email Address:</label>
                            <input type="email" name='email' onChange={SignUpChange} className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none focus:border-blue-500" placeholder='Email Address' required autoComplete='off' />
                            {Ack ? (<span className='text-red-500 text-sm'>{Errmsg.email}</span>) : (<span className='text-red-500 text-sm'>{Errmsg.email}</span>)}
                        </div>
                    </div>


                    <div className="flex flex-col sm:flex-row gap-2">
    <div className="w-full sm:w-1/2">
        <label className="text-lg font-bold mb-1" htmlFor="SignUp-Password">Password:</label>
        <input type="password" name='password' onChange={SignUpChange} className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none focus:border-blue-500" placeholder='Password' autoComplete='off' required />
        {Ack ? (<span className='text-red-500 text-sm'>{Errmsg.password}</span>) : (<span className='text-red-500 text-sm'>{Errmsg.password}</span>)}
    </div>

    <div className="w-full sm:w-1/2">
        <label className="text-lg font-bold mb-1" htmlFor="SignUp-ConfirmPassword">Confirm Password:</label>
        <input type="password" name='confirmpassword' onChange={SignUpChange} className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none focus:border-blue-500" placeholder='Confirm Password' autoComplete='off' required />
        {Ack ? (<span className='text-red-500 text-sm'>{Errmsg.confirmpassword}</span>) : (<span className='text-red-500 text-sm'>{Errmsg.confirmpassword}</span>)}
    </div>
</div>

<div className="flex flex-col sm:flex-row gap-2">
    <div className="w-full sm:w-1/2">
        <label className="text-lg font-bold mb-1" htmlFor="SignUp-Phone">Contact No:</label>
        <input type='number' name="phone" onChange={SignUpChange} minLength={10} maxLength={10} className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none focus:border-blue-500" placeholder='Phone Number' autoComplete='off' required />
        {Ack ? (<span className='text-red-500 text-sm'>{Errmsg.phone}</span>) : (<span className='text-red-500 text-sm'>{Errmsg.phone}</span>)}
    </div>

    <div className="w-full sm:w-1/2">
        <label className="text-lg font-bold mb-1" htmlFor="SignUp-Location">Location:</label>
        <input type="text" name="location" onChange={SignUpChange} className="w-full border border-gray-400 rounded-md px-3 py-2 outline-none focus:border-blue-500" placeholder='City Location' autoComplete='off' required />
        {Ack ? (<span className='text-red-500 text-sm'>{Errmsg.location}</span>) : (<span className='text-red-500 text-sm'>{Errmsg.location}</span>)}
    </div>
</div>

                    <div className="mt-4 flex flex-col items-center">
                        <button className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md w-auto self-center transition-colors duration-300" onClick={ValidateForm}>Sign Up</button>
                        <p className="mt-2 text-gray-600">Already have an account? <Link className="font-bold text-blue-500 hover:underline" to="/">Login</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp;