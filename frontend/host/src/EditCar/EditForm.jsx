//React
import axios from "../api/axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Modules
import Loading from "../Loading/Loading";


const EditForm=(props)=>
{
    const {Updatepopup,Setpop}=props
    const user=useSelector((state)=>state.user)
    const [formdetails, Setform] = useState({
        sid: `${user.sid}`,
        car_no: props.data.car_no,
        img: props.data.img, 
        name: props.data.name,
        year: props.data.year,
        fuel: props.data.fuel,
        make:props.data.make,
        model: props.data.model,
        type:props.data.type,
        price: props.data.price,
        location: props.data.location,
        list_start: props.data.list_start,
        list_drop: props.data.list_drop,
    });  
    const [MinDate,SetMinDate]=useState()
    const [loading,Setloading]=useState(true)
    const [Errmsg,SetErrmsg]=useState({price:'',location:''})
    const [Ack,SetAck]=useState(false)
    
    const Navigate=useNavigate()

    const ValidateForm=()=>
    {
        if(formdetails.price==="" || formdetails.price===null)
        {
            SetErrmsg((prev)=>{return({...prev,price:"Enter the car price/Day"})})
            SetAck(true)
        }
        else
        {
            SetErrmsg((prev)=>{return({...prev,price:""})})
            SetAck(false)
        }
        if(formdetails.location==="" || formdetails.location==null)
        {
            SetErrmsg((prev)=>{return({...prev,location:"Location of car"})})
            SetAck(true)
        }
        else
        {
            SetErrmsg((prev)=>{return({...prev,location:""})})
            SetAck(false)
        }
        if(formdetails.price!="" && formdetails.price!=null && formdetails.location!="" && formdetails.location!=null)
        {
            CarFormSubmit()
        }
    }

    const CarFormSubmit=async()=>
    {
        await axios.put("/EditCarDetails",formdetails)
        Updatepopup(); 
    }
    
     const CarDetails=(e)=>
    {
        const {name,value}=e.target;
        Setform({...formdetails,[name]:value.trim()})
    }

    const FindMinDate=()=>
    {
        let date=new Date().getDate()
        let month=new Date().getMonth()+1
        let year=new Date().getFullYear()
        let formattedMonth = month < 10 ? `0${month}` : month;
        let formattedDay = date < 10 ? `0${date}` : date;
        let day = `${year}-${formattedMonth}-${formattedDay}`;
        SetMinDate(day);
    }

    useEffect(()=>{
            FindMinDate()
    },[])


    useEffect(()=>{
        if(user.isAuth)
        {
            Setloading(false)
        }
        else
        {
            Navigate("/")
        }
    },[])

    const Back=()=>
    {
        Setpop(false)
    }
      
    if(loading)
    {
        return <Loading/>
    }

    return(
    <div className="bg-gray-800 w-full h-full flex flex-col">
        <div className="bg-gray-900 text-white text-center w-full py-2">
            <h1 className="text-2xl font-bold">Edit Car Details</h1>
        </div>
        <div className="w-full p-4 bg-gray-800 text-center flex flex-col">
            <div className="bg-white shadow-md rounded-md w-full md:w-3/4 lg:w-1/2 xl:w-1/3 mx-auto p-4 flex flex-col">
                <div className="flex flex-col md:flex-row mb-4">
                    <div className="w-full md:w-1/2 pr-2 mb-2 md:mb-0">
                        <label className="block text-lg font-bold mb-1" htmlFor="">Car Number:</label>
                        <input type="text" value={formdetails.car_no} className="border-2 border-gray-300 rounded-md px-3 py-2 w-full"  name="car_no" onChange={CarDetails}  readOnly/>
                    </div>
                    <div className="w-full md:w-1/2 pl-2">
                        <label className="block text-lg font-bold mb-1" htmlFor="EditCar-Name">Name:</label>
                        <input type="text" value={formdetails.name} name="name" className="border-2 border-gray-300 rounded-md px-3 py-2 w-full" onChange={CarDetails} autoComplete="off" readOnly/>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-lg font-bold mb-1"  htmlFor="EditCar-Fuel">Fuel:</label>
                            <input type="text" value={formdetails.fuel} name="fuel" className="border-2 border-gray-300 rounded-md px-3 py-2 w-full" onChange={CarDetails} readOnly/>
                        </div>

                        <div>
                            <label className="block text-lg font-bold mb-1" htmlFor="EditCar-Make">Make:</label>
                            <input type="text" value={formdetails.make} name="make" className="border-2 border-gray-300 rounded-md px-3 py-2 w-full" onChange={CarDetails} readOnly/>
                        </div>
                        
                        <div>
                            <label className="block text-lg font-bold mb-1" htmlFor="EditCar-Model">Model:</label>
                            <input type="text" value={formdetails.model} name="model" className="border-2 border-gray-300 rounded-md px-3 py-2 w-full" onChange={CarDetails} readOnly/>
                        </div>

                        <div>
                            <label className="block text-lg font-bold mb-1" htmlFor="EditCar-Type">Type:</label>
                            <input type="text" value={formdetails.type} name="type" className="border-2 border-gray-300 rounded-md px-3 py-2 w-full" onChange={CarDetails} readOnly/>
                        </div>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                        <label className="block text-lg font-bold mb-1" htmlFor="EditCar-Year">Year:</label>
                        <input type="number" value={formdetails.year} name="year" className="border-2 border-gray-300 rounded-md px-3 py-2 w-full" onChange={CarDetails} readOnly/>
                    </div>
                    <div>
                        <label className="block text-lg font-bold mb-1" htmlFor="EditCar-Price">Price/Day:</label>
                        <input type="number" value={formdetails.price} name="price" onChange={CarDetails} className="border-2 border-gray-300 rounded-md px-3 py-2 w-full" placeholder="Price/Day" autoComplete="off" />
                        {Ack?(<span className="text-red-500 text-sm">{Errmsg.price}</span>):(<span className="text-red-500 text-sm">{Errmsg.price}</span>)}
                    </div>
                    <div>
                        <label className="block text-lg font-bold mb-1" htmlFor="EditCar-Location">Location:</label>
                        <input type="text" value={formdetails.location} name="location" onChange={CarDetails} className="border-2 border-gray-300 rounded-md px-3 py-2 w-full" placeholder="Car Location" autoComplete="off"/>
                        {Ack?(<span className="text-red-500 text-sm">{Errmsg.location}</span>):(<span className="text-red-500 text-sm">{Errmsg.location}</span>)}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row mb-4">
                    <div className="w-full md:w-1/2 pr-2 mb-2 md:mb-0">
                        <label className="block text-lg font-bold mb-1" htmlFor="EditCar-liststart">List Start:</label>
                        <input type="date" value={formdetails.list_start} min={MinDate} name="list_start" className="border-2 border-gray-300 rounded-md px-3 py-2 w-full"  onChange={CarDetails} />
                    </div>
                    <div className="w-full md:w-1/2 pl-2">
                        <label className="block text-lg font-bold mb-1" htmlFor="EditCar-listdrop">List Drop:</label>
                        <input type="date" value={formdetails.list_drop} min={MinDate} name="list_drop" className="border-2 border-gray-300 rounded-md px-3 py-2 w-full" onChange={CarDetails} />
                    </div>
                </div>

                <div className="flex justify-center items-center mt-4">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md mr-4" onClick={ValidateForm}>Update</button> 
                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md" onClick={Back} >Back</button>
                </div>
            </div>
        </div>
    </div>
)
}

export default EditForm;