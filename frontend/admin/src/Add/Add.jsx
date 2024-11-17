import { useEffect, useState } from "react";
import axios from '../api/axios';
// import { storage } from '../Config/firebase';
// import { ref, uploadBytes } from "firebase/storage";
import Navbar from "../Navbar/Navbar";
import { ConfigProvider, notification } from 'antd';

const Add = () => {
    const [Fuel, SetFuel] = useState([]);
    const [Make, SetMake] = useState([]);
    const [Model, SetModel] = useState([]);
    const [Type, SetType] = useState([]);
    const [FormDetails, SetFormDetails] = useState({ Fuel: '', Make: '', Model: '', Type: '' });
    const [image, SetImage] = useState();
    const [Filename, SetFilename] = useState('No file chosen');

    const [api, contextHolder] = notification.useNotification();

    const openNotification = (message) => {
        message.includes("Added")
            ? api.success({
                message: message,
                placement: "topRight",
                duration: 2,
                style: { background: "#5cb85c" },
            })
            : api.error({
                message: message,
                placement: "topRight",
                duration: 2,
                style: { background: "#E74C3C" },
            });
    };

    const getFiltersMetaData = async () => {
        const { data } = await axios.get('/FiltersMetaData');
        SetFuel(data[0].Fuel);
        SetMake(data[0].Make);
        SetModel(data[0].Model);
        SetType(data[0].Type);
    };

    useEffect(() => {
        getFiltersMetaData();
    }, []);

    const AddDetails = async () => {
        if (FormDetails.Fuel || FormDetails.Make || FormDetails.Model || FormDetails.Type) {
            const { data } = await axios.post('/UpdateMetaData', { FormDetails, Fuel, Make, Model, Type });
            if (data.action) {
                openNotification('Details Added');
                getFiltersMetaData();

                SetFormDetails({ Fuel: '', Make: '', Model: '', Type: '' });
            }
        } else {
            openNotification('Add Details');
        }
    };

    const FormChange = (e) => {
        const { name, value } = e.target;
        SetFormDetails((prev) => ({ ...prev, [name]: value.trim() }));
    };

    const UploadExcel = (e) => {
        const selectedFile = e.target.files[0];
        SetImage(selectedFile);
        SetFilename(selectedFile.name);
    };

    // const Upload = async () => {
    //     if (!image) {
    //         openNotification('Choose your file');
    //     } else {
    //         const imgRef = ref(storage, '/MapLocation/' + image.name);
    //         await uploadBytes(imgRef, image);
    //         SetImage(null);
    //         SetFilename('No file chosen');
    //         openNotification('File Uploaded'); 
    //     }
    // };

    const commonSelectStyles = "w-3/4 ml-1 mt-1 border-2 border-gray-400 bg-white rounded-sm p-2 text-gray-800";
    const commonInputStyles = "w-full ml-1 mt-1 border-2 border-gray-400 bg-white rounded-sm p-2 text-gray-800";

    return (
        <div className="flex h-screen w-screen">
            <Navbar />
            <div className="flex-grow p-6">
                <div className="bg-gray-800 backdrop-blur-sm rounded-md border border-gray-300 text-white p-5">
                    <h2 className="text-2xl text-center mb-4">Add Allowed Vehicle Types</h2>

                    <div className="flex space-x-4 p-1">
                        {}
                        <div className="w-1/4">
                            
                            <select name="fuel" id="fuel" className={commonSelectStyles} autoComplete="off">
                                <option value="">Fuel</option>
                                {Fuel.map((data) => <option key={data.id} value={data.fuel}>{data.fuel}</option>)}
                            </select>
                        </div>

                         {}
                         <div className="w-1/4">
                            
                            <select name="Make" id="Make" className={commonSelectStyles} autoComplete="off">
                                <option value="">Make</option>
                                {Make.map((data) => <option key={data.id} value={data.make}>{data.make}</option>)}
                            </select>
                        </div>

                        {}
                        <div className="w-1/4">
                            
                            <select name="Model" id="Model" className={commonSelectStyles} autoComplete="off">
                                <option value="">Model</option>
                                {Model.map((data) => <option key={data.id} value={data.model}>{data.model}</option>)}
                            </select>
                        </div>

                        {}
                        <div className="w-1/4">
                            
                            <select name="Type" id="Type" className={commonSelectStyles} autoComplete="off">
                                <option value="">Type</option>
                                {Type.map((data) => <option key={data.id} value={data.type}>{data.type}</option>)}
                            </select>
                        </div>

                    </div>

                    <div className="flex flex-col mt-5">
                       {}
                        <div className="flex w-full space-x-4 mt-5">
                        <div className="w-1/2 pl-2">
                                <label htmlFor="Fuel" className="font-bold">Fuel:</label>
                                <input type="text" name="Fuel" id="Fuel" value={FormDetails.Fuel} onChange={FormChange} className={commonInputStyles} placeholder="Fuel" autoComplete="off" />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label htmlFor="Make" className="font-bold">Make:</label>
                                <input type="text" name="Make" id="Make" value={FormDetails.Make} onChange={FormChange} className={commonInputStyles} placeholder="Make" autoComplete="off" />
                            </div>
                        </div>

                        <div className="flex w-full space-x-4 mt-5">
                        <div className="w-1/2 pl-2">
                                <label htmlFor="Model" className="font-bold">Model:</label>
                                <input type="text" name="Model" id="Model" value={FormDetails.Model} onChange={FormChange} className={commonInputStyles} placeholder="Model" autoComplete="off" />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label htmlFor="Type" className="font-bold">Type:</label>
                                <input type="text" name="Type" id="Type" value={FormDetails.Type} onChange={FormChange} className={commonInputStyles} placeholder="Type" autoComplete="off" />
                            </div>
                        </div>

                    </div>


                    <div className="flex justify-center mt-6">
                        <button onClick={AddDetails} className="bg-red-500 text-white px-4 py-2 rounded-sm transition-colors hover:bg-red-700 cursor-pointer w-1/6 mt-3">Add</button>
                    </div>
                </div>

            </div>
            <ConfigProvider
                theme={{
                    token: { colorText: "white", colorSuccess: "white", colorError: "white" },
                    components: { Notification: { zIndexPopup: 99999 } },
                }}
            >
                {contextHolder}
            </ConfigProvider>
        </div>
    );
};

export default Add;