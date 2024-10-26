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
            api.success(
                {
                    message:'Email sent',
                    placement:"topRight",
                    duration:2,
                    style: {
                        background:"#5cb85c	",
                      }
                }
            )
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
        <div className='h-screen w-screen flex justify-center items-center bg-cover bg-center bg-no-repeat' style={{backgroundImage: "url('../Images/ForgotImage.avif')"}}>
          <ConfigProvider 
            theme={{
                token: {
                    colorText:"white",
                    colorSuccess:"white",
                    colorError:"white"
                },
                components: {Notification: {zIndexPopup:99999	  },}
              }}>
                {contextHolder}
            </ConfigProvider>

            <div className="bg-white bg-opacity-88 backdrop-blur-2xl rounded-md shadow-md w-1/2 md:w-1/3 lg:w-1/4 p-4 flex flex-col justify-center items-center">
                <h1 className='text-2xl font-bold mb-2'>Forgot your password</h1>
                <p className='text-gray-600 mb-4 text-center'>Enter the email address you'd like our password reset information sent to</p>
                <div className='w-full p-2'>
                    <label className='block font-bold mb-1'>Email Address</label>
                    <input type="email" name="email" onChange={EmailChange} placeholder="Email Address" autoComplete='off' required className='w-full p-2 border-2 border-black outline-none focus:outline-none focus:border-blue-500' />
                    {Ack && <span className='text-red-500 block mt-1'>{Errmsg}</span>}
                </div>
                <div className='flex flex-col items-center mt-4'>
                    <button onClick={ValidateForm} className='bg-gray-800 text-white hover:bg-gray-900 w-1/2 py-2 transition-colors duration-300'>Request a reset Link</button>
                    <Link className='text-purple-700 font-bold mt-2 hover:underline' to="/" onClick={()=>{SetPasswordReset(false)}} >Back To Login</Link>
                </div>
            </div>
        </div>
    )
}
export default ForgotPassword;