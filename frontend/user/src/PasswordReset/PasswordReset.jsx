import { useState } from 'react'
import axios from '../api/axios'
import { useNavigate ,useLocation} from 'react-router-dom'

//firebase
import auth from '../config/firebase'
import { confirmPasswordReset } from 'firebase/auth'


const PasswordReset=()=>
{

    const [FormData,SetFormData]=useState({Email:'',Password:'',ConfirmPassword:''})
    const [Ack,SetAck]=useState(false)
    const [Errmsg,SetErrmsg]=useState({Email:'',Password:'',ConfirmPassword:''})
    const location =useLocation()
    
    const Navigate=useNavigate()

    const FormChange=(e)=>
    {
        const {name,value}=e.target
        SetFormData((prev)=>{return({...prev,[name]:value.trim()})})
    }

    const ResetPassword=async()=>
    {
        const {data}=await axios.post('/forgotPassword',FormData)
        if(data.action)
        {
            const query=new URLSearchParams(location.search)
            const oobCode=query.get('oobCode')
            await confirmPasswordReset(auth,oobCode,FormData.Password)
            Navigate('/Login')

        }
        else
        {
            alert('Enter valid details')
        }
    }

    const ValidateForm=()=>
    {
        
        if(FormData.Email==='')
        {
            SetErrmsg((prev)=>{return({...prev,Email:'Enter your Email'})})
            SetAck(true)        
        }
        else if(!FormData.Email.includes('@gmail.com'))
        {
            SetErrmsg((prev)=>{return({...prev,Email:'Enter a valid email'})})
            SetAck(true)
        }
        else 
        {
            SetErrmsg((prev)=>{return({...prev,Email:''})})
            SetAck(false)
        }
        
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

        if(FormData.Email!=='' && FormData.Email.includes('@gmail.com') && FormData.Password!=="" && FormData.Password.length>=6 && FormData.ConfirmPassword!=="" && FormData.Password===FormData.ConfirmPassword)
        {
            ResetPassword()
        }
    }


    return(
        <div className="h-screen w-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('../Images/BG/BG.avif')" }}>

        <div className="flex flex-col items-center justify-center h-full w-full px-5">

            <div className="bg-white bg-opacity-85 backdrop-blur-md rounded-md border border-gray-300 shadow-md w-full md:w-1/2 lg:w-1/3  p-4">
                <h1 className="text-center text-2xl font-bold mb-4">Reset Password</h1>
                
                <div className="w-full p-3">
                    <div className="mb-4">
                        <label className="block font-bold mb-2">Email Address:</label>
                        <input type="email" name="Email" onChange={FormChange} placeholder="Email Address" autoComplete='off' required className="w-full px-3 py-2 border border-gray-900 outline-none focus:border-blue-500 rounded-sm text-base"/>
                        {Ack && <span className="text-red-500 text-sm mt-2">{Errmsg.Email}</span>}
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-2">Password:</label>
                        <input type="password" name="Password" onChange={FormChange} placeholder="Password" autoComplete='off' required className="w-full px-3 py-2 border border-gray-900 outline-none focus:border-blue-500 rounded-sm text-base"/>
                        {Ack && <span className="text-red-500 text-sm mt-2">{Errmsg.Password}</span>}
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-2">Confirm Password:</label>
                        <input type="password" name="ConfirmPassword" onChange={FormChange} placeholder="Confirm Password" autoComplete='off' required className="w-full px-3 py-2 border border-gray-900 outline-none focus:border-blue-500 rounded-sm text-base"/>
                        {Ack && <span className="text-red-500 text-sm mt-2">{Errmsg.ConfirmPassword}</span>}
                    </div>

                </div>
                <div className="flex flex-col items-center">
                    <button onClick={ValidateForm} className="bg-gray-800 text-white hover:bg-gray-900 transition-colors duration-300 w-1/2 md:w-1/3 lg:w-1/4 px-4 py-2 rounded-md">Reset Password</button>
                </div>
            </div>

        </div>

    </div>
    )
}

export default PasswordReset