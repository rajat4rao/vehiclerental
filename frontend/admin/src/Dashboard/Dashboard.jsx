import { useEffect, useState } from 'react'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'

import { EnvironmentOutlined, CarOutlined, CheckOutlined, CloseOutlined, ArrowUpOutlined, CheckSquareOutlined, CloseSquareOutlined, BookOutlined } from '@ant-design/icons'
import { Empty, Modal, ConfigProvider, Select, notification } from 'antd';

import { FuelIcon, GearIcon } from "../SVGIcons/SvgComponent";

import Navbar from '../Navbar/Navbar'
import Loading from '../Loading/Loading'

import { storage } from '../Config/firebase'
import { getDownloadURL, ref, listAll, deleteObject } from 'firebase/storage'

const Dashboard = () => {
    const [loading, Setloading] = useState(true);
    const [CardCount, SetCardCount] = useState({ total: 0, verified: 0, unverified: 0, Bookings: 0 });
    const [ListofCars, SetListofCars] = useState([]);
    const [isArray, SetisArray] = useState(false);
    const [Insurance, SetInsurance] = useState(false);
    const [RCBook, SetRCBook] = useState(false);
    const [ReasonPrompt, SetReasonPrompt] = useState(false);
    const [singlecar, SetSingleCar] = useState({ car_no: '', sid: '' });
    const [image, SetImage] = useState();
    const [Reason, SetReason] = useState('');
    const [api, contextHolder] = notification.useNotification();

    const Navigate = useNavigate();

    const RejectReasons = [
        { value: 'Improper Format of RC Book', label: 'Improper Format of RC Book' },
        { value: 'Improper Format of Insurance Documentation', label: 'Improper Format of Insurance Documentation' },
        { value: 'High Price', label: 'High Price' },
        { value: 'False Details', label: 'False Details' },
        { value: 'Incomplete or Inconsistent Information', label: 'Incomplete or Inconsistent Information' },
    ];

    const openNotification = (message) => {
        message.includes('Approved') ? (
            api.success({
                message: message,
                placement: "topRight",
                duration: 3,
                style: { background: "#5cb85c" },
            })
        ) : (
            api.error({
                message: message,
                placement: "topRight",
                duration: 3,
                style: { background: "rgb(223, 67, 67)" },
            })
        );
    };

    const getCarDetails = async () => {
        const { data } = await axios.get('/Dashboard');
        SetListofCars(data);
        SetisArray(data.length === 0);
        Setloading(false);
    };

    const getCardCount = async () => {
        const { data } = await axios.get('/ActiveCount');
        SetCardCount(data);
    };

    const ShowInsurance = async (car_no, sid) => {
        const imgref = ref(storage, `/CarImages/${sid}/${car_no}/Insurance.jpg`);
        const imgdata = await getDownloadURL(imgref);
        SetImage(imgdata);
        SetInsurance(true);
    };

    const ShowRCBook = async (car_no, sid) => {
        const imgref = ref(storage, `/CarImages/${sid}/${car_no}/RCBook.jpg`);
        const imgdata = await getDownloadURL(imgref);
        SetImage(imgdata);
        SetRCBook(true);
    };

    const Approve = async (car_no, sid) => {
        const { data } = await axios.post('/VerifyCar', { car_no, sid });
        if (data.action) {
            openNotification('The car has been Approved');
            setTimeout(() => {
                getCarDetails();
                getCardCount();
            }, 2000);
        }
    };

    async function deleteFolderContents(folderRef) {
        try {
            const folderRes = await listAll(folderRef);
            folderRes.items.forEach((itemRef) => {
                deleteObject(itemRef).catch((error) => {
                    console.error('Error deleting item:', itemRef.fullPath, error);
                });
            });
            folderRes.prefixes.forEach((prefixRef) => {
                deleteFolderContents(prefixRef);
            });
        } catch (error) {
            console.error("Error deleting folder contents:", error);
        }
    }

    const Decline = async () => {
        if (Reason) {
            const { data } = await axios.post('/DeleteCar', { singlecar, Reason });
            if (data.action) {
                SetReasonPrompt(false);
                Setloading(true);
                getCarDetails();
                const folderRef = ref(storage, `/CarImages/${singlecar.sid}/${singlecar.car_no}`);
                deleteFolderContents(folderRef);
            }
        } else {
            openNotification('Choose the Reason');
        }
    };

    const ReasonChange = (value) => {
        SetReason(value);
    };

    useEffect(() => {
        if (sessionStorage.getItem('userAuth')) {
            getCarDetails();
            getCardCount();
        } else {
            Navigate('/');
        }
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="flex h-screen w-screen">
            <Navbar />

            {}
            <ConfigProvider
                theme={{
                    token: {
                        colorText: "white",
                        colorSuccess: "white",
                        colorError: "white",
                    },
                }}
            >
                {contextHolder}
            </ConfigProvider>

            {}
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
                <Modal footer={null} width={750} centered open={Insurance} onOk={() => SetInsurance(false)} onCancel={() => SetInsurance(false)}>
                    <img src={image} alt="InsuranceImage" className="w-full h-auto" />
                </Modal>

                <Modal footer={null} width={750} centered open={RCBook} onOk={() => SetRCBook(false)} onCancel={() => SetRCBook(false)}>
                    <img src={image} alt="RCBookImage" className="w-full h-auto" />
                </Modal>
            </ConfigProvider>

            {}
            <Modal
                title={<div className="bg-gray-900 text-white p-2 text-center">Reject the Car!!</div>}
                open={ReasonPrompt}
                okText="Reject"
                cancelText="Back to Safety"
                onOk={Decline}
                onCancel={() => { SetReasonPrompt(false); SetSingleCar({ car_no: '', sid: '' }); }}
                okButtonProps={{
                    style: {
                        backgroundColor: '#E74C3C',
                        color: 'white',
                    },
                }}
                cancelButtonProps={{
                    style: {
                        backgroundColor: '#333',
                        color: 'white',
                    },
                }}
                width={750}
                centered
            >

                <div className="p-4">
                    <p className="text-lg mb-2">Warning: This action is irreversible. Once rejected, it cannot be undone.</p>
                    <div>
                        <b className='mr-1'>Reason:</b>
                        <Select
                            placeholder="Choose your option"
                            options={RejectReasons}
                            onChange={ReasonChange}
                            className="w-full mt-1"
                        />
                    </div>
                </div>
            </Modal>

            {}
            <div className="flex-grow p-6 overflow-y-auto"> {}

                {}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    {[
                        { title: "Total Cars", icon: BookOutlined, count: CardCount.total },
                        { title: "Verified Cars", icon: CheckSquareOutlined, count: CardCount.verified },
                        { title: "Unverified Cars", icon: CloseSquareOutlined, count: CardCount.unverified },
                        { title: "Bookings", icon: CarOutlined, count: CardCount.Bookings },
                    ].map((cardData) => (
                        <div
                            key={cardData.title}
                            className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
                        >
                           <div className='flex'>
                           <cardData.icon className="mr-2 text-xl" style={{ fontSize: '25px', marginRight: '5px' }} />
                            <h3 className="text-lg font-medium">{cardData.title}</h3>
                           </div>

                            <div className="flex items-center mt-2">
                                <h2 className="text-2xl font-bold">{cardData.count}</h2>
                                <ArrowUpOutlined className="ml-2 text-green-500 text-xl" />
                            </div>
                        </div>
                    ))}
                </div>

                {isArray ? (
                    <div className="flex justify-center items-center h-full">
                        <Empty />
                    </div>
                ) : (

                    <div className="overflow-y-auto"> {}
                        {ListofCars.map((data) => (
                            <div key={data._id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                                <div className="flex">
                                    <div className="w-2/5 pr-4"> {}
                                        <img src={data.cardetails.img} alt="CarImage" className="w-full h-auto rounded-lg shadow-md" />
                                    </div>

                                    <div className="w-3/5">
                                        <h2 className="text-xl font-bold uppercase">{data.cardetails.make} {data.cardetails.name} {data.cardetails.year}</h2>

                                        <div className="flex space-x-4 mt-2"> {}
                                            <div>
                                                <FuelIcon className="inline mr-1 w-5 h-5" />
                                                <span className="font-medium">Fuel:</span> {data.cardetails.fuel}
                                            </div>
                                            <div>
                                                <CarOutlined className="inline mr-1 text-xl" />
                                                <span className="font-medium">Model:</span> {data.cardetails.model}
                                            </div>
                                            <div>
                                                <GearIcon className="inline mr-1 w-5 h-5" />
                                                <span className="font-medium">Type:</span> {data.cardetails.type}
                                            </div>
                                        </div>

                                        <div className="flex space-x-4 mt-2"> {}
                                            <div>
                                                <span className="font-medium">Vehicle Number:</span> {data.cardetails.car_no}
                                            </div>
                                            <div>
                                                <EnvironmentOutlined className="inline mr-1 text-lg" />
                                                <span className="font-medium">Location:</span> {data.cardetails.location}
                                                </div>
                                            <div>
                                                <span className="font-medium">Price:</span> ₹{data.cardetails.price}
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <b className='mr-1'>Host Details:</b>
                                            <div className="flex mt-1"> {}
                                                <p className="font-medium mr-4">Name: {data.sellerdetails.name}</p>
                                                <p className="font-medium">Contact No: {data.sellerdetails.phone}</p>
                                            </div>

                                        </div>

                                        <div className="flex justify-center space-x-2 mt-4">
                                            <button className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-md" onClick={() => ShowInsurance(data.cardetails.car_no, data.sellerdetails.sid)}>
                                                View Insurance
                                            </button>
                                            <button className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-md" onClick={() => ShowRCBook(data.cardetails.car_no, data.sellerdetails.sid)}>
                                                View RCBook
                                            </button>
                                            <button className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md" onClick={() => Approve(data.cardetails.car_no, data.sellerdetails.sid)}>
                                                <CheckOutlined />
                                            </button>
                                            <button className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md" onClick={() => { SetReasonPrompt(true); SetSingleCar({ car_no: data.cardetails.car_no, sid: data.sellerdetails.sid }); }}>
                                                <CloseOutlined />
                                            </button>
                                        </div>

                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Dashboard;