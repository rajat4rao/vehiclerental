//React
import axios from "../api/axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//Modules
import Navbar from "../Navbar/Navbar";
import Footer from "../Home/Footer/Footer";

//Antd-Framework
import { ConfigProvider, notification } from "antd";

//Images
import SignUpImage from "../Images/SignUp/SignUpImage.jpg";

const SignUp = () => {
  const [formdata, Setformdata] = useState({
    uid: "",
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    phone: "",
    location: "",
  });
  const [Ack, SetAck] = useState(false);
  const [Errmsg, SetErr] = useState({
    email: "",
    password: "",
    confirmpassword: "",
    name: "",
    phone: "",
    location: "",
  });

  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (message) => {
    message.includes("registered")
      ? api.warning({
          message: message,
          placement: "topRight",
          duration: 2,
          style: {
            background: "#EED202	",
          },
        })
      : api.success({
          message: message,
          placement: "topRight",
          duration: 2,
          style: {
            background: "#5cb85c	",
          },
        });
  };

  const ValidateForm = () => {
    if (formdata.email.trim() === "" || formdata.email === null) {
      SetErr((prev) => {
        return { ...prev, email: "Enter your email" };
      });
      SetAck(true);
    } else {
      SetErr((prev) => {
        return { ...prev, email: "" };
      });
      SetAck(false);
    }

    if (formdata.password.trim() === "" || formdata.password === null) {
      SetErr((prev) => {
        return { ...prev, password: "Enter your password" };
      });
      SetAck(true);
    } else if (formdata.password.length < 6) {
      SetErr((prev) => {
        return {
          ...prev,
          password: "Password must contain minimum of 6 length",
        };
      });
    } else {
      SetErr((prev) => {
        return { ...prev, password: "" };
      });
      SetAck(false);
    }

    if (formdata.confirmpassword === "") {
      SetErr((prev) => {
        return { ...prev, confirmpassword: "Enter your password" };
      });
      SetAck(true);
    } else if (formdata.password.trim() !== formdata.confirmpassword) {
      SetErr((prev) => {
        return { ...prev, confirmpassword: "Password do not match" };
      });
      SetAck(true);
    } else {
      SetErr((prev) => {
        return { ...prev, confirmpassword: "" };
      });
      SetAck(false);
    }

    if (formdata.name.trim() === "" || formdata.name == null) {
      SetErr((prev) => {
        return { ...prev, name: "Enter your name" };
      });
      SetAck(true);
    } else {
      SetErr((prev) => {
        return { ...prev, name: "" };
      });
      SetAck(false);
    }

    if (formdata.phone.trim() === "" || formdata.phone == null) {
      SetErr((prev) => {
        return { ...prev, phone: "Enter your phone number" };
      });
      SetAck(true);
    } else if (formdata.phone.length != 10) {
      SetErr((prev) => {
        return { ...prev, phone: "Enter valid phone number" };
      });
      SetAck(true);
    } else {
      SetErr((prev) => {
        return { ...prev, phone: "" };
      });
      SetAck(false);
    }

    if (formdata.location.trim() === "" || formdata.location === null) {
      SetErr((prev) => {
        return { ...prev, location: "Enter your location" };
      });
      SetAck(true);
    } else {
      SetErr((prev) => {
        return { ...prev, location: "" };
      });
      SetAck(false);
    }
    if (
      formdata.email !== "" &&
      formdata.email != null &&
      formdata.password.length >= 6 &&
      formdata.password === formdata.confirmpassword &&
      formdata.password !== "" &&
      formdata.password !== null &&
      formdata.name != "" &&
      formdata.name != null &&
      formdata.phone != "" &&
      formdata.phone != null &&
      formdata.phone.length === 10 &&
      formdata.location != "" &&
      formdata.location != null
    ) {
      CreateUser();
    }
  };

  const CreateUser = async () => {
    try {
      if (
        formdata.email != "" &&
        formdata.password != "" &&
        formdata.name != "" &&
        formdata.phone != "" &&
        formdata.location != ""
      ) {
        const { data } = await axios.post("/CreateUser", formdata);
        if (data.action) {
          navigate("/Login");
        } else {
          openNotification(data.status);
        }
      }
    } catch (error) {
      alert(error);
    }
  };

  const SignUpChange = (e) => {
    const { name, value } = e.target;
    Setformdata({ ...formdata, [name]: value.trim() });
  };

  return (
    <>
      <Navbar />
      <ConfigProvider
        theme={{
          token: {
            colorText: "white",
            colorSuccess: "white",
            colorError: "white",
          },
          components: { Notification: { zIndexPopup: 99999 } },
        }}
      >
        {contextHolder}
      </ConfigProvider>
      <div className="w-full h-[70vh] flex flex-col justify-center items-center p-4 min-h-screen">
        <div className="bg-white w-full max-w-md p-8 shadow-md rounded-lg">
          <div className="w-full flex flex-col">
            <div className="w-full text-center mb-8">
              <h1 className="text-3xl font-bold">SignUp</h1>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex flex-row space-x-4">
                <div className="w-full md:w-1/2">
                  <label className="font-bold" htmlFor="">
                    Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    onChange={SignUpChange}
                    placeholder="Name"
                    autoComplete="off"
                    required
                    className="w-full border-2 border-black p-2 mt-2 rounded-md"
                  />
                  {Ack ? (
                    <span className="text-red-500 text-sm">{Errmsg.name}</span>
                  ) : (
                    <span className="text-red-500 text-sm">{Errmsg.name}</span>
                  )}
                </div>

                <div className="w-full md:w-1/2">
                  <label className="font-bold" htmlFor="">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    name="email"
                    onChange={SignUpChange}
                    placeholder="Email Address"
                    required
                    autoComplete="off"
                    className="w-full border-2 border-black p-2 mt-2 rounded-md"
                  />
                  {Ack ? (
                    <span className="text-red-500 text-sm">{Errmsg.email}</span>
                  ) : (
                    <span className="text-red-500 text-sm">{Errmsg.email}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-row space-x-4">
                <div className="w-full md:w-1/2">
                  <label className="font-bold" htmlFor="">
                    Password:
                  </label>
                  <input
                    type="password"
                    name="password"
                    onChange={SignUpChange}
                    placeholder="Password"
                    autoComplete="off"
                    required
                    className="w-full border-2 border-black p-2 mt-2 rounded-md"
                  />
                  {Ack ? (
                    <span className="text-red-500 text-sm">
                      {Errmsg.password}
                    </span>
                  ) : (
                    <span className="text-red-500 text-sm">
                      {Errmsg.password}
                    </span>
                  )}
                </div>

                <div className="w-full md:w-1/2">
                  <label className="font-bold" htmlFor="">
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    name="confirmpassword"
                    onChange={SignUpChange}
                    placeholder="Confirm Password"
                    autoComplete="off"
                    required
                    className="w-full border-2 border-black p-2 mt-2 rounded-md"
                  />
                  {Ack ? (
                    <span className="text-red-500 text-sm">
                      {Errmsg.confirmpassword}
                    </span>
                  ) : (
                    <span className="text-red-500 text-sm">
                      {Errmsg.confirmpassword}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-row space-x-4">
                <div className="w-full md:w-1/2">
                  <label className="font-bold" htmlFor="">
                    Contact No:
                  </label>
                  <input
                    type="number"
                    name="phone"
                    onChange={SignUpChange}
                    minLength={10}
                    maxLength={10}
                    min={0}
                    placeholder="Phone Number"
                    autoComplete="off"
                    required
                    className="w-full border-2 border-black p-2 mt-2 rounded-md"
                  />
                  {Ack ? (
                    <span className="text-red-500 text-sm">{Errmsg.phone}</span>
                  ) : (
                    <span className="text-red-500 text-sm">{Errmsg.phone}</span>
                  )}
                </div>

                <div className="w-full md:w-1/2">
                  <label className="font-bold" htmlFor="">
                    Location:
                  </label>
                  <input
                    type="text"
                    name="location"
                    onChange={SignUpChange}
                    placeholder="Location"
                    autoComplete="off"
                    required
                    className="w-full border-2 border-black p-2 mt-2 rounded-md"
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

              <div className="w-full text-center">
                <button
                  className="bg-gray-800 hover:bg-gray-700 text-white w-1/4 md:w-1/5 p-2 mt-4 rounded-md transition-colors"
                  onClick={ValidateForm}
                >
                  Register
                </button>
                <p className="mt-2 text-sm">
                  Already have an account?{" "}
                  <Link className="font-bold hover:underline" to="/Login">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default SignUp;
