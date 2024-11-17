//React
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

//Module 
import EditForm from "../EditCar/EditForm";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Loading from "../Loading/Loading";

//Antd-Framework
import { EnvironmentOutlined, CarOutlined, CalendarFilled, StarFilled, LeftOutlined } from '@ant-design/icons'
import { Empty, Modal, ConfigProvider, notification, Avatar, Rate } from "antd";

//CustomSVGIcons
import { FuelIcon, GearIcon } from "../SVGIcons/SvgComponent";

//Firebase
// import { storage1 } from '../UserConfig/firebase'
// import { ref, listAll, deleteObject } from "firebase/storage";

const MyCars = () => {
    const user = useSelector((state) => state.user)
    const [popup, Setpop] = useState(false)
    const [isdelete, Setdelete] = useState(false)
    const [singlecar, Setsinglecar] = useState({})
    const [Reviews, SetReviews] = useState(false)
    const [AllReviews, SetAllReviews] = useState([])
    const [ShowSingleReview, SetShowSingleReview] = useState(false)
    const [SingleReviewData, SetSingleReviewData] = useState({})
    const [loading, Setloading] = useState(true)
    const [isArray, SetArray] = useState(true)
    const [sellercarslist, Setsellercarlist] = useState([]);
    const [api, contextHolder] = notification.useNotification();

    const navigate = useNavigate()

    const openNotification = (message) => {
        message.includes('Car has been edited') || message.includes('Success') ? (
            api.success({
                message: message,
                placement: "topRight",
                duration: 3,
                style: {
                    background: "#5cb85c	",
                }
            })) : (
            api.error({
                message: message,
                placement: "topRight",
                duration: 3,
                style: {
                    background: "rgb(223, 67, 67)",
                }
            })
        )
    };

    const getCarDetails = async (sid) => {
        const { data } = await axios.post("/VerifiedCars", { sid })
        if (data.length > 0) {
            SetArray(true)
            Setsellercarlist(data)
        }
        else {
            SetArray(false)
        }
        Setloading(false)
    }

    useEffect(() => {
        if (user.isAuth) {
            getCarDetails(user.sid)
        }
        else {
            navigate("/")
        }
    }, [])

    const Updatepopup = async () => {
        openNotification('Car has been edited')
        getCarDetails(user.sid)
        Setpop(false)
    }

    const Edit = async (cardata) => {
        const { data } = await axios.put("/EditCarDetails", cardata)
        if (data.action) {
            Setsinglecar((prev) => { return ({ ...prev, cardata }) })
            Setpop(true)
        }
        else {
            openNotification(data.status)
        }
    }

    // async function deleteFolderContents(folderRef) {
    //     try {
    //         const folderRes = await listAll(folderRef);
    //         folderRes.items.forEach((itemRef) => {
    //             deleteObject(itemRef).then(() => {
    //             }).catch((error) => {
    //                 console.error('Error deleting item:', itemRef.fullPath, error);
    //             });
    //         });
    //         folderRes.prefixes.forEach((prefixRef) => {
    //             deleteFolderContents(prefixRef);
    //         });
    //     } catch (error) {
    //         console.error("Error deleting folder contents:", error);
    //     }
    // }

    const Delete = async () => {
        const { data } = await axios.delete("/DeleteCarDetail", {
            data: { car_no: singlecar.car_no }
        });
        if (data.action) {
            openNotification(data.status)
            getCarDetails(user.sid)
        }
        else {
            openNotification(data.status)
        }
        Setdelete(false);
    }



    const VerifiedCars = async (sid) => {
        const { data } = await axios.post("/VerifiedCars", { sid })
        if (data.length > 0) {
            SetArray(true)
            Setsellercarlist(data)
        }
        else {
            SetArray(false)
        }
    }

    const UnVerifiedCars = async (sid) => {
        const { data } = await axios.post("/UnVerifiedCars", { sid })
        if (data.length > 0) {
            SetArray(true)
            Setsellercarlist(data)
        }
        else {
            SetArray(false)
        }
    }

    const FindReviews = async (car_no) => {
        const { data } = await axios.post('/findReviews', { car_no })
        if (data.action) {
            SetAllReviews(data.reviews)
        }
        SetReviews(true)
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

            <Modal title="Remove my car" centered open={isdelete} okText="Remove my car" cancelText="Close" onOk={Delete} onCancel={() => { Setdelete(false) }} okButtonProps={{ style: { color: 'white', backgroundColor: '#333', }, }} cancelButtonProps={{ style: { color: 'white', backgroundColor: '#333', }, }}>
                <p>We appreciate you being part of our community! If you've decided to remove your car, thank you for sharing it with us. Feel free to come back anytime!</p>
            </Modal>

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
                    <div className="w-full">
                        <h2 className="text-center text-white bg-[#333] py-2">Ratings & Reviews</h2>
                        <div className="flex items-center px-2 py-1">
                            <Avatar
                                size={65}
                                alt='Profile'
                                src="https://cdn-icons-png.freepik.com/256/10302/10302971.png"
                            />
                            <p className="ml-2">
                                {SingleReviewData.name}
                            </p>
                        </div>
                        <div className="px-2 py-2">
                            <Rate disabled value={parseFloat(SingleReviewData.car_rating)} allowHalf={true} />
                        </div>
                        <div className="px-2 py-1">
                            <p>{SingleReviewData.car_review} </p>
                        </div>
                    </div>
                </Modal>
            </ConfigProvider>

            {popup ? (<>
                <EditForm data={singlecar} Updatepopup={Updatepopup} Setpop={Setpop} />
            </>) : (
                <>
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <div className="flex-grow flex-1 bg-gray-100 ml-[15%] md:ml-[20%] overflow-x-hidden">
                        {Reviews ? (
                            <>
                                {AllReviews.length > 0 ? (
                                    <div className="w-full">
                                        <div className="flex items-center bg-[#333] text-white py-2 px-4">
                                            <button onClick={() => { SetAllReviews([]), SetReviews(false) }} className="text-white hover:underline"><LeftOutlined style={{ fontSize: '20px' }} />Back</button>
                                            <h2 className="mx-auto">Ratings & Reviews</h2>
                                        </div>
                                        <div className="flex flex-wrap px-4 py-2 gap-4 w-full max-h-[calc(100vh-120px)] overflow-y-auto"> 
                                            {AllReviews.map((data) => (
                                                <div key={data._id} className="bg-white rounded-lg shadow-md w-[30%] p-2 transform hover:scale-105 transition-transform duration-500" onClick={() => { SetShowSingleReview(true), SetSingleReviewData(data) }}>
                                                    <div className="flex items-center py-1 px-1">
                                                        <Avatar
                                                            size={65}
                                                            alt='Profile'
                                                            src="https://cdn-icons-png.freepik.com/256/10302/10302971.png"
                                                        />
                                                        <p className="ml-2">{data.name}</p>
                                                    </div>
                                                    <div className="py-2 px-5">
                                                        <Rate disabled value={parseFloat(data.car_rating)} allowHalf={true} />
                                                    </div>
                                                    <div className="py-1 px-2">
                                                        <p>{data.car_review.slice(0, 110)}{data.car_review.length > 110 ? ("...") : ("")} </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full flex flex-col items-center">
                                        <div className="flex items-center bg-[#333] text-white py-2 px-4 w-full">
                                            <button onClick={() => { SetAllReviews([]), SetReviews(false) }} className="text-white hover:underline"><LeftOutlined style={{ fontSize: '20px' }} />Back</button>
                                            <h2 className="mx-auto">Ratings & Reviews</h2>
                                        </div>
                                        <div className="m-auto">
                                            <Empty />
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="w-full bg-gray-100"> 
                                    <div className="flex justify-center py-2">
                                        <button className="bg-[#27ae60] text-white transform skew-x-[-15deg] w-[15%] py-1 mx-2 transition-colors duration-500 hover:bg-[#1d8649]" onClick={() => { VerifiedCars(user.sid) }}>Verified Cars</button>
                                        <button className="bg-[#e74c3c] text-white transform skew-x-[-15deg] w-[15%] py-1 mx-2 transition-colors duration-500 hover:bg-[#b22b1c]" onClick={() => { UnVerifiedCars(user.sid) }}>Not Verified Cars</button>
                                    </div>


                                    {isArray ? (

                                        <div className="flex flex-col max-h-[calc(100vh-150px)] overflow-y-auto px-4 w-full"> 
                                            {sellercarslist.map((data) => (
                                                <div className="flex flex-col my-2" key={data._id}>
                                                    <div className={`w-fit px-2 py-1 ml-[12.5%] shadow-md ${data.isverified ? 'bg-[#27AE60]' : 'bg-[#E74C3C]'}`}>
                                                        {data.isverified ? (<b className="text-white flex items-center"><StarFilled style={{ fontSize: '20px', marginRight: '2px' }} /> Verified</b>) : (
                                                            <b className="text-white flex items-center"> <StarFilled style={{ fontSize: '20px', marginRight: '2px' }} />Not verified</b>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-row bg-white rounded-md shadow-md w-[75%] mx-auto py-3">
                                                        <div className="w-[40%] px-1">
                                                            <img className="w-full max-h-full shadow-md" src={data.imageUrls} alt="CarImage" />
                                                        </div>
                                                        <div className="w-[60%] ml-2">
                                                            <div className="px-3">
                                                                <h2 className="uppercase text-lg font-semibold">{data.make} {data.name} {data.year}</h2>
                                                            </div>

                                                            <div className="flex justify-around py-1">
                                                                <b className="flex items-center"><FuelIcon width='22px' height='22px' style={{ marginRight: '5px' }} /> Fuel: <span className="font-normal ml-1">{data.fuel}</span></b>
                                                                <b className="flex items-center"><CarOutlined style={{ fontSize: '22px', marginRight: '4%' }} /> Model: <span className="font-normal ml-1">{data.model}</span></b>
                                                                <b className="flex items-center"><GearIcon width='20px' height='20px' style={{ marginRight: '5px' }} /> Type: <span className="font-normal ml-1">{data.type}</span></b>
                                                            </div>

                                                            <div className="flex justify-around py-1">
                                                                <b className="w-[40%] flex items-center"><CalendarFilled style={{ fontSize: '15px', marginRight: '2%' }} />List Start: <span className="font-normal ml-1">{data.list_start.split('-')[2]}-{data.list_start.split('-')[1]}-{data.list_start.split('-')[0]}</span> </b>
                                                                <b className="w-[40%] flex items-center"><CalendarFilled style={{ fontSize: '15px', marginRight: '2%' }} />List Drop:  <span className="font-normal ml-1">{data.list_drop.split('-')[2]}-{data.list_drop.split('-')[1]}-{data.list_drop.split('-')[0]}</span> </b>
                                                            </div>


                                                            <div className="flex justify-around items-center py-1">
                                                                <b className="flex items-center">Vehicle Number: <span className="font-normal ml-1">{data.car_no}</span></b>
                                                                <b className="flex items-center"><EnvironmentOutlined style={{ fontSize: '20px', marginRight: '2%' }} /> Location: <span className="font-normal ml-1">{data.location}</span> </b>
                                                            </div>

                                                            <div className="flex justify-around w-[90%] mx-auto py-1">
                                                                <div className="flex items-center">
                                                                    <b className="flex items-center"><StarFilled style={{ fontSize: '15px', marginRight: '2px' }} />Ratings:  </b><span className="font-normal ml-1"> {data.ratings}</span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <b className="flex items-center">Price:<span className="font-normal ml-1"> ₹{data.price}</span></b>
                                                                </div>
                                                            </div>


                                                            <div className="flex justify-center w-full py-1">
                                                                {data.isverified ? (<>
                                                                    <button className="bg-[#27ae60] text-white rounded-md w-[25%] py-2 mx-4 transition-colors duration-500 hover:bg-[#1d8649]" onClick={() => { Edit(data), Setsinglecar(data) }}>Edit</button>
                                                                    <button className="bg-[#e74c3c] text-white rounded-md w-[25%] py-2 mx-4 transition-colors duration-500 hover:bg-[#b22b1c]" onClick={() => { Setdelete(true), Setsinglecar((data)) }}>Delete</button>
                                                                    <button className="bg-[#007bff] text-white rounded-md w-[25%] py-1 mx-4 transition-colors duration-500 hover:bg-[#0161c9]" onClick={() => { FindReviews(data.car_no) }}>Reviews</button>
                                                                </>) : (<>
                                                                    <button className="bg-[#e74c3c] text-white rounded-md w-[25%] py-2 mx-4 transition-colors duration-500 hover:bg-[#b22b1c]" onClick={() => { Setdelete(true), Setsinglecar((data)) }}>Delete</button>
                                                                </>)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>


                                    ) : (
                                        <div className="flex flex-col max-h-[calc(100vh-150px)] overflow-y-auto px-4 w-full"> 
                                            <div className="flex flex-col items-center my-auto">
                                                <Empty />
                                                <ul className="list-disc list-inside text-center">
                                                    <li> <p>No cars available at the moment.</p></li>
                                                    <li>
                                                        <p>Please add a car to continue.</p></li>
                                                </ul>
                                                <button className="bg-[#007bff] text-white rounded-md px-4 py-1 transition-colors duration-500 hover:bg-[#0161c9]" onClick={() => { navigate('/AddCar') }}>Add car</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        </div>
                    </div>
                    <Footer />
                </>
            )}
        </>
    )
}

export default MyCars;