import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

import { storage1 } from "../UserConfig/firebase";
import { ref, uploadBytes } from "firebase/storage";

import { ConfigProvider, notification } from "antd";

import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import Loading from "../Loading/Loading";

const AddCar = () => {
  const user = useSelector((state) => state.user);
  const [formdetails, Setform] = useState({
    sid: `${user.sid}`,
    car_no: "",
    img: "",
    name: "",
    year: "",
    fuel: "",
    make: "",
    model: "",
    type: "",
    price: "",
    location: "",
    desc: "",
  });
  const [loading, Setloading] = useState(true);
  const [Ack, SetAck] = useState(false);
  const [Fuel, SetFuel] = useState([]);
  const [Make, SetMake] = useState([]);
  const [Model, SetModel] = useState([]);
  const [Type, SetType] = useState([]);
  const [Errmsg, SetErr] = useState({
    car_no: "",
    img: "",
    name: "",
    year: "",
    fuel: "",
    make: "",
    model: "",
    type: "",
    price: "",
    location: "",
    rcbook: "",
    Insurance: "",
    selectedFiles: "",
    desc: "",
  });
  const [Minyear, SetMinYear] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const RcbookRef = useRef("");
  const InsuranceRef = useRef("");
  const [Primaryfilename, SetPrimaryFileName] = useState({
    car: "No file chosen",
    rcbook: "No file chosen",
    insurance: "No file chosen",
  });
  const [api, contextHolder] = notification.useNotification();

  const Navigate = useNavigate();

  const openNotification = (message) => {

    if(message.includes("Validating")){
       api.success({
          message: message,
          placement: "topRight",
          duration: 2,
          style: {
            background: "#008080	",
          },
        })
      } else {



      message.includes("Successfully")
        ? api.success({
            message: message,
            placement: "topRight",
            duration: 2,
            style: {
              background: "#5cb85c	",
            },
          })
        : api.error({
            message: message,
            placement: "topRight",
            duration: 2,
            style: {
              background: "rgb(223, 67, 67)",
            },
          });
      }
  };

  const ValidateForm = () => {
    openNotification("Validating your details")
    if (formdetails.car_no.trim() === "" || formdetails.car_no == null) {
      SetErr((prev) => {
        return { ...prev, car_no: "Enter the Car number" };
      });
      SetAck(true);
    } else if (
      formdetails.car_no.length > 10 ||
      (formdetails.car_no.length > 0 && formdetails.car_no.length < 9)
    ) {
      SetErr((prev) => {
        return { ...prev, car_no: "Enter a valid car number" };
      });
      SetAck(true);
    } else {
      SetErr((prev) => {
        return { ...prev, car_no: "" };
      });
      SetAck(false);
    }

    if (formdetails.name.trim() === "" || formdetails.name === null) {
      SetAck(true);
      SetErr((prev) => {
        return { ...prev, name: "Enter the name" };
      });
    } else {
      SetErr((prev) => {
        return { ...prev, name: "" };
      });
      SetAck(false);
    }

    if (formdetails.fuel === "" || formdetails.fuel === null) {
      SetAck(true);
      SetErr((prev) => {
        return { ...prev, fuel: "Enter the Fuel Category" };
      });
    } else {
      SetErr((prev) => {
        return { ...prev, fuel: "" };
      });
      SetAck(false);
    }

    if (formdetails.make === "" || formdetails.make === null) {
      SetAck(true);
      SetErr((prev) => {
        return { ...prev, make: "Enter the Vehicle brand " };
      });
    } else {
      SetErr((prev) => {
        return { ...prev, make: "" };
      });
      SetAck(false);
    }

    if (formdetails.model === "" || formdetails.model === null) {
      SetAck(true);
      SetErr((prev) => {
        return { ...prev, model: "Enter the Vehicle model" };
      });
    } else {
      SetErr((prev) => {
        return { ...prev, model: "" };
      });
      SetAck(false);
    }

    if (formdetails.type === "" || formdetails.type === null) {
      SetAck(true);
      SetErr((prev) => {
        return { ...prev, type: "Enter the Transmission type" };
      });
    } else {
      SetErr((prev) => {
        return { ...prev, type: "" };
      });
      SetAck(false);
    }

    if (formdetails.year.trim() === "" || formdetails.year === null) {
      SetAck(true);
      SetErr((prev) => {
        return { ...prev, year: "Enter the year of manufacturer" };
      });
    } else if (
      Number(formdetails.year) < 2000 ||
      Number(formdetails.year) > new Date().getFullYear() ||
      formdetails.year < 4
    ) {
      SetAck(true);
      SetErr((prev) => {
        return {
          ...prev,
          year:
            "Enter a Valid year between 2000-" + `${new Date().getFullYear()}`,
        };
      });
    } else {
      SetErr((prev) => {
        return { ...prev, year: "" };
      });
      SetAck(false);
    }

    if (formdetails.price.trim() === "" || formdetails.price === null) {
      SetErr((prev) => {
        return { ...prev, price: "Cost per day " };
      });
      SetAck(true);
    } else {
      SetErr((prev) => {
        return { ...prev, price: "" };
      });
      SetAck(false);
    }

    if (formdetails.location.trim() === "" || formdetails.location === null) {
      SetErr((prev) => {
        return { ...prev, location: "Enter the location of car" };
      });
      SetAck(true);
    } else {
      SetErr((prev) => {
        return { ...prev, location: "" };
      });
      SetAck(false);
    }
    if (formdetails.img === "" || formdetails.img === null) {
      SetErr((prev) => {
        return { ...prev, img: "Choose your main car image" };
      });
      SetAck(true);
    } else {
      SetErr((prev) => {
        return { ...prev, img: "" };
      });
      SetAck(false);
    }
    if (selectedFiles.length === 0) {
      SetErr((prev) => {
        return { ...prev, selectedFiles: "Choose your others image" };
      });
      SetAck(true);
    } else {
      SetErr((prev) => {
        return { ...prev, selectedFiles: "" };
      });
      SetAck(false);
    }

    if (InsuranceRef.current === "" || InsuranceRef.current === null) {
      SetErr((prev) => {
        return { ...prev, Insurance: "Upload your insurance " };
      });
      SetAck(true);
    } else {
      SetErr((prev) => {
        return { ...prev, Insurance: "" };
      });
      SetAck(false);
    }
    if (RcbookRef.current === null || RcbookRef.current === "") {
      SetErr((prev) => {
        return { ...prev, rcbook: "Upload your rcbook" };
      });
      SetAck(true);
    } else {
      SetErr((prev) => {
        return { ...prev, rcbook: "" };
      });
      SetAck(false);
    }

    if (formdetails.desc === null || formdetails.desc === "") {
      SetErr((prev) => {
        return { ...prev, desc: "Describe your vehicle" };
      });
      SetAck(true);
    } else {
      SetErr((prev) => {
        return { ...prev, desc: "" };
      });
      SetAck(false);
    }

    if (
      formdetails.img !== "" &&
      formdetails.img !== null &&
      selectedFiles.length > 0 &&
      RcbookRef.current !== "" &&
      RcbookRef.current !== null &&
      InsuranceRef.current !== null &&
      InsuranceRef.current !== "" &&
      formdetails.car_no.trim() != "" &&
      formdetails.car_no != null &&
      formdetails.car_no.length === 9 &&
      formdetails.name.trim() != "" &&
      formdetails.name != null &&
      formdetails.fuel != null &&
      formdetails.fuel != "" &&
      formdetails.year != null &&
      formdetails.year != "" &&
      Number(formdetails.year) >= 2000 &&
      Number(formdetails.year) <= Minyear &&
      formdetails.make != "" &&
      formdetails.make != null &&
      formdetails.model != "" &&
      formdetails.model != null &&
      formdetails.type != "" &&
      formdetails.type != null &&
      formdetails.price.trim() != "" &&
      formdetails.price != null &&
      formdetails.location.trim() != "" &&
      formdetails.location != null
    ) {
      CarFormSubmit();
    } else {
      openNotification("Check fields again")
      return;
    }
  };

  const CarFormSubmit = async () => {
    if (
      formdetails.car_no.trim() != "" &&
      formdetails.car_no != null &&
      formdetails.car_no.length === 9 &&
      formdetails.img != "" &&
      formdetails.img != null &&
      formdetails.name.trim() != "" &&
      formdetails.name != null &&
      formdetails.fuel != null &&
      formdetails.fuel != "" &&
      formdetails.year != null &&
      formdetails.year != "" &&
      Number(formdetails.year) >= 2000 &&
      Number(formdetails.year) <= 2023 &&
      formdetails.make != "" &&
      formdetails.make != null &&
      formdetails.model != "" &&
      formdetails.model != null &&
      formdetails.type != "" &&
      formdetails.type != null &&
      formdetails.price.trim() != "" &&
      formdetails.price != null &&
      formdetails.location.trim() != "" &&
      formdetails.location != null
    ) {
      const { data } = await axios.post("/AddCars", formdetails);
      if (data.action) {
        ImagesUploadToFirebase();
      } else {
        openNotification(data.status);
      }
    }
  };

  const CarDetails = (e) => {
    const { name, value } = e.target;
    Setform({ ...formdetails, [name]: value.trim() });
  };

  const getInputDetails = async () => {
    const { data } = await axios.get("/InputDetails");
    SetFuel(data.Fuel);
    SetMake(data.Make);
    SetModel(data.Model);
    SetType(data.Type);
  };

  const getThisYear = () => {
    var date = new Date().getFullYear();
    SetMinYear(date);
  };

  useEffect(() => {
    if (user.isAuth) {
      getInputDetails();
      getThisYear();
      Setloading(false);
    } else {
      Navigate("/");
    }
  }, []);

  const ConvertImage = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = () => {
      Setform((prev) => ({
        ...prev,
        img: reader.result,
      }));
    };
    SetPrimaryFileName((prev) => {
      return { ...prev, [e.target.name]: e.target.files[0].name };
    });
  };

  function generateRandomName() {
    const uniqueId = Math.random().toString(36).substr(2, 9);
    const timestamp = new Date().getTime();
    const randomName = `${uniqueId}_${timestamp}`;

    const fileExtension = ".jpg";

    return `${randomName}${fileExtension}`;
  }

  const ImagesUploadToFirebase = async () => {
    const insuranceRef = ref(
      storage1,
      `/CarImages/${user.sid}/${formdetails.car_no}/Insurance.jpg/`
    );

    const rcbookRef = ref(
      storage1,
      `/CarImages/${user.sid}/${formdetails.car_no}/RCBook.jpg/`
    );

    await uploadBytes(insuranceRef, InsuranceRef.current);
    await uploadBytes(rcbookRef, RcbookRef.current);

    for (const file of selectedFiles) {
      const randomname = generateRandomName();
      const imageRef = ref(
        storage1,
        `/CarImages/${user.sid}/${formdetails.car_no}/images/${randomname}`
      );

      try {
        await uploadBytes(imageRef, file);
      } catch (error) {
        openNotification("Error Try again");
        return;
      }
    }
    openNotification("Successfully Registered");
    setTimeout(() => {
      Navigate("/Dashboard");
    }, 3000);
  };

  const handlecarimageChange = (e) => {
    const files = e.target.files;
    setSelectedFiles(Array.from(files));
  };

  const handleBookimageChange = (e) => {
    if (e && e.target && e.target.name) {
      if (e.target.name === "rcbook" && e.target.files && e.target.files[0]) {
        RcbookRef.current = e.target.files[0];
      } else if (
        e.target.name === "insurance" &&
        e.target.files &&
        e.target.files[0]
      ) {
        InsuranceRef.current = e.target.files[0];
      }

      if (e.target.files && e.target.files[0].name !== undefined) {
        SetPrimaryFileName((prev) => {
          return { ...prev, [e.target.name]: e.target.files[0].name };
        });
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex flex-col">
        {" "}
        {}
        <Navbar />
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
        <div className="flex-grow w-full px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16 overflow-y-auto">
          {" "}
          {}
          <div className="bg-white shadow-md rounded-md w-full mx-auto max-w-4xl p-6">
            <div className="text-3xl font-bold text-blue-900 mb-4">
              Your Vehicle
            </div>{" "}
            {}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className=" ">
                <label htmlFor="car_no" className="font-bold block mb-1">
                  Car Number:
                </label>
                <input
                  type="text"
                  id="car_no"
                  name="car_no"
                  onChange={CarDetails}
                  className="border border-gray-300 bg-gray-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Car Number"
                  minLength={4}
                  maxLength={10}
                  autoComplete="off"
                  required
                />
                {Ack ? (
                  <span className="text-red-500 text-sm">{Errmsg.car_no}</span>
                ) : (
                  <span className="text-red-500 text-sm">{Errmsg.car_no}</span>
                )}
              </div>

              <div className="">
                <label htmlFor="name" className="font-bold block mb-1">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  onChange={CarDetails}
                  className="border border-gray-300 bg-gray-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Name of car"
                  autoComplete="off"
                  required
                />
                {Ack ? (
                  <span className="text-red-500 text-sm">{Errmsg.name}</span>
                ) : (
                  <span className="text-red-500 text-sm">{Errmsg.name}</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="">
                <label htmlFor="year" className="font-bold block mb-1">
                  Year of Manufacture:
                </label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  onChange={CarDetails}
                  min={2000}
                  max={new Date().getFullYear()}
                  minLength={4}
                  maxLength={4}
                  className="border border-gray-300 bg-gray-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Year of manufacture"
                  autoComplete="off"
                  required
                />
                {Ack ? (
                  <span className="text-red-500 text-sm">{Errmsg.year}</span>
                ) : (
                  <span className="text-red-500 text-sm">{Errmsg.year}</span>
                )}
              </div>

              <div className="">
                <label htmlFor="price" className="font-bold block mb-1">
                  Price/Day:
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  onChange={CarDetails}
                  className="border border-gray-300 bg-gray-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Price/day"
                  autoComplete="off"
                  required
                />
                {Ack ? (
                  <span className="text-red-500 text-sm">{Errmsg.price}</span>
                ) : (
                  <span className="text-red-500 text-sm">{Errmsg.price}</span>
                )}
              </div>

              <div className="">
                <label htmlFor="location" className="font-bold block mb-1">
                  Location of Car:
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  onChange={CarDetails}
                  className="border border-gray-300 bg-gray-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Location of Car"
                  autoComplete="off"
                  required
                />
                {Ack ? (
                  <span className="text-red-500 text-sm">
                    {Errmsg.location}
                  </span>
                ) : (
                  <span className="text-red-500 text-sm">
                    {Errmsg.location}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div>
                <label htmlFor="fuel" className="font-bold block mb-1">
                  Fuel:
                </label>
                <select
                  className="border border-gray-300 bg-gray-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  name="fuel"
                  onChange={CarDetails}
                  autoComplete="off"
                >
                  <option value="">Fuel</option>
                  {Fuel.map((data) => (
                    <option key={data.id} value={data.fuel}>
                      {data.fuel}
                    </option>
                  ))}
                </select>
                {Ack ? (
                  <span className="text-red-500 text-sm">{Errmsg.fuel}</span>
                ) : (
                  <span className="text-red-500 text-sm">{Errmsg.fuel}</span>
                )}
              </div>

              <div>
                <label htmlFor="make" className="font-bold block mb-1">
                  Make:
                </label>
                <select
                  className="border border-gray-300 bg-gray-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  name="make"
                  onChange={CarDetails}
                  autoComplete="off"
                >
                  <option value="">Make</option>
                  {Make.map((data) => (
                    <option key={data.id} value={data.make}>
                      {data.make}
                    </option>
                  ))}
                </select>
                {Ack ? (
                  <span className="text-red-500 text-sm">{Errmsg.make}</span>
                ) : (
                  <span className="text-red-500 text-sm">{Errmsg.make}</span>
                )}
              </div>

              <div>
                <label htmlFor="model" className="font-bold block mb-1">
                  Model:
                </label>
                <select
                  className="border border-gray-300 bg-gray-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  name="model"
                  onChange={CarDetails}
                  autoComplete="off"
                >
                  <option value="">Model</option>
                  {Model.map((data) => (
                    <option key={data.id} value={data.model}>
                      {data.model}
                    </option>
                  ))}
                </select>
                {Ack ? (
                  <span className="text-red-500 text-sm">{Errmsg.model}</span>
                ) : (
                  <span className="text-red-500 text-sm">{Errmsg.model}</span>
                )}
              </div>

              <div>
                <label htmlFor="type" className="font-bold block mb-1">
                  Type:
                </label>
                <select
                  className="border border-gray-300 bg-gray-100 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                  name="type"
                  onChange={CarDetails}
                  autoComplete="off"
                >
                  <option value="">Type</option>
                  {Type.map((data) => (
                    <option key={data.id} value={data.type}>
                      {data.type}
                    </option>
                  ))}
                </select>
                {Ack ? (
                  <span className="text-red-500 text-sm">{Errmsg.type}</span>
                ) : (
                  <span className="text-red-500 text-sm">{Errmsg.type}</span>
                )}
              </div>
            </div>
            <div className="mt-8">
              {" "}
              {}
              <div className="text-2xl font-bold text-blue-900 mb-4">
                Car Images
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="font-bold mb-1">Primary Image of car:</div>
                  <input
                    type="file"
                    id="actual-btn"
                    name="car"
                    onChange={ConvertImage}
                    hidden
                  />
                  <label
                    htmlFor="actual-btn"
                    className="bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Choose File
                  </label>
                  <span id="file-chosen" className="ml-2">
                    {Primaryfilename.car}
                  </span>
                  {Ack ? (
                    <span className="text-red-500 text-sm">{Errmsg.img}</span>
                  ) : (
                    <span className="text-red-500 text-sm">{Errmsg.img}</span>
                  )}
                </div>

                <div>
                  <div className="font-bold mb-1">Describe your vehicle:</div>
                  <textarea
                    name="desc"
                    onChange={CarDetails}
                    className="border border-gray-300 bg-gray-100 rounded px-3 py-2 w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  ></textarea>
                  {Ack ? (
                    <span className="text-red-500 text-sm">{Errmsg.desc}</span>
                  ) : (
                    <span className="text-red-500 text-sm">{Errmsg.desc}</span>
                  )}
                </div>
              </div>
              <div className="mt-4">
        <div className="font-bold mb-1">Add other images:</div>
        <label htmlFor="extra_images" className="flex justify-center items-center h-10 border-2 border-dashed border-gray-300 rounded-md cursor-pointer">
          <input
            type="file"
            id="extra_images"  
            accept=".jpg,.png,.jpeg"
            onChange={handlecarimageChange}
            multiple
            name="extra_images"
            className="hidden"  
          />
          <div className="text-center">
            <span>
              Upload your <span className="text-indigo-600">.Jpg</span>{" "}
              <span className="text-red-600">.Png</span> here!
            </span>
          </div>
        </label>

        <div className="mt-2">  {/* Added container for preview images */}
          {selectedFiles.map((image, index) => (
            <div key={index} className="flex items-center mb-2">
              <img src={URL.createObjectURL(image)} alt={`Extra Image ${index}`} className="w-20 h-20 mr-2 object-contain rounded-md" />  {/* Preview image */}
              <span>{image.name}</span>  {/* Display filename */}
            </div>
          ))}
        </div>
        {Ack ? (
          <span className="text-red-500 text-sm">
            {Errmsg.selectedFiles}
          </span>
        ) : (
          <span className="text-red-500 text-sm">
            {Errmsg.selectedFiles}
          </span>
        )}
      </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <div className="font-bold mb-1">RC Book :</div>
                  <input
                    type="file"
                    onChange={handleBookimageChange}
                    name="rcbook"
                    id="rcbook-btn"
                    hidden
                  />
                  <label
                    htmlFor="rcbook-btn"
                    className="bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Choose File
                  </label>
                  <span id="file-chosen" className="ml-2">
                    {Primaryfilename.rcbook}
                  </span>
                  {Ack ? (
                    <span className="text-red-500 text-sm">
                      {Errmsg.rcbook}
                    </span>
                  ) : (
                    <span className="text-red-500 text-sm">
                      {Errmsg.rcbook}
                    </span>
                  )}
                </div>

                <div>
                  <div className="font-bold mb-1">Insurance:</div>
                  <input
                    type="file"
                    onChange={handleBookimageChange}
                    name="insurance"
                    id="insurance-btn"
                    hidden
                  />
                  <label
                    htmlFor="insurance-btn"
                    className="bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Choose File
                  </label>
                  <span id="file-chosen" className="ml-2">
                    {Primaryfilename.insurance}
                  </span>
                  {Ack ? (
                    <span className="text-red-500 text-sm">
                      {Errmsg.Insurance}
                    </span>
                  ) : (
                    <span className="text-red-500 text-sm">
                      {Errmsg.Insurance}
                    </span>
                  )}
                </div>
              </div>

            </div>
            <div className="mt-8 flex justify-center">
                <button
                  onClick={ValidateForm}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
              </div>
            {}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AddCar;