//Antd-Framework
import { Select, notification, ConfigProvider } from "antd";
import { LeftCircleFilled } from "@ant-design/icons";

//Data
import { CityData } from "./CityData";
import { Gender } from "./CityData";

//React
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

//Firebase
import auth from "../config/firebase";
import { storage } from "../config/firebase";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

//Slice
import { SignOutDetails } from "../Slice/userSlice";

//CustomSVGIcons
import { ProfileTickIcon, ProfileCancelIcon } from "../SVGIcons/SvgComponent";

const Profile = () => {
  const [ProfileDetails, SetProfileDetails] = useState({});
  const [Details, SetDetails] = useState({
    email: "",
    phone: "",
    location: "",
  });
  const [Ack, SetAck] = useState(false);
  const [Errmsg, SetErr] = useState({ email: "", phone: "" });
  const [image, SetImage] = useState();
  const Avatar = useRef();
  const TotalAmount = useRef();
  const user = useSelector((state) => state.user);
  const [api, contextHolder] = notification.useNotification();

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const Logout = () => {
    signOut(auth);
    dispatch(SignOutDetails());
    Navigate("/");
  };

  const getUserDetails = async (sid) => {
    const { data } = await axios.post("/findUserProfile", { sid });
    SetProfileDetails(data);
    SetDetails({
      email: data.email,
      phone: data.phone,
      location: data.location,
    });
    try {
      const imageRef = ref(storage, "/images/" + `${user.sid}`);
      const imgdata = await getDownloadURL(imageRef);
      if (imgdata) {
        Avatar.current.style.backgroundImage = `url(${imgdata})`;
      }
      SetImage(imgdata);
    } catch (error) {
      Avatar.current.style.backgroundImage = `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS1MqsgcnibLWsjdWTQPPmVC-oiDsErsX-1fcrz3MR_N38jc1IaP_dJXYONB0K-VYAmJE&usqp=CAU)`;
    }
  };

  const getTotalAmount = async (sid) => {
    const { data } = await axios.post("/UserCarsCount", { sid });
    TotalAmount.current = data.TotalSum;
  };

  useEffect(() => {
    if (user.isAuth) {
      getUserDetails(user.sid);
      getTotalAmount(user.sid);
    } else {
      Navigate("/");
    }
  }, []);

  const ProfileChange = (e) => {
    const { name, value } = e.target;
    SetProfileDetails((prev) => {
      return { ...prev, [name]: value.trim() };
    });
  };

  const CityChange = (value) => {
    SetProfileDetails((prev) => {
      return { ...prev, location: value };
    });
  };

  const GenderChange = (value) => {
    SetProfileDetails((prev) => {
      return { ...prev, gender: value };
    });
  };

  const AvatarChange = async (e) => {
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      Avatar.current.style.backgroundImage = `url(${reader.result})`;
    };
    SetImage(e.target.files[0]);
  };

  const ValidateForm = () => {
    if (ProfileDetails.phone === "" || ProfileDetails.phone === null) {
      SetErr((prev) => {
        return { ...prev, phone: "Enter your phone number" };
      });
      SetAck(true);
    } else if (ProfileDetails.phone.length !== 10) {
      SetErr((prev) => {
        return { ...prev, phone: "Enter a valid phone number" };
      });
      SetAck(true);
    } else {
      SetErr((prev) => {
        return { ...prev, phone: "" };
      });
      SetAck(false);
    }

    if (
      ProfileDetails.email !== "" &&
      ProfileDetails.email != null &&
      ProfileDetails.phone !== "" &&
      ProfileDetails.phone.length === 10
    ) {
      UpdateProfileDetails();
    }
  };

  const UpdateProfileDetails = async () => {
    const { data } = await axios.post("/UpdateProfileDetails", ProfileDetails);
    const imageRef = ref(storage, `/images/${user.sid}`);
    await uploadBytes(imageRef, image);

    if (data.action) {
      await getUserDetails(user.sid);
      api.success({
        message: "Successfully Updated",
        description: "Your profile has been updated  ",
        duration: 5,
        style: {
          background: "#5cb85c	",
        },
      });
    }
  };

  return (
    <div className="bg-gray-100 w-full h-full p-4 flex flex-wrap">
      <ConfigProvider
        theme={{
          components: { Notification: { zIndexPopup: 99999 } },
          token: {
            colorText: "white",
            colorSuccess: "white",
            colorError: "white",
          },
        }}
      >
        {contextHolder}
      </ConfigProvider>

      <div className="bg-white shadow-md w-full md:w-[30%] p-4">
        {" "}
        
        <Link to="/Dashboard" className="text-gray-600 text-2xl ml-4">
          <LeftCircleFilled />
        </Link>
        <div className="flex flex-col justify-center items-center">
          <div className="w-full h-[20vh] text-center flex flex-row justify-center items-center">
            <div
              ref={Avatar}
              className="shadow-md rounded-full w-[25%] h-[15vh] cursor-pointer bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS1MqsgcnibLWsjdWTQPPmVC-oiDsErsX-1fcrz3MR_N38jc1IaP_dJXYONB0K-VYAmJE&usqp=CAU)`,
              }}
            >
              <input
                type="file"
                name="profile"
                accept="image/*"
                onChange={AvatarChange}
                className="w-full h-full rounded-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="text-center text-base">
            <b className="block">{ProfileDetails.name}</b>
            <span className="block">{Details.email}</span>
            <span className="block">{Details.phone}</span>
          </div>
        </div>
        <div className="mt-4">
          <div className="border-b border-gray-300 p-4">
            <p className="flex items-center">
              {image ? (
                <>
                  <ProfileTickIcon width="20px" height="20px" />
                </>
              ) : (
                <>
                  <ProfileCancelIcon width="25px" height="25px" />
                </>
              )}{" "}
              Profile
            </p>
          </div>
          <div className="border-b border-gray-300 p-4">
            <p className="flex items-center">
              <ProfileTickIcon width="20px" height="20px" /> Contact Number
            </p>
          </div>
          <div className="border-b border-gray-300 p-4">
            <p className="flex items-center">
              {ProfileDetails.address &&
              ProfileDetails.address.trim() !== "" ? (
                <>
                  <ProfileTickIcon width="20px" height="20px" /> Address
                </>
              ) : (
                <>
                  <ProfileCancelIcon width="25px" height="25px" /> Address
                </>
              )}
            </p>
          </div>
        </div>
        <div className="mt-4 p-4">
          <button
            onClick={Logout}
            className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-full"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md w-full md:w-[68%] p-4 ml-4 mt-4 md:mt-0">
        {" "}
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">MY ACCOUNT</h2>
        </div>
        
        <div>
          <h2 className="border-b-2 border-gray-300 text-xl font-bold mb-2 ml-2">
            Account Details
          </h2>
          <div className="flex flex-wrap">
            {" "}
            
            <div className="w-full md:w-1/2 p-2">
              <b className="block">Email:</b>
              <input
                type="email"
                name="email"
                value={ProfileDetails.email}
                onChange={ProfileChange}
                placeholder="Email Address"
                required
                autoComplete="off"
                readOnly
                className="w-3/4 p-2 m-2 border border-gray-300 rounded"
              />
              {Ack ? (
                <span className="text-red-500 ml-2">{Errmsg.email}</span>
              ) : (
                <span className="text-red-500 ml-2">{Errmsg.email}</span>
              )}
            </div>
            <div className="w-full md:w-1/2 p-2">
              <b className="block">Contact Number:</b>
              <input
                type="number"
                name="phone"
                value={ProfileDetails.phone}
                onChange={ProfileChange}
                minLength={10}
                maxLength={10}
                min={0}
                placeholder="Phone Number"
                autoComplete="off"
                required
                className="w-3/4 p-2 m-2 border border-gray-300 rounded"
              />
              {Ack ? (
                <span className="text-red-500 ml-2">{Errmsg.phone}</span>
              ) : (
                <span className="text-red-500 ml-2">{Errmsg.phone}</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="border-b-2 border-gray-300 text-xl font-bold mb-2 ml-2">
            Personal Details
          </h2>
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 p-2">
              <b className="block">Name:</b>
              <input
                type="text"
                name="name"
                value={ProfileDetails.name}
                readOnly
                className="w-3/4 p-2 m-2 border border-gray-300 rounded"
              />
            </div>
            <div className="w-full md:w-1/2 p-2">
              <b className="block">Gender:</b>
              <Select
                placeholder="Choose your gender"
                value={
                  ProfileDetails.gender === ""
                    ? "Prefer Not to say"
                    : ProfileDetails.gender
                }
                style={{ width: 200, margin: "2%" }}
                options={Gender}
                onChange={GenderChange}
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="border-b-2 border-gray-300 text-xl font-bold mb-2 ml-2">
            Location Details
          </h2>
          <div className="p-2">
            <p>Please share your current address for optimized experience</p>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full md:w-1/2 p-2">
              <b className="block">Address:</b>
              <textarea
                name="address"
                onChange={ProfileChange}
                placeholder="Permanent Residential Address"
                value={ProfileDetails.address}
                className="w-3/4 p-2 m-2 border border-gray-300 rounded h-20 resize-none"
              ></textarea>
            </div>
            <div className="w-full md:w-1/2 p-2">
              <b className="block">City:</b>
              <Select
                showSearch
                value={ProfileDetails.location}
                placeholder="Choose your city"
                onChange={CityChange}
                filterOption={filterOption}
                options={CityData}
                size="large"
                style={{ margin: "2%" }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <button
            onClick={ValidateForm}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
