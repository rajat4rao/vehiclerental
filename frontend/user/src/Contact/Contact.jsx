//Contact.jsx
import Navbar from '../Navbar/Navbar'
import Footer from '../Home/Footer/Footer'
import Loading from '../Loading/Loading'
import { MailFilled, EnvironmentFilled, FieldTimeOutlined, PhoneFilled } from '@ant-design/icons'
import { Breadcrumb, ConfigProvider, notification } from 'antd'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from '../api/axios'
import { useNavigate } from 'react-router-dom'

const Contact = () => {
    const user = useSelector((state) => state.user)
    const Navigate = useNavigate()
    const [Message, SetMessage] = useState({ uid: `${user.uid}`, subject: '', message: '' })
    const [loading, Setloading] = useState(true)
    const [Details, SetDetails] = useState()
    const [Errmsg, SetErrmsg] = useState()
    const [api, contextHolder] = notification.useNotification();

    const openNotification = (message, type) => {
        api[type]({
            message: message,
            placement: "topRight",
            duration: 2,
        });
    };

    const getUserDetails = async (uid) => {
        const { data } = await axios.post('/FindNameandEmail', { uid })
        SetDetails(data)
        Setloading(false)
    }

    useEffect(() => {
        getUserDetails(user.uid)
    }, [])

    const handleChange = (e) => {
        SetMessage((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const ValidateForm = () => {
        if (user.isAuth) {
            if (Message.subject === '' || Message.message === '') {
                SetErrmsg('Fill all the fields')
            } else {
                SetErrmsg('')
                SendMessage()
            }
        } else {
            openNotification('Login to send message', 'warning')
        }
    }

    const SendMessage = async () => {
        try {
            const { data } = await axios.post('/ContactUs', Message)
            if (data.action) {
                openNotification('Message sent, We will contact back you soon', 'success')
                SetMessage({ uid: user.uid, subject: '', message: '' })
            } else {
                openNotification('Failed to send message. Please try again later.', 'error');
            }
        } catch (error) {
            console.error("Error sending message:", error);
            openNotification('Failed to send message. Please try again later.', 'error');
        }
    }


    const BackToHome = () => {
        Navigate('/')
    }

    if (loading) {
        return <Loading />
    }

    return (
        <>
            <Navbar />
            <div className="bg-gray-100">
                

                <div className="container mx-auto py-8 px-4">
                    <div className="bg-white rounded-lg shadow p-8 md:w-1/2 mx-auto">
                        <h2 className="text-2xl font-bold mb-4">Send Message</h2>
                        <div className="mb-4">
                            <input
                                type="text"
                                value={Details.name}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="email"
                                value={Details.email}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={Message.subject}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <textarea
                                name="message"
                                placeholder="Message for us"
                                cols="20"
                                rows="5"
                                value={Message.message}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                              <p className="text-red-500 mt-2 ml-2">{Errmsg}</p>
                        </div>
                        <button onClick={ValidateForm} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">Send Us</button>
                    </div>
                </div>
                {contextHolder}
            </div>
            <Footer />
        </>
    );
}

export default Contact;