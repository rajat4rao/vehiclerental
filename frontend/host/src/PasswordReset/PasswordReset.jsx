//React 
import { useState } from 'react'
import axios from "../api/axios"
import { useNavigate, useLocation } from 'react-router-dom'
import {  notification,ConfigProvider } from 'antd';

//Firebase
// import auth from '../config/firebase'
// import { confirmPasswordReset } from 'firebase/auth'


const PasswordReset = () => {
    const [FormData, SetFormData] = useState({ Email: '', Password: '', ConfirmPassword: '' })
    const [Ack, SetAck] = useState(false)
    const [Errmsg, SetErrmsg] = useState({ Email: '', Password: '', ConfirmPassword: '' })
    const [api, contextHolder] = notification.useNotification();
    const location = useLocation()

    const Navigate = useNavigate()

    const FormChange = (e) => {
        const { name, value } = e.target
        SetFormData((prev) => { return ({ ...prev, [name]: value.trim() }) })
    }

    const openNotification = () => {
        api.success({
          message: `Password Changed`,
          duration:2,
          style: {
              background:"#5cb85c	",
            }
        });
      };

    const ResetPassword=async()=>
    {
        const query=new URLSearchParams(location.search)
        const token=query.get('token')
        FormData.token = token
        const {data}=await axios.post('/forgotPassword',FormData )
        if(data.action)
        {
            openNotification()
            setTimeout(() => {
                Navigate('/')
            }, 2000);
            

        }
        else
        {
            alert('Enter valid details')
        }
    }

    const ValidateForm=()=>
    {
        
        if(FormData.Password==='')
        {
            SetErrmsg((prev)=>{return({...prev,Password:'Enter your new password'})})
            SetAck(true)        
        }
        else if(FormData.Password.length<6)
        {
            SetErrmsg((prev)=>{return({...prev,Password:'Password must contain minimum of 6 length'})})
            SetAck(true)
        }
        else 
        {
            SetErrmsg((prev)=>{return({...prev,Password:''})})
            SetAck(false)
        }
        
        if(FormData.ConfirmPassword==='')
        {
            SetErrmsg((prev)=>{return({...prev,ConfirmPassword:'Enter your new password to confirm'})})
            SetAck(true)        
        }
        else if(FormData.ConfirmPassword!==FormData.Password)
        {
            SetErrmsg((prev)=>{return({...prev,ConfirmPassword:'Password doesnt match'})})
            SetAck(true)
        }
        else 
        {
            SetErrmsg((prev)=>{return({...prev,ConfirmPassword:''})})
            SetAck(false)
        }

        if( FormData.Password!=="" && FormData.Password.length>=6 && FormData.ConfirmPassword!=="" && FormData.Password===FormData.ConfirmPassword)
        {
            ResetPassword()
        }
    }

    return (
        <div className="w-full h-screen bg-cover bg-center bg-no-repeat" >
            <div className="w-full md:w-1/2 lg:w-1/3 h-[95%] mx-auto my-auto p-4 bg-white bg-opacity-85 backdrop-blur-md rounded-lg shadow-md border border-gray-300">
                <h1 className="text-3xl font-bold text-center mb-4">Reset Password</h1>
                <div className="p-4">

                    <div className="mb-4">
    <label htmlFor="Password" className="block font-bold mb-2">Password:</label>
    <input
        type="password"
        id="Password"
        name="Password"
        onChange={FormChange}
        placeholder="Password"
        autoComplete="off"
        required
        className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {Ack ? (<span className="text-red-500 block mt-1">{Errmsg.Password}</span>) : null}
</div>
<div className="mb-4">
    <label htmlFor="ConfirmPassword" className="block font-bold mb-2">Confirm Password:</label>
    <input
        type="password"
        id="ConfirmPassword"
        name="ConfirmPassword"
        onChange={FormChange}
        placeholder="Confirm Password"
        autoComplete="off"
        required
        className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {Ack ? (<span className="text-red-500 block mt-1">{Errmsg.ConfirmPassword}</span>) : null}
</div>
                </div>
                <div className="flex justify-center mt-8">
                    <button onClick={ValidateForm} className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300">
                        Reset Password
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PasswordReset