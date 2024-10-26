import axios from "../api/axios";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { FillCarNumber, Filldetails } from "../Slice/CarSLice";
import {
  FillFilter,
  FillFilterDate,
  FillFilterOut,
} from "../Slice/FilterSlice";
import { FillSelectedCars, FillSelectedCarsOut } from "../Slice/SelectedCars";

import Booking from "./Booking/Booking";
import Navbar from "../Navbar/Navbar";
import Footer from "../Home/Footer/Footer";
import Loading from "../Loading/Loading";

import { Slider, Rate, ConfigProvider, Input, Modal } from "antd";
import { CalendarFilled } from "@ant-design/icons";

import {
  CarIcon,
  FuelIcon,
  GearIcon,
} from "../SVGIcons/SvgComponent";

import NotFoundImage from "../Images/NotFound/NotFound.png";


import AOS from "aos";
import "aos/dist/aos.css";

const Carlist = (props) => {
  const user = useSelector((state) => state.user);
  const [loading, Setloading] = useState(true);
  const [selectedCars, setSelectedCars] = useState({
    location: false,
    Fuel: [],
    Make: [],
    Model: [],
    Type: [],
  });
  const [cars, Setcars] = useState([]);
  const [MinDate, SetMinDate] = useState();
  const [status, Setstatus] = useState();
  const [singlecar, Setsinglecar] = useState({});
  const [Filterpopup, SetFilterpopup] = useState(false);

  const [FetchCars, SetFetch] = useState(false);
  const [isArray, SetArray] = useState(true);
  const [Bookdata, Setbookdata] = useState({
    uid: `${user.uid}`,
    start_date: "",
    drop_date: "",
    status: "BookingDetails",
  });
  const [Fuel, SetFuel] = useState([]);
  const [Make, SetMake] = useState([]);
  const [Model, SetModel] = useState([]);
  const [Type, SetType] = useState([]);
  const [isBook, SetBookAuth] = useState(false);
  const [FilterDetails, SetFilterDetails] = useState({
    location: "",
    status: "FilterDetails",
    Fuel: [],
    Make: [],
    Model: [],
    Type: [],
    price: [],
    ratings: "0",
    start_date: Bookdata.start_date,
    drop_date: Bookdata.drop_date,
  });
  const [AvailableCars, SetAvailableCars] = useState();

  const [searchvalue, Setsearchvalue] = useState();
  const [pricevalue, Setpricevalue] = useState([200, 500]);
  const FilterRef = useRef(null);
  const carslice = useSelector((state) => state.cardetails);
  const filterslice = useSelector((state) => state.FilterDetails);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const desc = ["1", "2", "3", "4", "5"];
  const { Search } = Input;
  useEffect(() => {
    AOS.init();
  }, []);
  const getCarDetails = async () => {
    const { data } = await axios.get("/findCars");
    Setcars(data);
    SetAvailableCars(data);
    SetArray(true);
    Setloading(false);
  };

  const getFilters = async () => {
    const { data } = await axios.get("/FiltersMetaData");
    SetFuel(data[0].Fuel);
    SetMake(data[0].Make);
    SetModel(data[0].Model);
    SetType(data[0].Type);
  };

  useEffect(() => {
    getFilters();
  }, []);

  const MiniDate = () => {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let formattedMonth = month < 10 ? `0${month}` : month;
    let formattedDay = date < 10 ? `0${date}` : date;

    let day = `${year}-${formattedMonth}-${formattedDay}`;
    SetMinDate(day);
  };
  useEffect(() => {
    MiniDate();
  }, []);

  const getSingleCarDetails = async (car_no) => {
    const { data } = await axios.post("/findsinglecar", { car_no });
    SetBookAuth(true);
    Setsinglecar(data);
    Setloading(false);
  };

  useEffect(() => {
    if (
      carslice.start_date !== "" &&
      carslice.drop_date !== "" &&
      carslice.bookAuth &&
      user.isAuth
    ) {
      Setbookdata((prev) => {
        return {
          ...prev,
          start_date: carslice.start_date,
          drop_date: carslice.drop_date,
        };
      });
      getSingleCarDetails(carslice.car_no);
    } else {
      getCarDetails();
    }
  }, []);

  const BookingChange = (e) => {
    const { name, value } = e.target;
    Setbookdata((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const FilterChange = (e, id) => {
    const { name, value } = e.target;
    const isChecked = e.target.checked;

    setSelectedCars((prev) => {
      const updatedCars = { ...prev };
      if (isChecked) {
        if (name !== "location") {
          updatedCars[name] = [...prev[name], id];
        } else {
          updatedCars.location = true;
        }
      } else {
        if (name !== "location") {
          updatedCars[name] = prev[name].filter((item) => item !== id);
        } else {
          updatedCars.location = false;
        }
      }
      return updatedCars;
    });

    SetFilterDetails((prev) => {
      const updatedFilters = { ...prev };
      if (isChecked) {
        if (name === "location") {
          updatedFilters.location = user.location;
        } else {
          updatedFilters[name] = [...prev[name], value];
        }
      } else {
        if (name === "location") {
          updatedFilters.location = "";
        } else {
          updatedFilters[name] = prev[name].filter((item) => item !== value);
        }
      }
      return updatedFilters;
    });
  };

  const ApplyFilter = async () => {
    if (user.isAuth) {
      const { data } = await axios.post("/findAvailableCars", FilterDetails);
      dispatch(FillFilter(FilterDetails));
      dispatch(FillSelectedCars(selectedCars));
      if (Array.isArray(data)) {
        SetArray(true);
        Setcars(data);
        SetAvailableCars(data);
        SetFetch(true);
      } else {
        dispatch(FillFilterOut());
        Setpricevalue([200, 500]);
        setSelectedCars({
          location: false,
          Fuel: [],
          Make: [],
          Model: [],
          Type: [],
        });
        Setstatus(data);
        SetArray(false);
        SetFetch(false);
        SetFilterDetails({
          location: "",
          status: "FilterDetails",
          Fuel: [],
          Make: [],
          Model: [],
          Type: [],
          price: [],
          ratings: 0,
          start_date: Bookdata.start_date,
          drop_date: Bookdata.drop_date,
        });
      }
    } else {
      navigate("/Login");
    }
  };

  const ApplyFilterbtn = () => {
    if (FetchCars) {
      ApplyFilter();
    } else {
      alert("choose the dates");
    }
    SetFilterpopup(false);
  };

  const Find = async () => {
    if (user.isAuth) {
      dispatch(Filldetails(Bookdata));
      if (Bookdata.start_date !== "" && Bookdata.drop_date !== "") {
        let data;
        if (Bookdata.start_date !== "") {
          const response = await axios.post("/findAvailableCars", Bookdata);
          data = response.data;
        } else {
          const response = await axios.post("/findAvailableCars", carslice);
          data = response.data;
        }
        if (Array.isArray(data)) {
          SetArray(true);
          Setcars(data);
          SetAvailableCars(data);
          SetFetch(true);
          setSelectedCars({
            location: false,
            Fuel: [],
            Make: [],
            Model: [],
            Type: [],
          });
          dispatch(FillSelectedCarsOut());
          dispatch(
            FillFilter({
              location: "",
              Fuel: [],
              Make: [],
              Model: [],
              Type: [],
              price: [],
              ratings: 0,
            })
          );
          SetFilterDetails({
            location: "",
            status: "FilterDetails",
            Fuel: [],
            Make: [],
            Model: [],
            Type: [],
            price: [],
            ratings: 0,
            start_date: `${Bookdata.start_date}`,
            drop_date: `${Bookdata.drop_date}`,
          });
        } else {
          Setstatus(data);
          SetArray(false);
          SetFetch(false);
        }
      } else {
        alert("Choose the Date");
      }
    } else {
      navigate("/Login");
    }
  };

  const BookCar = (data) => {
    dispatch(FillCarNumber({ car_no: data.car_no }));
    Setsinglecar(data);
    SetBookAuth(true);
  };

  const ClearFilter = async () => {
    Setpricevalue([200, 500]);
    setSelectedCars({
      location: false,
      Fuel: [],
      Make: [],
      Model: [],
      Type: [],
    });
    SetFilterDetails({
      location: "",
      status: "FilterDetails",
      Fuel: [],
      Make: [],
      Model: [],
      Type: [],
      price: [],
      ratings: "0",
      start_date: `${Bookdata.start_date}`,
      drop_date: `${Bookdata.drop_date}`,
    });
    dispatch(FillFilterOut());
    dispatch(FillSelectedCarsOut());
    Find();
  };

  const Value = async () => {
    dispatch(
      Filldetails({
        start_date: Bookdata.start_date,
        drop_date: Bookdata.drop_date,
      })
    );
    dispatch(
      FillFilterDate({
        start_date: Bookdata.start_date,
        drop_date: Bookdata.drop_date,
      })
    );
    if (filterslice.FilterAuth) {
      SetFilterDetails((prev) => {
        return {
          ...prev,
          start_date: Bookdata.start_date,
          drop_date: Bookdata.drop_date,
        };
      });
      FilterDetails.start_date = Bookdata.start_date;
      FilterDetails.drop_date = Bookdata.drop_date;
      ApplyFilter();
    } else {
      Find();
    }
  };
  const onChangeComplete = (value) => {
    SetFilterDetails((prev) => ({
      ...prev,
      price: value,
    }));
  };

  const onchangeprice = (value) => {
    Setpricevalue(value);
  };

  const SearchChange = async (value) => {
    if (Bookdata.start_date !== "" && Bookdata.drop_date !== "" && FetchCars) {
      value = value.charAt(0).toUpperCase() + value.slice(1);
      const ListofCars = cars.filter(
        (car) =>
          car.name.match(value.trim()) ||
          car.make.match(value.trim()) ||
          car.model.match(value.trim())
      );
      if (value === "") {
        Setcars(AvailableCars);
        SetArray(true);
        SetFetch(true);
        Setsearchvalue("");
      } else {
        Setsearchvalue(value);
        if (ListofCars.length > 0) {
          Setcars(ListofCars);
          SetArray(true);
          SetFetch(true);
        } else {
          let status = {
            status:
              "We're sorry, but there are no cars available for the selected date.",
            message: "Please consider the following options:",
            options: [
              "Try Searching using different names.",
              "Check for availability on nearby dates.",
              "Contact our support team for assistance.",
            ],
          };
          Setstatus(status);
          SetArray(false);
        }
      }
    }
  };

  const SearchInput = (_e) => {
    if (Bookdata.start_date !== "" && Bookdata.drop_date !== "") {
      SearchChange(_e);
    } else {
      alert("Choose the date");
    }
  };

  const ClearEachFilter = (fname) => {
    if (fname === "Location") {
      SetFilterDetails((prev) => ({ ...prev, location: "" }));
      setSelectedCars((prev) => ({ ...prev, location: false }));
    } else if (fname === "Fuel") {
      SetFilterDetails((prev) => ({ ...prev, Fuel: [] }));
      setSelectedCars((prev) => ({ ...prev, Fuel: [] }));
    } else if (fname === "Make") {
      SetFilterDetails((prev) => ({ ...prev, Make: [] }));
      setSelectedCars((prev) => ({ ...prev, Make: [] }));
    } else if (fname === "Model") {
      SetFilterDetails((prev) => ({ ...prev, Model: [] }));
      setSelectedCars((prev) => ({ ...prev, Model: [] }));
    } else if (fname === "Type") {
      SetFilterDetails((prev) => ({ ...prev, Type: [] }));
      setSelectedCars((prev) => ({ ...prev, Type: [] }));
    } else if (fname === "price") {
      SetFilterDetails((prev) => ({ ...prev, price: [] }));
      Setpricevalue([200, 500]);
    } else if (fname === "ratings") {
      SetFilterDetails((prev) => ({ ...prev, ratings: "0" }));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <ConfigProvider
        theme={{
          token: {
            colorBgMask: "rgba(0, 0, 0, 0.80)",
            zIndexPopupBase: "9999",
            colorIcon: "rgba(0, 0, 0, 0.88)",
          },
        }}
      >
        <Modal
          title="Filters"
          width={800}
          footer={null}
          centered
          open={Filterpopup}
          onOk={() => SetFilterpopup(false)}
          onCancel={() => SetFilterpopup(false)}
        >
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {}
              <div>
                <b className="block mb-2">Fuel</b>
                <div className="space-y-2">
                  {Fuel.map((data) => (
                    <div key={data.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCars.Fuel.includes(data.id)}
                        onChange={(e) => FilterChange(e, data.id)}
                        name="Fuel"
                        value={data.fuel}
                        className="mr-2"
                      />
                      <label htmlFor={data.fuel}>{data.fuel}</label>{" "}
                      {}
                    </div>
                  ))}
                </div>
                <button
                  className="mt-2 text-sm text-blue-500"
                  onClick={() => ClearEachFilter("Fuel")}
                >
                  Clear
                </button>
              </div>

              {}
              <div>
                <b className="block mb-2">My Location</b>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCars.location}
                    onChange={FilterChange} 
                    name="location"
                    value={user.location}
                    id="location-checkbox"
                    className="mr-2"
                  />
                  <label htmlFor="location-checkbox">{user.location}</label>
                </div>
                <button
                  className="mt-2 text-sm text-blue-500"
                  onClick={() => ClearEachFilter("Location")}
                >
                  Clear
                </button>
              </div>

              {}
              <div>
                <b className="block mb-2">Type</b>
                <div className="space-y-2">
                  {Type.map((data) => (
                    <div key={data.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCars.Type.includes(data.id)}
                        onChange={(e) => FilterChange(e, data.id)}
                        name="Type"
                        value={data.type}
                        id={`type-${data.id}`}
                        className="mr-2"
                      />
                      <label htmlFor={`type-${data.id}`}>{data.type}</label>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-2 text-sm text-blue-500"
                  onClick={() => ClearEachFilter("Type")}
                >
                  Clear
                </button>
              </div>

              {}
              <div>
                <b className="block mb-2">Make</b>
                <div className="space-y-2">
                  {Make.map((data) => (
                    <div key={data.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCars.Make.includes(data.id)}
                        onChange={(e) => FilterChange(e, data.id)}
                        name="Make"
                        value={data.make}
                        id={`make-${data.id}`}
                        className="mr-2"
                      />
                      <label htmlFor={`make-${data.id}`}>{data.make}</label>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-2 text-sm text-blue-500"
                  onClick={() => ClearEachFilter("Make")}
                >
                  Clear
                </button>
              </div>

              {}
              <div>
                <b className="block mb-2">Model</b>
                <div className="space-y-2">
                  {Model.map((data) => (
                    <div key={data.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCars.Model.includes(data.id)}
                        onChange={(e) => FilterChange(e, data.id)}
                        name="Model"
                        value={data.model}
                        id={`model-${data.id}`}
                        className="mr-2"
                      />
                      <label htmlFor={`model-${data.id}`}>{data.model}</label>
                    </div>
                  ))}
                </div>
                <button
                  className="mt-2 text-sm text-blue-500"
                  onClick={() => ClearEachFilter("Model")}
                >
                  Clear
                </button>
              </div>

              {}
              <div>
                <b className="block mb-2">Price</b>
                <ConfigProvider 
                  theme={{
                    components: {
                      Slider: {

                        handle: { backgroundColor: "#333" },
                        track: { backgroundColor: "#1890ff" },
                        rail: { backgroundColor: "#f0f0f0" },
                      },
                    },
                  }}
                >
                  <Slider
                    range
                    min={100}
                    max={999}
                    step={10}
                    value={pricevalue} 
                    onChange={onchangeprice} 
                    onChangeComplete={onChangeComplete} 
                    tipFormatter={(value) => `₹${value}`}
                  />
                </ConfigProvider>
                <button
                  className="mt-2 text-sm text-blue-500"
                  onClick={() => ClearEachFilter("price")}
                >
                  Clear
                </button>
              </div>

              {}
              <div>
                <b className="block mb-2">Ratings</b>
                <Rate
                  defaultValue={0}
                  value={FilterDetails.ratings}
                  onChange={(value) => {
                    SetFilterDetails((prev) => ({ ...prev, ratings: value }));
                  }}
                  allowClear
                />
                <button
                  className="mt-2 text-sm text-blue-500"
                  onClick={() => ClearEachFilter("ratings")}
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={ApplyFilterbtn}
              >
                Apply Filter
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={ClearFilter}
              >
                Clear All
              </button>
            </div>
          </div>
        </Modal>
      </ConfigProvider>

      {isBook ? (
        <Booking
          data={singlecar}
          FilterDetails={FilterDetails}
          Setpricevalue={Setpricevalue}
          selectedCars={selectedCars}
          isBook={isBook}
          SetBookAuth={SetBookAuth}
          Bookdata={Bookdata}
          Find={Find}
          ApplyFilter={ApplyFilter}
        />
      ) : (
        <div className="bg-gray-100 min-h-screen flex flex-col">
          <div className="container mx-auto p-4">
            {isArray ? (
              <div className="flex flex-col md:flex-row">
                <div className="carlist-sidebar md:w-1/3 p-4 flex flex-col items-center justify-start space-y-4 md:sticky md:top-20">
                  <button
                    className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 w-full"
                    onClick={() => {
                      SetFilterpopup(true);
                    }}
                  >
                    Try Filters
                  </button>
                  <div className="w-3/4 shadow-md">
                    <Search
                      placeholder="Eg:- Search by name,make,model"
                      size="large"
                      allowClear
                      onChange={(e) => {
                        SearchChange(e.target.value);
                      }}
                      onSearch={SearchInput}
                      value={searchvalue}
                      enterButton
                    />
                  </div>
                  <div className="w-full rounded shadow-lg p-6 flex flex-col bg-white space-y-4 carlist-date-picker">
                    <div>
                      <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="pickupDate"
                      >
                        <CalendarFilled /> Pick Up Date:
                      </label>
                      <input
                        type="date"
                        onChange={BookingChange}
                        name="start_date"
                        min={MinDate}
                        value={Bookdata.start_date}
                        required
                        className="border border-gray-400 px-3 py-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="dropOffDate"
                      >
                        <CalendarFilled /> Drop off Date:
                      </label>
                      <input
                        type="date"
                        onChange={BookingChange}
                        name="drop_date"
                        min={MinDate}
                        value={Bookdata.drop_date}
                        required
                        className="border border-gray-400 px-3 py-2 rounded w-full"
                      />
                    </div>
                    <button
                      onClick={Value}
                      className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 w-full"
                    >
                      Find Cars
                    </button>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-auto">
                  {cars.map((data) => (
                    <div
                      key={data._id}
                      data-aos="zoom-in"
                      data-aos-duration="1000"
                      className="flex flex-col carlist-card"
                    >
                      <div className="bg-white rounded-lg shadow-md  hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                        <div className="relative rounded-t-lg">
                          <img
                            src={data.img}
                            alt="CarImage"
                            className="w-full h-48 rounded-t-lg object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <h2 className="text-lg font-bold mb-2 line-clamp-1">
                            {data.make} {data.name} {data.year}
                          </h2>
                          <div className="flex items-center mb-2 text-sm text-gray-600">
                            <GearIcon className="w-4 h-4 mr-1" />{" "}
                            <span>{data.type}</span>
                            <FuelIcon className="w-4 h-4 mx-2" />{" "}
                            <span>{data.fuel}</span>
                            <CarIcon className="w-4 h-4 mx-2" />{" "}
                            <span>{data.model}</span>
                          </div>
                          <div className="mb-2">
                            <Rate
                              disabled
                              value={parseFloat(data.ratings)}
                              allowHalf={true}
                            />
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <h3 className="text-xl font-bold">
                              ₹{data.price}/Day
                            </h3>
                          </div>
                          {FetchCars && (
                            <button
                              onClick={() => {
                                BookCar(data);
                              }}
                              className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 w-full mt-4"
                            >
                              Book
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row">
                <div className="carlist-sidebar md:w-1/3 p-4 flex flex-col items-center justify-start space-y-4 md:sticky md:top-20">
                  <div className="w-3/4 mt-10 shadow-md">
                    <Search
                      placeholder="Eg:- Search by name,make,model"
                      size="large"
                      allowClear
                      onChange={(e) => {
                        SearchChange(e.target.value);
                      }}
                      onSearch={SearchInput}
                      value={searchvalue}
                      enterButton
                    />
                  </div>
                  <div className="w-3/4 mt-10 rounded shadow-lg p-6 flex flex-col bg-white">
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="pickupDate"
                      >
                        <CalendarFilled /> Pick Up Date:
                      </label>
                      <input
                        type="date"
                        onChange={BookingChange}
                        name="start_date"
                        min={MinDate}
                        value={Bookdata.start_date}
                        required
                        className="border border-gray-400 px-3 py-2 rounded w-full"
                      />
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="dropOffDate"
                      >
                        <CalendarFilled /> Drop off Date:
                      </label>
                      <input
                        type="date"
                        onChange={BookingChange}
                        name="drop_date"
                        min={MinDate}
                        value={Bookdata.drop_date}
                        required
                        className="border border-gray-400 px-3 py-2 rounded w-full"
                      />
                    </div>
                    <div>
                      <button
                        onClick={Value}
                        className="bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 w-full"
                      >
                        Find Cars
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-4/5 flex flex-col items-center justify-center text-gray-500">
                  <div className="w-1/2 mb-4">
                    <img
                      src={NotFoundImage}
                      alt="NotFound"
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="w-3/4 text-center">
                    <p className="text-lg mb-2">{status.status}</p>
                    <p className="text-lg mb-4">{status.message}</p>
                    <ul className="list-disc pl-6">
                      {status.options &&
                        status.options.map((option, index) => (
                          <li key={index} className="mb-2">
                            {option}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default Carlist;