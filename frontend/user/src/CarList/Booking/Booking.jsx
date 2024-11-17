//React
import axios from "../../api/axios"
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import React from 'react';

//Antd-Framework
import { Avatar, Rate, Modal, ConfigProvider, Carousel, Empty } from 'antd';
import { LeftCircleFilled, InfoCircleFilled, RightOutlined } from '@ant-design/icons';

//CustomSVGIcon
import { FareSummaryIcon } from "../../SVGIcons/SvgComponent";

//Slice
import { FillOutCarNumber } from "../../Slice/CarSLice"


//Module
import BookingBanner from "../BookingBanner/BookingBanner";
import Amount from "../../Amount/Amount";

//Firebase
// import { storage } from '../../config/firebase'
// import { getDownloadURL, listAll, ref } from "firebase/storage";

//Images
import UserIcon from '../../Images//UserIcon/userIcon.png'

const Booking = (props) => {
    const { data, SetBookAuth, Bookdata, Find, ApplyFilter, FilterDetails, selectedCars, Setpricevalue } = props
    const [cars, Setcar] = useState(data)
    const [Description, SetDescription] = useState()
    const [amount, SetTotalamount] = useState()
    const [FetchReview, SetFetchReview] = useState(false)
    const [isDesc, SetDesc] = useState(true)
    const [Reviews, SetReviews] = useState([])
    const [isnotempty, Setnotempty] = useState(false)
    const [Images, SetCarImages] = useState([])

    const [ShowSingleReview, SetShowSingleReview] = useState(false)
    const [SingleReviewData, SetSingleReviewData] = useState({})

    const DescriptionRef = useRef()
    const SpecificationsRef = useRef()
    const ReviewsRef = useRef()

    const filterslice = useSelector((state) => state.FilterDetails)
    const Selectedcars = useSelector((state) => state.SelectedCars)

    const dispatch = useDispatch()

    const Navigate = useNavigate()

    const Payment = (car_no, sid) => {
        sessionStorage.setItem('sid', sid)
        sessionStorage.setItem("car_no", car_no)
        sessionStorage.setItem("start_date", Bookdata.start_date)
        sessionStorage.setItem("drop_date", Bookdata.drop_date)
        Navigate("/Pay")
    }

    const Back = async () => {
        dispatch(FillOutCarNumber())
        if (filterslice.FilterAuth) {
            FilterDetails.location = filterslice.location;
            FilterDetails.Fuel = filterslice.Fuel
            FilterDetails.Make = filterslice.Make
            FilterDetails.Model = filterslice.Model
            FilterDetails.Type = filterslice.Type
            FilterDetails.price = filterslice.price
            FilterDetails.ratings = filterslice.ratings
            FilterDetails.start_date = filterslice.start_date
            FilterDetails.drop_date = filterslice.drop_date

            selectedCars.location = Selectedcars.location;
            selectedCars.Fuel = Selectedcars.Fuel;
            selectedCars.Make = Selectedcars.Make;
            selectedCars.Model = Selectedcars.Model;
            selectedCars.Type = Selectedcars.Type;
            if (filterslice.price.length > 0) {
                Setpricevalue(filterslice.price)
            }
            ApplyFilter()
        }
        else {
            Find()
        }
        SetBookAuth(false)
    }

    const getReviews = async (car_no) => {
        const { data } = await axios.post('/findReviews', { car_no })
        if (data.length > 0) {
            SetReviews(data)
            Setnotempty(true)
        }
        else {
            Setnotempty(false)
        }
        SetFetchReview(true)
    }

    const getDescription = async (car_no) => {
        const { data } = await axios.post('/findDescription', { car_no });
        SetDescription(data.description)
    }

    const getCarImages = async (sid, car_no) => {
        const { data } = await axios.post('/getCarImages', { car_no, sid })
        SetCarImages(data)
    }

    useEffect(() => {
        let amt = Amount(Bookdata.start_date, Bookdata.drop_date, data.price)
        SetTotalamount(amt.amt)
        HandleDescriptionClick()
        getDescription(cars.car_no)
        getCarImages(cars.sid, cars.car_no)
    }, [])

    const HandleDescriptionClick = () => {
        SetFetchReview(false);
        SetDesc(true);
        getDescription(cars.car_no)
        DescriptionRef.current.classList.add("border-b-4", "border-orange-500")
        SpecificationsRef.current.classList.remove("border-b-4", "border-orange-500")

        ReviewsRef.current.classList.remove("border-b-4", "border-orange-500")

    }

    const HandleSpecificationClick = () => {
        SetDesc(false);
        SetFetchReview(false)
        SpecificationsRef.current.classList.add("border-b-4", "border-orange-500")

        DescriptionRef.current.classList.remove("border-b-4", "border-orange-500")
        ReviewsRef.current.classList.remove("border-b-4", "border-orange-500")

    }


    const HandleReviewClick = () => {
        SetDesc(false);
        SetFetchReview(true)
        ReviewsRef.current.classList.add("border-b-4", "border-orange-500")
        DescriptionRef.current.classList.remove("border-b-4", "border-orange-500")
        SpecificationsRef.current.classList.remove("border-b-4", "border-orange-500")
        getReviews(cars.car_no)
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <BookingBanner Name={cars.name} img={cars.img} Back={Back} />
            <div className="flex flex-row justify-evenly p-4">
                <div className="w-1/2 p-2">
                    <div className="flex flex-row items-center bg-gray-200 p-2 shadow-md mb-4">
                        <button className="mr-2" onClick={Back}><LeftCircleFilled style={{ color: '#0d1128', fontSize: "24px" }} /></button>
                        <h1 className="text-2xl font-bold">{cars.name}</h1>
                    </div>
                    <div className="shadow-lg rounded-lg overflow-hidden mb-4">
                        <Carousel autoplay dots draggable autoplaySpeed={3000}>
                            {Images.map((data, index) => (
                                <div key={index}>
                                    <img src={data} alt={`Car ${index}`} className="w-full h-96 object-cover" />
                                </div>
                            ))}
                        </Carousel>
                    </div>

                    <div className="flex flex-row bg-gray-200 shadow-md p-2 mb-4">
                        <div ref={DescriptionRef} onClick={HandleDescriptionClick} className="w-1/3 text-center cursor-pointer font-bold">Description</div>
                        <div ref={SpecificationsRef} onClick={HandleSpecificationClick} className="w-1/3 text-center cursor-pointer font-bold">Specifications</div>
                        <div ref={ReviewsRef} onClick={HandleReviewClick} className="w-1/3 text-center cursor-pointer font-bold">Reviews</div>
                    </div>

                    <div className="p-4">
                        {FetchReview ? (<>
                            {isnotempty ? (
                                <div className="flex flex-row overflow-x-auto snap-x shadow-md bg-white rounded-lg">
                                    {Reviews.map((data) => {
                                        return (
                                            <div className="w-96  snap-center shrink-0 p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200" key={data._id} onClick={() => { SetShowSingleReview(true), SetSingleReviewData(data) }}>
                                                <div className="flex flex-row items-center mb-2">
                                                    <Avatar
                                                        size={65}
                                                        alt='Profile'
                                                        src={UserIcon}
                                                    />
                                                    <p className="ml-2 font-bold">
                                                        {data.name}
                                                    </p>
                                                    <b className="ml-auto">
                                                        <RightOutlined />
                                                    </b>
                                                </div>
                                                <div className="mb-2">
                                                    <Rate disabled value={parseFloat(data.car_rating)} allowHalf={true} />
                                                </div>
                                                <div>
                                                    <p>{data.car_review.slice(0, 110)} {data.car_review.length > 110 ? ("...") : ("")} </p>
                                                </div>
                                            </div>
                                        )
                                    })}

                                </div>) : (<div className="flex justify-center items-center bg-white rounded shadow h-96">
                                    <Empty className="PRESENTED_IMAGE_DEFAULT" imageStyle={{ height: 100 }} description={
                                        <span>
                                            <h1>No Reviews</h1>
                                        </span>
                                    }>
                                    </Empty>
                                </div>)}</>)
                            : (<>{isDesc ? (<div className="bg-white shadow-md p-4 rounded-lg"><p>{Description}</p><a href="/Terms&Conditions" target="__blank" className="text-blue-700 underline hover:text-blue-900"><InfoCircleFilled style={{ color: "#551A8B" }} /> Terms & Conditions</a></div>)
                                : (
                                    <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                        <div className="flex flex-row">
                                            <div className="w-1/2 p-4">
                                                <div className="mb-2"><b>Make:</b> {cars.make}</div>
                                                <div className="mb-2"><b>Stock Status:</b> In Stock</div>
                                                <div className="mb-2"><b>Model:</b> {cars.model}</div>
                                                <div className="mb-2"><b>Type:</b> {cars.type}</div>
                                                <div className="mb-2"><b>Fuel:</b> {cars.fuel}</div>
                                            </div>
                                            <div className="w-1/2 p-4">
                                                <div className="mb-2"><b>Made Year:</b> {cars.year}</div>
                                                <div className="mb-2"><b>Price:</b> ₹{cars.price}</div>
                                                <div className="mb-2"><b>Price Type:</b> Fixed</div>
                                                <div className="mb-2"><b>Condition:</b> Excellent</div>
                                                <div className="mb-2"><b>Average Rating:</b> {cars.ratings}</div>
                                            </div>
                                        </div>

                                    </div>)}</>)}

                    </div>
                </div>
                <div className="w-1/4 p-2">
                    <div className="bg-white p-4 shadow-lg rounded-lg mb-4">
                        <button className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 w-full text-lg font-bold"><strong>₹ {cars.price}</strong>/per day</button>
                    </div>
                    <div className="bg-white flex flex-row shadow-md rounded-lg p-4 mb-4 text-lg">
                        <div className="w-1/2 pr-2">
                            <b>From</b>
                            <p>{Bookdata.start_date.split('-')[2]}-{Bookdata.start_date.split('-')[1]}-{Bookdata.start_date.split('-')[0]} 00:00AM </p>
                            <p>{cars.location}</p>
                        </div>
                        <div className="w-1/2 pl-2">
                            <b>To</b>
                            <p>{Bookdata.drop_date.split('-')[2]}-{Bookdata.drop_date.split('-')[1]}-{Bookdata.drop_date.split('-')[0]} 11:59PM </p>
                            <p>{cars.location}</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-4">
                        <p className="mb-2">Please Review the final amount</p>
                        <div className="flex items-center justify-between mb-4">
                            <b className="text-xl">₹ {amount}</b>
                            <div className="flex items-center"><FareSummaryIcon className="mr-1 w-5 h-5" /> Fare Summary</div>
                        </div>
                        <button onClick={() => { Payment(cars.car_no, cars.sid) }} className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 w-full cursor-pointer">PROCEED TO PAY</button>
                    </div>
                </div>

            </div>
            <ConfigProvider
                theme={{
                    token: {
                        colorBgMask: "rgba(0, 0, 0, 0.80)",
                        zIndexPopupBase: "9999",
                        colorIcon: "white",
                        colorIconHover: "white",
                        padding: 0,
                        paddingLG: 0,
                        paddingContentHorizontalLG: 0,
                        paddingMD: 0,
                        paddingSM: 0,
                        paddingXL: 0,
                    },
                }}
            >
                <Modal footer={null} centered open={ShowSingleReview} okText={"Extend"} cancelText={"Cancel"} onOk={() => { SetShowSingleReview(false) }} onCancel={() => { SetShowSingleReview(false) }}>
                    <div className="p-4 bg-white rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4 text-center bg-gray-800 text-white p-2 rounded">Ratings & Reviews</h2>
                        <div className="flex flex-row items-center mb-2">
                            <Avatar
                                size={65}
                                alt='Profile'
                                src={UserIcon}
                            />
                            <p className="ml-2 font-bold">
                                {SingleReviewData.name}
                            </p>

                        </div>
                        <div className="mb-2">
                            <Rate disabled value={parseFloat(SingleReviewData.car_rating)} allowHalf={true} />
                        </div>
                        <div>
                            <p>{SingleReviewData.car_review}</p>
                        </div>
                    </div>
                </Modal>
            </ConfigProvider>
        </div>
    )

}

export default Booking