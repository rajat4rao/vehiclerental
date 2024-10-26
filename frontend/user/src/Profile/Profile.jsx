//antd
import { Select, notification, ConfigProvider } from "antd";

//antd-icon
import { LeftCircleFilled } from "@ant-design/icons";

//data
import { CityData } from "./CityData";
import { Gender } from "./CityData";

//react
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";

//firebase
import auth from "../config/firebase";
import { storage } from "../config/firebase";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

//slice
import { SignInDetails, SignOutDetails } from "../Slice/userSlice";

//custom icon
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
  const [api, contextHolder] = notification.useNotification();

  const Avatar = useRef();

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const Logout = () => {
    signOut(auth);
    dispatch(SignOutDetails());
    Navigate("/");
  };

  const getUserDetails = async (uid) => {
    const { data } = await axios.post("/findUserProfile", { uid });
    SetProfileDetails(data);
    SetDetails({
      email: data.email,
      phone: data.phone,
      location: data.location,
    });

    try {
      const imageRef = ref(storage, "/images/" + `${user.uid}`);
      const imgdata = await getDownloadURL(imageRef);
      if (imgdata) {
        Avatar.current.style.backgroundImage = `url(${imgdata})`;
      }
      SetImage(imgdata);
    } catch (error) {
      Avatar.current.style.backgroundImage = `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS1MqsgcnibLWsjdWTQPPmVC-oiDsErsX-1fcrz3MR_N38jc1IaP_dJXYONB0K-VYAmJE&usqp=CAU)`;
    }
  };

  useEffect(() => {
    if (user.isAuth) {
      getUserDetails(user.uid);
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

    const imageRef = ref(storage, `/images/${user.uid}`);
    const imgdata = await uploadBytes(imageRef, image);

    if (data.action) {
      await getUserDetails(user.uid);
      api.success({
        message: "Successfully Updated",
        description: "Your profile has been updated  ",
        duration: 5,
        style: {
          background: "#5cb85c",
        },
      });
      dispatch(SignInDetails(ProfileDetails));
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
      <div className="bg-white shadow-md w-[30%] flex flex-col mr-4 rounded-lg overflow-hidden">
        <Link to="/" className="text-gray-600 text-3xl ml-4 mt-4 mb-6">
          <LeftCircleFilled />
        </Link>
        <div className="flex flex-col justify-center items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center relative overflow-hidden">
            {" "}
            <div
              ref={Avatar}
              className="absolute inset-0 w-full h-full rounded-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: image
                  ? `url(${image})`
                  : "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS1MqsgcnibLWsjdWTQPPmVC-oiDsErsX-1fcrz3MR_N38jc1IaP_dJXYONB0K-VYAmJE&usqp=CAU)",
              }}
            ></div>
            
            <label
              htmlFor="profile-upload"
              className="cursor-pointer absolute inset-0 w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </label>
            <input
              id="profile-upload"
              type="file"
              name="profile"
              accept="image/*"
              onChange={AvatarChange}
              className="hidden"
            />
          </div>

          <div className="text-center mt-4">
            {" "}
            
            <b className="text-lg block">{ProfileDetails.name}</b>
            <span className="text-sm text-gray-600 block">{Details.email}</span>
            <span className="text-sm text-gray-600 block">{Details.phone}</span>
          </div>
        </div>

        <div className="border rounded-lg divide-y divide-gray-200 mb-6 mx-4">
          {" "}
          
          <div className="p-3 flex items-center">
            {" "}
            
            {image ? (
              <ProfileTickIcon
                width="20"
                height="20"
                className="text-green-500 mr-2"
              />
            ) : (
              <ProfileCancelIcon
                width="20"
                height="20"
                className="text-red-500 mr-2"
              />
            )}{" "}
            Profile
          </div>
          <div className="p-3 flex items-center">
            <ProfileTickIcon
              width="20"
              height="20"
              className="text-green-500 mr-2"
            />{" "}
            Contact Number
          </div>
          <div className="p-3 flex items-center">
            {ProfileDetails.address && ProfileDetails.address.trim() !== "" ? (
              <ProfileTickIcon
                width="20"
                height="20"
                className="text-green-500 mr-2"
              />
            ) : (
              <ProfileCancelIcon
                width="20"
                height="20"
                className="text-red-500 mr-2"
              />
            )}{" "}
            Address
          </div>
        </div>

        <div className="flex flex-col mt-auto mx-4">
          {" "}
          
          <Link
            to="/PaymentHistory"
            className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-md text-center mb-2"
          >
            Payment History
          </Link>
          <button
            onClick={Logout}
            className="bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md w-[68%] p-4 flex flex-col">
        <div className="text-center mb-4">
          <h2 className="m-2 text-2xl font-semibold">MY ACCOUNT</h2>
        </div>

        
        <div className="mb-4">
          <h2 className="border-b-2 border-gray-300 m-2 pb-1 text-xl font-semibold">
            Account Details
          </h2>
          <div className="flex flex-wrap">
            <div className="w-full sm:w-1/2 p-2 flex flex-col">
              <b className="mb-2">Email:</b>
              <input
                type="email"
                name="email"
                value={ProfileDetails.email}
                onChange={ProfileChange}
                placeholder="Email Address"
                required
                autoComplete="off"
                readOnly
                className="w-3/4 sm:w-full p-2 m-1 border border-gray-300 rounded"
              />
              {Ack ? (
                <span className="text-red-500 m-1">{Errmsg.email}</span>
              ) : (
                <span className="text-red-500 m-1">{Errmsg.email}</span>
              )}
            </div>

            <div className="w-full sm:w-1/2 p-2 flex flex-col">
              <b className="mb-2">Contact Number:</b>
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
                className="w-3/4 sm:w-full p-2 m-1 border border-gray-300 rounded"
              />
              {Ack ? (
                <span className="text-red-500 m-1">{Errmsg.phone}</span>
              ) : (
                <span className="text-red-500 m-1">{Errmsg.phone}</span>
              )}
            </div>
          </div>
        </div>

        
        <div className="mb-4">
          <h2 className="border-b-2 border-gray-300 m-2 pb-1 text-xl font-semibold">
            Personal Details
          </h2>
          <div className="flex flex-wrap">
            <div className="w-full sm:w-1/2 p-2 flex flex-col">
              <b className="mb-2">Name:</b>
              <input
                type="text"
                name="name"
                value={ProfileDetails.name}
                readOnly
                className="w-3/4 sm:w-full p-2 m-1 border border-gray-300 rounded"
              />
            </div>
            <div className="w-full sm:w-1/2 p-2 flex flex-col">
              <b className="mb-2">Gender:</b>
              <Select
                placeholder="Choose your gender "
                value={
                  ProfileDetails.gender === ""
                    ? "Prefer Not to say"
                    : ProfileDetails.gender
                }
                style={{
                  width: 200,
                  margin: "2%",
                }}
                options={Gender}
                onChange={GenderChange}
              />
            </div>
          </div>
        </div>

        
        <div className="mb-4">
          <h2 className="border-b-2 border-gray-300 m-2 pb-1 text-xl font-semibold">
            Location Details
          </h2>
          <div className="m-2">
            <p>Please share your current address for optimized experience</p>
          </div>
          <div className="flex flex-wrap">
            <div className="w-full sm:w-1/2 p-2 flex flex-col">
              <b className="mb-2">Address</b>
              <textarea
                name="address"
                onChange={ProfileChange}
                placeholder="Permanant Residential Address"
                value={ProfileDetails.address}
                className="w-4/5 sm:w-full p-2 m-1 border border-gray-300 rounded h-[15vh] resize-none overflow-y-auto"
              ></textarea>
            </div>
            <div className="w-full sm:w-1/2 p-2 flex flex-col">
              <b className="mb-2">City</b>
              <Select
                showSearch
                value={ProfileDetails.location}
                placeholder="Choose your city"
                onChange={CityChange}
                filterOption={filterOption}
                options={CityData}
                size="large"
                style={{
                  margin: "2%",
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={ValidateForm}
            className="bg-green-500 hover:bg-green-600 text-white w-[20%] p-2 transition duration-500"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
