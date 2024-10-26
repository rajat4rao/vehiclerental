//React
import axios from '../api/axios'
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../components/PaymentForm';

//Slice
import { FillOutCarNumber } from "../Slice/CarSLice";

//modules
import Amount from "../Amount/Amount";
import Loading from '../Loading/Loading'


//CustomSVGIcons
import { LocationIcon,TimeIcon ,PaypalIcon, VisaIcon,ProfileTickIcon,RupeeIcon} from "../SVGIcons/SvgComponent";

//Antd-Framework
import { CalendarFilled ,InfoCircleFilled,CarFilled,UserOutlined,LeftCircleFilled} from '@ant-design/icons';
import { notification,ConfigProvider,Steps,Breadcrumb, Divider   } from "antd";


//Images
import PayImage from '../Images/Pay/PayImage.jpg'


const stripePromise = loadStripe('pk_test_51PCjs3SCl0WxXCb7LAOLQngEDNzHyzocCge4xT8tqcrtvgPtX1HUp21HBnN6QeqcYjDORq8ufLg7utDnrTDFaBeo00c7szlwXp'); // Your publishable test key


const Pay=()=>
{
    const user=useSelector((state)=>state.user)

    const [loading,Setloading]=useState(true)
    const [singlecardetails,Setsinglecar]=useState({})
    const [Payformdata,SetPayForm]=useState({uid:user.uid,Card_number:'',CVV:'',expiry_date:'',Coupon:'',Biller_name:'',start_date:sessionStorage.getItem('start_date'),drop_date:sessionStorage.getItem('drop_date'),car_no:sessionStorage.getItem('car_no'),amount:'',sid:sessionStorage.getItem('sid')})
    const [Errmsg,SetErrmsg]=useState({Card_number:'',CVV:'',expiry_date:'',Biller_name:''})
    const [Ack,SetAck]=useState(false)
    const [MinDate,SetMinDate]=useState()
    const [PaymentMethod,SetPaymentMethod]=useState("VISA")
    const[amount,Setamount]=useState()
 
    const Duration=useRef()
    const Visa=useRef();
    const Gpay=useRef();
    const Paypal=useRef()

    const Navigate=useNavigate()
    const dispatch=useDispatch()
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (message) => {
        message.includes('Succesfully')?(   api.success({
            message: message,
            placement:"topRight",
            duration:6,
            style: {
                background:"#5cb85c	",
              }
          })):(
            api.error({
                message: message,
                placement:"topRight",
                duration:3,
                style: {
                    background:"rgb(223, 67, 67)",
                  }
              })
          )
    };

const getCarDetails=async()=>
{
    
    const car_no=sessionStorage.getItem("car_no")
    const start_date=sessionStorage.getItem("start_date")
    const drop_date=sessionStorage.getItem("drop_date")
    
    const {data}=await axios.post("/findsinglecar",{car_no})
    Setsinglecar(data)
    Setsinglecar((prev)=>{
        return(
            {...prev,start_date:start_date,drop_date:drop_date}
        )
    })

    let amt= Amount(start_date,drop_date,data.price)
    if(amt.duration===1)
    {
        Duration.current="1 Day"
    }
    else
    {
        Duration.current=`${amt.duration} Days`
    }
    Setamount(amt.amt)
    Setloading(false)
}

const MiniDate=()=>
{
    let date=new Date().getDate()
    let month=new Date().getMonth()+1
    let year=new Date().getFullYear()
    let formattedMonth = month < 10 ? `0${month}` : month;
    let formattedDay = date < 10 ? `0${date}` : date;
  
    let day = `${year}-${formattedMonth}-${formattedDay}`;
    SetMinDate(day);
}

const CardType=(type)=>
{   
    if(type==='VISA')
    {
        Visa.current.classList.add('border-red-500')
        Gpay.current.classList.remove('border-red-500')
        Paypal.current.classList.remove('border-red-500')
    }
    else if(type==='Gpay')
    {
        Gpay.current.classList.add('border-red-500')
        Visa.current.classList.remove('border-red-500')
        Paypal.current.classList.remove('border-red-500')
    }
    else if(type==="PayPal")
    {
        Paypal.current.classList.add('border-red-500')
        Visa.current.classList.remove('border-red-500')
        Gpay.current.classList.remove('border-red-500')
    }
    SetErrmsg({Card_number:'',CVV:'',expiry_date:'',Biller_name:''})
}

    useEffect(()=>
    {
        if(user.isAuth && sessionStorage.getItem('car_no'))
        {
            getCarDetails();
            MiniDate()
        }
        else
        {
            if(!user.isAuth)
            {
                Navigate("/Login")
            }
            else
            {
                Navigate("/")
            }
        }
    },[])
    const BackToHome=()=>
    {
        Navigate('/')
    }
 

    const Close=()=>
    {
       Navigate("/") 
    }

    const PayChange=(e)=>
    {
        const {name,value}=e.target
        SetPayForm({...Payformdata,[name]:value.trim()})
    }

    const ValidateForm=()=>
    {

        if(Payformdata.Card_number==="" || Payformdata.Card_number===null)
        {
            SetErrmsg((prev)=>{return({...prev,Card_number:'Enter the Card number'})})
            SetAck(true)
        }
        else if(Payformdata.Card_number.length!=16)
        {
            SetErrmsg((prev)=>{return({...prev,Card_number:'Enter valid Card number'})})
            SetAck(true)
        }
        else
        {
            SetErrmsg((prev)=>{return({...prev,Card_number:''})})
            SetAck(false)

        }
        if(Payformdata.CVV==="" || Payformdata.CVV===null )
        {
            SetErrmsg((prev)=>{return({...prev,CVV:'Enter the CVV'})})
            SetAck(true)

        }
        else if(Payformdata.CVV.length!==3)
        {
            SetErrmsg((prev)=>{return({...prev,CVV:'Enter a valid CVV'})})
            SetAck(true)   
        }
        else
        {
            SetErrmsg((prev)=>{return({...prev,CVV:''})})
            SetAck(false)

        }
        if(Payformdata.expiry_date==="" || Payformdata.expiry_date===null)
        {
            SetErrmsg((prev)=>{return({...prev,expiry_date:'Enter the expiry date'})})
            SetAck(true)

        }
        else
        {
            SetErrmsg((prev)=>{return({...prev,expiry_date:''})})
            SetAck(false)

        }
        if(Payformdata.Biller_name==="" || Payformdata.Biller_name===null)
        {
            SetErrmsg((prev)=>{return({...prev,Biller_name:'Enter the card holder name'})})
            SetAck(true)

        }
        else
        {
            SetErrmsg((prev)=>{return({...prev,Biller_name:''})})
            SetAck(false)
        }

        if(Payformdata.Card_number!=="" && Payformdata.Card_number.length===16 && Payformdata.CVV!=="" && Payformdata.CVV.length===3 && Payformdata.Biller_name!=="" && Payformdata.expiry_date!=="")
        {
            Payformdata.amount=amount
            PaySubmit()
        }
    }

    const PaySubmit=async()=>
    {
        const {data}=await axios.post('/Pay',Payformdata)
        if(data.action)
        {
            sessionStorage.removeItem('car_no')
            dispatch(FillOutCarNumber())
            openNotification('Payment Succesfull,Car booked Succesfully')
            setTimeout(()=>{
                Navigate('/')
            },2000)
        }
        else
        {
            dispatch(FillOutCarNumber())
            sessionStorage.removeItem('car_no')
            alert(data.status)
            Navigate('/')
        }
    }

   


    const handleSuccess = (paymentIntent) => {
        console.log(paymentIntent);
        Setloading(true)
        const SubmitPayment = async() => {
            const {data} = await axios.post('/Payment',{
                paymentIntent
            })
            if(data.action)
            {
                sessionStorage.removeItem('car_no')
                dispatch(FillOutCarNumber())
                openNotification('Payment Successful,Car booked Successfully')
                setTimeout(()=>{
                    Navigate('/ViewBooking?state=upcoming')
                },7000)
            }
        }
        SubmitPayment();
    
    }


    if(loading)
    {
        return <Loading/>
    }
    return(
        <div className="bg-gray-100 w-full h-full flex flex-col">
            {contextHolder}
            <div className="bg-gray-800 p-2">
                <button onClick={Close}><LeftCircleFilled className="text-white text-4xl cursor-pointer" /></button>
            </div>
            <div className="bg-cover bg-center bg-no-repeat h-[60vh] w-full" style={{ backgroundImage: `url(${singlecardetails.img})` }}>
                <div className="bg-black/50 w-full h-full z-10 flex flex-col items-center pt-10">
                    <h2 className="text-white text-4xl md:text-5xl lg:text-6xl text-center mx-auto mb-4">Payment Details</h2>
                    <ConfigProvider
                         theme={{
                           components: {
                             Breadcrumb: {
                               separatorColor:'#fff',
                               itemColor:'#fff'	
                             },
                           },
                         }}
                    >
                        <Breadcrumb
                            items={[
                                {
                                  title:<p onClick={BackToHome}  className='BreadCrumbs-item cursor-pointer'>Home</p>,
                                    },
                                    {
                                      title: <p onClick={Close}  className='BreadCrumbs-item cursor-pointer'>Our Cars</p>,
                                    },
                                    {
                                        title: <p  onClick={Close} className='BreadCrumbs-item cursor-pointer'>{singlecardetails.name}</p>,
                                    },
                                    {
                                      title: <p  className='BreadCrumbs-item'>Payment Details</p>,
                                    },
                            ]}
                        />
                    </ConfigProvider>
                </div>
            </div>

           <div className="bg-white rounded-md shadow-md w-[94%] mx-auto p-4 flex items-center" data-aos='zoom-in' data-aos-duration='1000'>
           <Steps
           className='text-red-500'
           items={[
               {
                 title: 'Login',
                 status: 'finish',
                 icon:<UserOutlined className="text-gray-600 text-2xl" />
               },
               {
                 title: 'Choose Dates',
                 status: 'finish',
                 icon:<CalendarFilled className="text-gray-600 text-2xl"/>
               },
               {
                 title: 'Find your car',
                 status: 'finish',
                 icon:<CarFilled className="text-gray-600 text-2xl" />
               },
               {
                 title: 'Payment',
                 status: 'process',
                 icon:<RupeeIcon width='24' height='24' className='text-gray-600'/>
               },
             ]}
             />
           </div>
            
            <div className="flex flex-col md:flex-row justify-center items-start p-4 gap-4">

            <div className="shadow-md rounded-md w-full md:w-[45%] bg-white  data-aos='fade-up' data-aos-duration='1500'" >
                <div className="w-full p-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap justify-between">
                            <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
                                <b className="block"> Pick Up Location:</b>
                                <p className="flex items-center"><LocationIcon width='20' height='20'/><span className='ml-2'>{singlecardetails.location}</span></p>
                            </div>
                            <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
                                <b className="block">Pick Up Date:</b>
                                <p className="flex items-center"><CalendarFilled className="mr-2" /> {singlecardetails.start_date.split('-')[2]}-{singlecardetails.start_date.split('-')[1]}-{singlecardetails.start_date.split('-')[0]} </p>
                            </div>
                            <div className="w-full sm:w-1/3">
                                <b className="block">Time:</b>
                                <p className="flex items-center"><TimeIcon width='20' height='20' /><span className='ml-2'>00:00 AM</span></p>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-between">
                            <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
                                <b className="block"> Return Location:</b>
                                <p className="flex items-center"><LocationIcon width='20' height='20'/><span className='ml-2'>{singlecardetails.location}</span></p>
                            </div>
                            <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
                                <b className="block">Return Date:</b>
                                <p className="flex items-center"><CalendarFilled className="mr-2"  />{singlecardetails.drop_date.split('-')[2]}-{singlecardetails.drop_date.split('-')[1]}-{singlecardetails.drop_date.split('-')[0]} </p>
                            </div>
                            <div className="w-full sm:w-1/3">
                                <b className="block">  Time:</b>
                                <p className="flex items-center"><TimeIcon width='20' height='20' /> <span className='ml-2'>11:59 PM</span></p>
                            </div>
                        </div>
                        <div className="flex flex-wrap justify-between">
                            <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
                                <b className="block">Duration:</b>
                                <p>{Duration.current}</p>
                            </div>
                            <div className="w-full sm:w-1/3 mb-2 sm:mb-0">
                                <b className="block">Price/Day:</b>
                                <p><b>₹</b> {singlecardetails.price}</p>
                            </div>
                            <div className="w-full sm:w-1/3">
                                <b className="block">Subtotal:</b>
                                <p><b>₹</b> {amount}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t border-gray-200">
                    <h2 className="text-lg font-bold mb-2">Your Trip Includes:</h2>
                    <p className="flex items-center mb-1"><ProfileTickIcon width='20' height='20' className='mr-2'/> Registration Fee/Road Tax</p>
                    <p className="flex items-center mb-1"><ProfileTickIcon width='20' height='20' className='mr-2'/> Breakdown Assistance</p>
                    <p className="flex items-center mb-1"><ProfileTickIcon width='20' height='20' className='mr-2'/> Security Deposit</p>
                    <p className="flex items-center"><ProfileTickIcon width='20' height='20' className='mr-2'/> Fully Comphrensive Insurance</p>
                </div>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex flex-col items-center">
                        <h2 className="text-lg font-bold">{singlecardetails.name}-{singlecardetails.year}</h2>
                        <img src={singlecardetails.img} alt="CarImage" className='w-full h-auto' />
                    </div>
                </div>
            </div>
                 <div className="shadow-md rounded-md w-full md:w-[45%] bg-white data-aos='fade-up' data-aos-duration='1500'">
                    <div className="p-4">
                        <h2 className="text-lg font-bold">PAYMENT DETAILS</h2>
                    </div>
                    <div className="flex justify-center p-4 border-y border-gray-200">
                        <div className="border-2 border-transparent rounded-md p-2 cursor-pointer w-1/3 flex flex-col items-center justify-center hover:bg-red-500 hover:text-white" ref={Visa} onClick={()=>{SetPaymentMethod('VISA'); CardType("VISA")}}>
                        <VisaIcon width='50' height='50'  />
                        <p>Debit/Credit Cards</p>
                        </div>
                        <div className="border-2 border-transparent rounded-md p-2 cursor-pointer w-1/3 flex flex-col items-center justify-center hover:bg-red-500 hover:text-white" ref={Paypal}  onClick={()=>{SetPaymentMethod('UPI'); CardType("PayPal")}}>
                        <PaypalIcon width='50' height='50'/>
                        <p>PayPal</p>
                        </div>
                        <div className="border-2 border-transparent rounded-md p-2 cursor-pointer w-1/3 flex flex-col items-center justify-center hover:bg-red-500 hover:text-white" ref={Gpay} onClick={()=>{SetPaymentMethod('UPI');CardType("Gpay")}}>
                            <PaypalIcon width='50' height='50' />
                            <p>Gpay</p>
                        </div>
                    </div>
                {PaymentMethod==="VISA" && (
                    <>
                        <Divider/>
                        <Elements stripe={stripePromise}>
                            <div className="p-4 data-aos='fade-up' data-aos-duration='1500'">
                                <PaymentForm
                                    amount={amount * 100}
                                    carDetails={singlecardetails}
                                    bookingDetails={{ start_date: singlecardetails.start_date, drop_date: singlecardetails.drop_date }}
                                    uid={user.uid}
                                    sid={singlecardetails.sid}
                                    onSuccess={handleSuccess}
                                />
                            </div>
                        </Elements>
                    </>
                )}
                <div className="p-4 border-t border-gray-200 flex justify-center">
                       <img src={PayImage} alt="PayImage" className='w-full h-auto'/>
                    </div>
            </div>
            </div>

        </div>
    )
}

export default Pay;