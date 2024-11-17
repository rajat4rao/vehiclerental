//React
import axios from "../api/axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//Module
import CheckBooking from "./CheckBooking";
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import Loading from "../Loading/Loading";


//Antd-Framework
import { EnvironmentOutlined, CarOutlined, CalendarFilled, StarFilled } from '@ant-design/icons'
import { Empty, Modal, notification, ConfigProvider } from "antd";

//CustomSVGIcons
import { FuelIcon, GearIcon } from "../SVGIcons/SvgComponent";

//Images
import ViewBookingImg from '../Images/ViewBookingImg.jpg'

const ViewBooking = () => {
    const user = useSelector((state) => state.user)
    const [loading, SetLoading] = useState(true)
    const [ActiveCars, SetActiveCars] = useState([])
    const [SingleCar, SetSingleCar] = useState({ bookingDetails: '' })
    const [Active, SetActive] = useState(true)
    const [Upcoming, SetUpcoming] = useState(false)
    const [CancelCar, SetCancelCar] = useState(false)
    const [api, contextHolder] = notification.useNotification();

    const Navigate = useNavigate()

    const openNotification = (message) => {
        message.includes("Customer")
            ? api.success({
                message: message,
                placement: "topRight",
                duration: 3,
                style: {
                    background: "#5cb85c",
                },
            })
            : api.error({
                message: message,
                placement: "topRight",
                duration: 3,
                style: {
                    background: "rgb(223, 67, 67)",
                },
            });
    };


    const getActiveBookings = async (sid) => {
        const { data } = await axios.post("/ActiveBookings", { sid })
        const newdata = await CheckBooking(data, "Active")
        SetActiveCars((prev) => newdata)
        SetUpcoming(false)
        SetActive(true)
        SetLoading(false)
    }

    const getPastBookings=async(sid)=>
    {
        const {data}=await axios.post("/PastBookings",{sid})
        SetActiveCars((prev)=>data)
        SetUpcoming(false)
        SetActive(false)
    }

    const getUpcomingBookings=async(sid)=>
    {
        const {data}=await axios.post("/ActiveBookings",{sid})
        const newdata=await CheckBooking(data,"Upcoming")
        SetActiveCars((prev)=>newdata)
        SetUpcoming(true)
        SetActive(false)

    }

    useEffect(() => {
        if (user.isAuth) {
            getActiveBookings(user.sid);
        } else {
            Navigate("/")
        }
    }, [])


    const CancelTrip = async () => {
      const {data}=await axios.post('/CancelTrip',SingleCar.bookingDetails)
        if(data.action)
        {
            openNotification(data.status)
            getUpcomingBookings(user.sid)
        }
        else
        {
            openNotification(data.status)
        }
        SetCancelCar(false)
    }

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorText: "white",
                        colorSuccess: "white",
                        colorError: "white"
                    },
                }}>
                {contextHolder}
            </ConfigProvider>

            <Modal centered open={CancelCar} okText="Cancel the trip" cancelText="Back to Safety" onOk={CancelTrip} onCancel={() => { SetCancelCar(false) }} okButtonProps={{ style: { color: 'white', backgroundColor: '#E74C3C', }, }} cancelButtonProps={{ style: { color: 'white', backgroundColor: '#333', }, }}>
                <div className="ViewBookings-CancelModal">
                    <img src={ViewBookingImg} alt="BackToSafety" />
                    <h2>Are you sure you're ready?</h2>
                    <p>Repeated cancellations may result in a loss of trust from our customers and could discourage future bookings.</p>
                </div>
            </Modal>

            <div className="flex">
                <Navbar />
                <div className="w-full md:w-4/5 lg:w-3/4 xl:w-5/6 px-4 py-8 overflow-y-auto max-h-[120vh] ml-[20%] md:ml-[15%]"> {/* Main Content Area */}
                    <div className="flex justify-center space-x-4">
                        <button className={`transform -skew-x-15 text-white px-4 py-2 transition-colors duration-300 ${Active ? 'bg-blue-500 hover:bg-blue-700' : 'bg-gray-400'}`} onClick={() => { getActiveBookings(user.sid) }}>Active</button>
                        <button className={`transform -skew-x-15 text-white px-4 py-2 transition-colors duration-300 ${!Active && !Upcoming ? 'bg-red-500 hover:bg-red-700' : 'bg-gray-400'}`} onClick={() => getPastBookings(user.sid)}>Past</button>
                        <button className={`transform -skew-x-15 text-white px-4 py-2 transition-colors duration-300 ${Upcoming ? 'bg-green-500 hover:bg-green-700' : 'bg-gray-400'}`} onClick={() => { getUpcomingBookings(user.sid) }}>Upcoming</button>
                    </div>

                    {ActiveCars.length ? (
                        <div className="mt-8 space-y-8"> {/* Card Container */}
                           {ActiveCars.map((data) => (
                            <div className="bg-white rounded-md shadow-md p-6 flex flex-col md:flex-row" key={data._id}> {/* Card */}
                                <div className={`mb-4 md:mb-0 md:mr-6 w-full md:w-2/5 ${Active ? 'bg-green-500' : Upcoming ? 'bg-blue-500' : 'bg-red-500'} text-white px-4 py-2 rounded-md flex items-center justify-center`}>
                                   <StarFilled className="mr-2 text-lg" /> {Active ? 'Active' : Upcoming ? 'Upcoming' : 'Past'}
                               </div>

                               <div className="w-full md:w-3/5 flex flex-col">
                                <div className="flex flex-col">
                                        <img src={data.cardetails.imageUrls} alt="CarImage" className="w-full h-auto rounded-md shadow-md mb-4"/>
                                        <h2 className="text-xl font-bold uppercase mb-2">{data.cardetails.make} {data.cardetails.name} {data.cardetails.year}</h2>

                                        
                                        <div className="flex flex-wrap justify-between mb-2">
                                          <div className="flex items-center">
                                            <FuelIcon width='22px' height='22px' className="mr-2" /> Fuel: <span>{data.cardetails.fuel}</span>
                                          </div>
                                          <div className="flex items-center">
                                            <CarOutlined className="text-lg mr-2"/> Model: <span>{data.cardetails.model}</span>
                                          </div>
                                          <div className="flex items-center">
                                            <GearIcon width='20px' height='20px' className="mr-2"/> Type: <span>{data.cardetails.type}</span>
                                          </div>
                                        </div>

                                        
                                        <div className="flex flex-wrap justify-between mb-2">
                                          <div className="flex items-center">
                                            <CalendarFilled className="mr-2"/> Start date: <span>{data.bookingDetails.start_date.split('-')[2]}-{data.bookingDetails.start_date.split('-')[1]}-{data.bookingDetails.start_date.split('-')[0]}</span>
                                          </div>
                                          <div className="flex items-center">
                                            <CalendarFilled className="mr-2"/> Drop date: <span>{data.bookingDetails.drop_date.split('-')[2]}-{data.bookingDetails.drop_date.split('-')[1]}-{data.bookingDetails.drop_date.split('-')[0]}</span>
                                          </div>
                                        </div>

                                        
                                          <div className="flex flex-wrap justify-between mb-2">
                                            <p className="font-bold">Vehicle Number: <span>{data.bookingDetails.car_no}</span></p>
                                            <div className="flex items-center"><EnvironmentOutlined className="mr-1 text-lg"/>Location:<span className="ml-1">{data.cardetails.location}</span></div>
                                            <p className="font-bold">Amount: <span>₹{data.bookingDetails.amount}</span></p>
                                          </div>


                                    {/* User Details Section */}
                                    <div className="mb-2">
                                      <b className="block">User Details:</b>
                                      <div className="flex flex-wrap justify-between">
                                        <p className="font-bold">Name: <span>{data.userdetails.name}</span></p>
                                        <p className="font-bold">Contact No: <span>{data.userdetails.phone}</span></p>
                                      </div>
                                    </div>

                                    {Upcoming ? (
                                        <button className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md mt-4 self-center transition-colors duration-300" onClick={() => { SetSingleCar(data), SetCancelCar(true) }}>Cancel</button>
                                    ) : (<></>)}
                                </div>
                              </div>
                            </div>
                           ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[85vh] overflow-hidden mt-16">
                            <Empty />
                            <ul className="list-disc text-gray-600 mt-4">
                                <li>No cars available at the moment.</li>
                                <li>Try improving the car specs.</li>
                                <li>Try reducing the price.</li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ViewBooking;