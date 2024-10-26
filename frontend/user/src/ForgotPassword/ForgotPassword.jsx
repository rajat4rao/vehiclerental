//React 
import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

//Firebase
import auth from '../config/firebase'
import { sendPasswordResetEmail } from 'firebase/auth';

//Antd-Framework
import {  notification,ConfigProvider } from 'antd';

const ForgotPassword=(props)=>
{
    const {SetPasswordReset}=props
    const [Email,SetEmail]=useState('')
    const [Ack,SetAck]=useState(false)
    const [Errmsg,SetErrmsg]=useState('')
    const [api, contextHolder] = notification.useNotification();
    const currentURL = window.location.origin;

    const openNotification = () => {
      api.success({
        message: `Email sent`,
        duration:2,
        style: {
            background:"#5cb85c	",
          }
      });
    };

    const PasswordResetLink=async()=>
    {
        await sendPasswordResetEmail(auth,Email,{url:currentURL}).then(()=>{
            openNotification()
            setTimeout(() => {
                SetPasswordReset(false)
            }, 2000);
        })
        .catch((err)=>{console.log(err)})
    
    }

    const ValidateForm=()=>
    {

        if(Email==="")
        {
            SetErrmsg("Enter your email address")
            SetAck(true)
        }
        else if(!Email.includes("@gmail.com"))
        {
            SetErrmsg("Enter a valid email")
            SetAck(true)
        }
        else
        {
            SetAck(false)
            PasswordResetLink()
        }
    }

    const EmailChange=(e)=>
    {
        const {name,value}=e.target
        SetEmail(value.trim())
    }

    return(
        <div className='w-full p-5'>
        <ConfigProvider
            theme={{ components: {Notification: {zIndexPopup:99999	  },}, token: {
            colorText:"white",
            colorSuccess:"white",
            colorError:"white"
        },}}>          
            {contextHolder}
        </ConfigProvider>

            <div className="w-full md:w-1/2 lg:w-1/3 mx-auto rounded-md bg-gray-100 shadow-md p-4">
                <h1 className='text-2xl font-bold mb-2'>Forgot your password</h1>
                <p className='text-gray-600 mb-4'>Enter the email address you'd like our password reset information sent to </p>
                <div className='w-full p-2 flex flex-col'>
                    <label className='font-bold mb-1'>Email Address</label>
                    <input type="email" name="email" onChange={EmailChange} placeholder="Email Address" autoComplete='off' required className='w-full p-2 border border-black focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-sm text-base' />
                    {Ack?(<span className='text-red-500 mt-1'>{Errmsg}</span>):(<span></span>)}
                </div>
                <div className='flex flex-col items-center mt-4'>
                    <button onClick={ValidateForm} className='bg-gray-800 text-white hover:bg-gray-700 transition duration-300 cursor-pointer w-1/2 md:w-1/3 lg:w-1/4 p-2 rounded-md'>Request a reset Link</button>
                    <Link className='text-purple-600 font-bold mt-2 hover:underline cursor-pointer' to="/Login" onClick={()=>{SetPasswordReset(false)}} >Back To Login</Link>
                </div>
            </div>
        </div>
    )
}
export default ForgotPassword;