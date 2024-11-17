import axios from "../api/axios";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom"; 

import CheckBooking from "./CheckBooking";
import Navbar from "../Navbar/Navbar";
import Footer from "../Home/Footer/Footer";
import Loading from "../Loading/Loading";
import Amount from '../Amount/Amount'

import { ConfigProvider, Empty, notification, Modal, Select, QRCode } from 'antd';
import { CalendarFilled, StarFilled } from '@ant-design/icons';

import { FareSummaryIcon, ProfileCancelIcon } from '../SVGIcons/SvgComponent'
import { CarIcon, FuelIcon, GearIcon } from '../SVGIcons/SvgComponent'

const ViewBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user)
    const [loading, SetLoading] = useState(true)
    const [ActiveCars, SetActivecars] = useState([])
    const [BookingsCounts, SetBookingsCounts] = useState({ Active: '', Past: '', Upcoming: '' })
    const [Active, SetActive] = useState(true)
    const [Upcoming, SetUpcoming] = useState(false)
    const [Extend, SetExtend] = useState(false)
    const [confirm, Setconfirm] = useState(false)
    const [ViewMore, SetViewMore] = useState(false)
    const [singlecar, Setsinglecar] = useState({})
    const [fullsingledetails, Setfullsingle] = useState({})

    const [Reason, SetReason] = useState()
    const [NewAmount, SetNewAmount] = useState({ drop_date: '', amt: 0 })
    const [Paybtn, SetPaybtn] = useState(true)

    const ActiveNavbar = useRef(null)
    const PastNavbar = useRef(null)
    const UpcomingNavbar = useRef(null)

    const Navigate = useNavigate()
    const CancellationReasons = [
        {
            value: 'Change in plans or itinerary',
            label: 'Change in plans or itinerary',
        },
        {
            value: 'Emergent personal or family matters',
            label: 'Emergent personal or family matters',
        },
        {
            value: 'Unexpected work commitments',
            label: 'Unexpected work commitments',
        },
        {
            value: 'Weather or road conditions concerns',
            label: 'Weather or road conditions concerns',
        },
        {
            value: 'Financial constraints or budget adjustments',
            label: 'Financial constraints or budget adjustments',
        },
    ];

    const [api, contextHolder] = notification.useNotification();

    const getActiveBookings = async (uid) => {
        const { data } = await axios.post("/ActiveBookings", { uid })
        const newdata = await CheckBooking(data, "Active")

        if (Extend) {
            api.success({
                message: 'Successfully Extended',
                description: 'Your Trip has been extended ',
                duration: 5,
                style: {
                    background: "#5cb85c",
                }
            });
        }

        SetActive(true)
        SetUpcoming(false)
        SetActivecars((prev) => newdata)

        SetLoading(false)

    }

    const getPastBookings = async (uid) => {
        const { data } = await axios.post("/PastBookings", { uid })
        SetActive(false)
        SetUpcoming(false)
        SetActivecars((prev) => data)
        PastNavbar.current.style.backgroundColor = '#fd5f00'
        ActiveNavbar.current.style.backgroundColor = '#222'
        UpcomingNavbar.current.style.backgroundColor = '#222'

    }

    const getUpcomingBookings = async (uid) => {
        const { data } = await axios.post("/ActiveBookings", { uid })

        const newdata = await CheckBooking(data, "Upcoming")
        if (Upcoming && confirm) {
            api.success({
                message: 'Successfully Canceled',
                description: 'Your Trip has been cancel ',
                duration: 5,
                style: {
                    background: "#5cb85c",
                }

            });
        }

        SetUpcoming(true)
        SetActive(false)
        SetActivecars((prev) => newdata)
        UpcomingNavbar.current.style.backgroundColor = '#fd5f00'
        ActiveNavbar.current.style.backgroundColor = '#222'
        PastNavbar.current.style.backgroundColor = '#222'
    }

    const getBookingsCount = async (uid) => {
        const cntdata = await axios.post('/findBookingsCount', { uid })
        const { data } = await axios.post("/ActiveBookings", { uid })
        const newdata = await CheckBooking(data, "Active")
        SetBookingsCounts((prev) => { return ({ ...prev, Active: newdata.length, Past: cntdata.data.pastcnt.length, Upcoming: Math.abs(cntdata.data.Activebookingcount - newdata.length) }) })
    }

    const openNotification = (message) => {
        api.success({
            message: message ? message : 'Notification Title',
            description:
                'This is the content of the notification.',
            duration: 2
        });
    };

    useEffect(() => {
        if (user.isAuth) {
            getActiveBookings(user.uid)
            getBookingsCount(user.uid)
        }
        else {
            Navigate("/")
        }
    }, [])

    useEffect(() => {

        const searchParams = new URLSearchParams(location.search);
        const stateParam = searchParams.get("state");

        if (stateParam === "upcoming") {
            SetUpcoming(true);
            getUpcomingBookings(user.uid); 
        } else {
            SetActive(true);  
            getActiveBookings(user.uid); 
        }

    }, [location.search, user.uid]); 

    useEffect(() => {
        if (ActiveNavbar.current && PastNavbar.current && UpcomingNavbar.current) {
            if (Active) {
                ActiveNavbar.current.style.backgroundColor = '#fd5f00';
                PastNavbar.current.style.backgroundColor = '#222';
                UpcomingNavbar.current.style.backgroundColor = '#222';
            } else if (Upcoming) { 
                UpcomingNavbar.current.style.backgroundColor = '#fd5f00';
                ActiveNavbar.current.style.backgroundColor = '#222';
                PastNavbar.current.style.backgroundColor = '#222';
            } else { 
                PastNavbar.current.style.backgroundColor = '#fd5f00';
                ActiveNavbar.current.style.backgroundColor = '#222';
                UpcomingNavbar.current.style.backgroundColor = '#222';
            }
        }
    }, [Active, Upcoming, ActiveNavbar, PastNavbar, UpcomingNavbar]);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const stateParam = searchParams.get("state");
        const prevPath = searchParams.get("prevPath"); 

        if (stateParam === "upcoming" && prevPath === "/Pay") { 
            openNotification('Payment Successful,Car booked Successfully');

            navigate("/ViewBooking"); 

        }

    }, [location.search, navigate, user.uid, openNotification]);

    const EndTrip = async (status) => {
        if (status) {
            const { data } = await axios.post('/EndTrip', singlecar)
            if (data.action) {
                sessionStorage.setItem('Review_car_no', singlecar.car_no)
                getActiveBookings(user.uid)
                Navigate('/ReviewForm')

            } else {
                alert('something went wrong')
            }
            getBookingsCount(user.uid)
            Setconfirm(false)

        } else {
            Setconfirm(false)
        }
    }

    const CancelTrip = async (status) => {
        if (status) {
            if (Reason !== '' && Reason !== null && Reason !== undefined) {
                const { data } = await axios.post('/CancelTrip', { singlecar, Reason })
                if (data.action) {
                    getUpcomingBookings(user.uid)
                } else {
                    alert('something went wrong')
                }
                getBookingsCount(user.uid)
                SetReason()

            } else {
                api.error({
                    message: 'Choose your reason',
                    placement: "topRight",
                    duration: 3,
                    style: {
                        background: "rgb(223, 67, 67)",
                    }
                })
            }
        }
        Setconfirm(false)

    }

    const DateChange = (e) => {
        const { name, value } = e.target
        Setsinglecar({ ...singlecar, [name]: value })
        let amt = Amount(NewAmount.drop_date, e.target.value, singlecar.price)
        let newamt = Number(amt.amt) - singlecar.price
        SetNewAmount((prev) => { return ({ ...prev, amt: newamt }) })

    }

    const ExtendTrip = async () => {
        const { data } = await axios.put('/ExtendTrip', { singlecar: singlecar })
        if (data.action) {
            getActiveBookings(user.uid)
        } else {
            alert('something went wron')
        }
        SetPaybtn(true)
        SetExtend(false)

    }

    const PayExtendAmount = () => {
        SetPaybtn(false)
        var newamt = Number(singlecar.amount) + NewAmount.amt

        Setsinglecar((prev) => {
            return (
                {
                    ...prev, amount: newamt
                }
            )
        })
    }

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-row h-screen w-screen min-h-screen">

                <ConfigProvider
                    theme={{
                        components: { Notification: { zIndexPopup: 99999 } }, token: {
                            colorText: "white",
                            colorSuccess: "white",
                            colorError: "white"

                        },
                    }}>
                    {contextHolder}
                </ConfigProvider>

                <div className="w-1/5 border-r-2 border-r-rebeccapurple p-2 flex flex-col items-center">
                    <div className="bg-white w-1/2 mt-10 rounded-md text-center shadow-[rgba(0,0,0,0.24)_0px_3px_8px]">
                        <h3 className="bg-[#4eA34e] text-white m-0 p-1 rounded-t-md">Active Bookings</h3>
                        <h2 className="py-2">{BookingsCounts.Active}</h2>
                    </div>
                    <div className="bg-white w-1/2 mt-10 rounded-md text-center shadow-[rgba(0,0,0,0.24)_0px_3px_8px]">
                        <h3 className="bg-[#b31c1c] text-white m-0 p-1 rounded-t-md">Past Bookings</h3>
                        <h2 className="py-2">{BookingsCounts.Past}</h2>
                    </div>
                    <div className="bg-white w-1/2 mt-10 rounded-md text-center shadow-[rgba(0,0,0,0.24)_0px_3px_8px]">
                        <h3 className="bg-[#059292] text-white m-0 p-1 rounded-t-md">Upcoming Bookings</h3>
                        <h2 className="py-2">{BookingsCounts.Upcoming}</h2>
                    </div>
                </div>

                <div className="w-4/5 flex flex-col overflow-y-auto pb-2">
                    {!Extend && (
                        <div className="w-full p-4 flex flex-row justify-center">
                            <button ref={ActiveNavbar} onClick={() => { getActiveBookings(user.uid) }} className={`text-white border-none w-[10%] px-3 py-2 cursor-pointer transform -skew-x-20 transition-colors duration-500 ${Active ? 'bg-[#fd5f00]' : 'bg-[#222] hover:bg-black'}`}>Active</button>
                            <button ref={PastNavbar} onClick={() => getPastBookings(user.uid)} className={`text-white border-none w-[10%] px-3 py-2 ml-4 cursor-pointer transform -skew-x-20 transition-colors duration-500 ${!Active && !Upcoming? 'bg-[#fd5f00]' : 'bg-[#222] hover:bg-black'}`}>Past</button>
                            <button ref={UpcomingNavbar} onClick={() => { getUpcomingBookings(user.uid) }} className={`text-white border-none w-[10%] px-3 py-2 ml-4 cursor-pointer transform -skew-x-20 transition-colors duration-500 ${Upcoming ? 'bg-[#fd5f00]' : 'bg-[#222] hover:bg-black'}`}>Upcoming</button>
                        </div>
                    )}

                    <Modal
                        title={Active ? "Conclude the journey ?" : "Cancel the Trip ?"}
                        centered
                        open={confirm}
                        okText={Active ? "Complete my Trip" : "Cancel my Trip"}
                        cancelText={Active ? "Close" : Upcoming ? "Close" : ""}
                        onOk={() => (Active ? EndTrip(true) : Upcoming && CancelTrip(true))}
                        onCancel={() => (Active ? EndTrip(false) : Upcoming && CancelTrip(false))}
                        okButtonProps={{
                            style: {
                                color: 'white',
                                backgroundColor: '#333',
                            },
                        }}
                        cancelButtonProps={{
                            style: {
                                color: 'white',
                                backgroundColor: '#333',
                            },
                        }}
                    >
                        {Active ? (
                            <q>Congratulations on completing the journey! Your resilience turned miles into memories, and each stop brought you closer to your destination. Now, as you park the car, remember: Every finish line is the beginning of a new adventure.</q>

                        ) : (
                            <div>
                                <q> I'm sorry to hear your plans changed, but remember, the road will always be there, waiting for your next adventure.</q>
                                <div className="mt-4 text-lg">
                                    <b>Reason:</b>
                                    <Select
                                        placeholder='Choose your Reason'
                                        value={Reason}
                                        options={CancellationReasons}
                                        onChange={(value) => { SetReason(value) }}
                                        style={{
                                            width: 300,
                                            margin: '1rem'
                                        }}
                                    />

                                </div>
                            </div>
                        )}
                    </Modal>

                    <Modal centered open={ViewMore} footer={null} closeIcon={false} width={1000} >
                        <div className="flex flex-row p-2">
                            <div className="w-1/2 p-2 shadow-[rgba(50,50,93,0.25)_0px_4px_10px_2px] rounded-md">
                                {ViewMore && <img src={fullsingledetails.cardetails.imageUrls} alt="CarImage" className="w-full h-full shadow-[0_0_10px_3px_rgba(0,0,0,0.1)] rounded-md" />}
                            </div>

                            <div className="w-1/2 ml-4 flex flex-col">
                                <div className="bg-white p-4 shadow-[rgba(50,50,93,0.25)_0px_4px_10px_2px,_rgba(0,0,0,0.3)_0px_3px_7px_1px] rounded-md">
                                    <h3 className="m-0">Car Details:</h3>
                                    <div className="mt-2 text-base">
                                        <b>Name: </b><span>{ViewMore ? (<>{fullsingledetails.cardetails.name}</>) : ("")}</span>
                                    </div>
                                    <div className="mt-1 text-base">
                                        <b>Make: </b><span>{ViewMore ? (<>{fullsingledetails.cardetails.make}</>) : ("")}</span>
                                    </div>
                                    <div className="mt-1 text-base">
                                        <b>Model: </b><span>{ViewMore ? (<>{fullsingledetails.cardetails.model}</>) : ("")}</span>
                                    </div>
                                    <div className="mt-1 text-base">
                                        <b>Type: </b><span>{ViewMore ? (<>{fullsingledetails.cardetails.type}</>) : ("")}</span>
                                    </div>
                                    <div className="mt-1 text-base">
                                        <b>Fuel: </b><span>{ViewMore ? (<>{fullsingledetails.cardetails.fuel}</>) : ("")}</span>
                                    </div>
                                    <div className="mt-1 text-base">
                                        <b>Year: </b><span>{ViewMore ? (<>{fullsingledetails.cardetails.year}</>) : ("")}</span>
                                    </div>
                                    <div className="mt-1 text-base">
                                        <b>Total Fair: </b><span>{ViewMore ? (<>₹{fullsingledetails.bookingDetails.amount}</>) : ("")}</span>
                                    </div>
                                </div>

                                <div className="bg-white mt-4 p-4 shadow-[rgba(50,50,93,0.25)_0px_4px_10px_2px,_rgba(0,0,0,0.3)_0px_3px_7px_1px] rounded-md">
                                    <div>
                                        <h3 className="m-0">Host Details:</h3>
                                        <div className="mt-2 text-base">
                                            <b >Name: </b><span>{ViewMore ? (<>{fullsingledetails.sellerdetails.name}</>) : ("")}</span>
                                        </div>
                                        <div className="mt-1 text-base">
                                            <b>Contact No: </b><span>{ViewMore ? (<>{fullsingledetails.sellerdetails.phone}</>) : ("")}</span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h3 className="m-0">Booking Details:</h3>
                                        <div className="mt-2 text-base">
                                            <b>Pick Up: </b><span>{ViewMore ? (<><div>{fullsingledetails.bookingDetails.start_date.split('-')[2]}-{fullsingledetails.bookingDetails.start_date.split('-')[1]}-{fullsingledetails.bookingDetails.start_date.split('-')[0]}</div></>) : ("")}</span>
                                        </div>
                                        <div className="mt-1 text-base">
                                            <b>Drop off: </b><span>{ViewMore ? (<><div>{fullsingledetails.bookingDetails.drop_date.split('-')[2]}-{fullsingledetails.bookingDetails.drop_date.split('-')[1]}-{fullsingledetails.bookingDetails.drop_date.split('-')[0]}</div></>) : ("")}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => { SetViewMore(false) }} className="bg-[#333] hover:bg-[#111] text-white px-4 py-2 rounded-md transition-colors duration-500">Viewless</button>
                        </div>
                    </Modal>

                    {ActiveCars.length ? (
                        <div className="p-1 flex flex-wrap justify-evenly">
                            {Extend ? (
                                <div className="bg-white shadow-[rgba(0,0,0,0.24)_0px_3px_8px] w-full mx-6 flex flex-col mt-4">
                                    <div className="bg-[#333] text-white p-3 flex items-center">
                                        <button onClick={() => { SetExtend(false); }} className="bg-transparent border-none cursor-pointer">
                                            <ProfileCancelIcon width='30px' height='30px' />
                                        </button>
                                        <h2 className="m-auto text-xl">Continue your journey ..!</h2>
                                    </div>
                                    <div className="flex flex-row items-center justify-center h-full">
                                        <div className="border-r-[1px] border-r-[#222] w-1/2">
                                            <div className="p-4 pl-10 mt-4 flex flex-col w-full">
                                                <b className="text-lg mb-2">Pick up </b>
                                                <input type="date" value={singlecar.start_date} readOnly className="w-1/2 p-2 mx-10" />
                                            </div>
                                            <div className="p-4 pl-10 mt-4 flex flex-col w-full">
                                                <b className="text-lg mb-2">Drop off</b>
                                                                              <input type="date" name="drop_date" min={NewAmount.drop_date} value={singlecar.drop_date} onChange={DateChange} readOnly={Paybtn ? false : true} className="w-1/2 p-2 mx-10" />
                                            </div>
                                            <div className="p-4 pl-10 mt-4 flex flex-col w-full">
                                                <button className="bg-[#333] text-white w-1/2 h-[10vh] p-4 mx-10 flex items-center text-lg"><FareSummaryIcon /> Total fair:{Paybtn ? (<> ₹{singlecar.amount} + ₹{NewAmount.amt}</>) : (`${NewAmount.amt}`)} </button>
                                            </div>
                                        </div>
                                        <div className="w-1/2 h-[60vh] flex flex-col justify-center items-center">
                                            <button onClick={Paybtn ? PayExtendAmount : ExtendTrip} className="bg-[#df4343] hover:bg-[#a52f2f] text-white border-none rounded-md px-4 py-2 mt-4 transition-colors duration-500">{Paybtn ? ("Pay now") : ("Extend my Trip")}</button>

                                        </div>
                                    </div>

                                </div>
                            ) : (
                                ActiveCars.map((data) => {
                                    return (
                                        <div className="bg-white w-[80%] m-2 p-1 flex flex-row shadow-[0_0_10px_3px_rgba(0,0,0,0.1)] rounded-md" key={data._id} >
                                            <div className="w-1/2 p-4 bg-white">
                                                <img src={data.cardetails.imageUrls} alt="" className="w-full h-full" />
                                            </div>
                                            <div className="w-1/2 p-4 bg-white flex flex-col">
                                                <div className="text-xl">
                                                    {Active ? (
                                                        <button className="bg-[#c7f3c7] px-2 py-1 rounded-md"><StarFilled style={{ color: '#333' }} /> Ontrip</button>
                                                    ) : Upcoming ? (
                                                        <button className="bg-[#4cc9c9] px-2 py-1 rounded-md"><StarFilled style={{ color: '#333' }} /> Upcoming</button>

                                                    ) : (
                                                        <button className="bg-[#f9bfbf] px-2 py-1 rounded-md"><StarFilled style={{ color: '#333' }} /> Past trip</button>
                                                    )}
                                                    <b className="block mt-2">{data.cardetails.make} {data.cardetails.name}</b>
                                                </div>
                                                <div className="flex flex-row mt-2">
                                                    <div className="w-full mr-2">
                                                        <b className="flex items-center"><CalendarFilled /> Pick-Up:</b>
                                                        <p className="ml-2 mt-1">{data.bookingDetails.start_date.split('-')[2]}-{data.bookingDetails.start_date.split('-')[1]}-{data.bookingDetails.start_date.split('-')[0]}</p>
                                                    </div>
                                                    <div className="w-full">
                                                        <b className="flex items-center"><CalendarFilled /> Drop-off:</b>
                                                        <p className="ml-2 mt-1">{data.bookingDetails.drop_date.split('-')[2]}-{data.bookingDetails.drop_date.split('-')[1]}-{data.bookingDetails.drop_date.split('-')[0]}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row mt-2">
                                                    <div className="w-full mr-2">
                                                        <b className="flex items-center"><FuelIcon width='20px' height='20px' />Fuel:</b>
                                                        <p className="ml-2 mt-1">{data.cardetails.fuel}</p>
                                                    </div>
                                                    <div className="w-full mr-2">
                                                        <b className="flex items-center"><CarIcon width='20px' height='20px' />Model:</b>
                                                        <p className="ml-2 mt-1">{data.cardetails.model}</p>
                                                    </div>
                                                    <div className="w-full mr-2">
                                                        <b className="flex items-center"><GearIcon width='20px' height='15px' />Type:</b>
                                                        <p className="ml-2 mt-1">{data.cardetails.type}</p>
                                                    </div>
                                                    <div className="w-full">
                                                        <b>Total fair:</b>
                                                        <span className="ml-2 mt-1"><b>₹</b>{data.bookingDetails.amount}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row justify-center mt-4">
                                                    {Active ? (
                                                        <>
                                                            <button className="bg-blue-700 hover:bg-blue-900 text-white px-4 py-2 rounded-md mr-4 transition-colors duration-500" onClick={() => { SetExtend(true), Setsinglecar({ ...data.bookingDetails, price: data.cardetails.price }), SetNewAmount({ amt: 0, drop_date: data.bookingDetails.drop_date }) }}>Extend my Trip</button>
                                                            <button className="bg-[#df4343] hover:bg-[#b31c1c] text-white px-4 py-2 rounded-md mr-4 transition-colors duration-500" onClick={() => { Setconfirm(true), Setsinglecar(data.bookingDetails) }}>End my Trip</button>
                                                        </>
                                                    ) : Upcoming ? (
                                                        <button className="bg-[#df4343] hover:bg-[#b31c1c] text-white px-4 py-2 rounded-md mr-4 transition-colors duration-500" onClick={() => { Setconfirm(true), Setsinglecar(data.bookingDetails) }}>Cancel my Trip</button>

                                                    ) : null}
                                                    <button className="bg-[#333] hover:bg-[#111] text-white px-4 py-2 rounded-md transition-colors duration-500" onClick={() => { SetViewMore(true), Setfullsingle(data) }}>View More</button>
                                                </div>
                                            </div>

                                        </div>
                                    )
                                }))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-[60vh] w-full"> <Empty /></div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    )
}
export default ViewBooking;