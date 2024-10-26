//React 
import { useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

//Antd-Framework
import { MailFilled, EnvironmentFilled, PhoneFilled } from '@ant-design/icons'
import { Tooltip, notification, ConfigProvider } from "antd"

//CustomSVGIcons
import { InstagramIcon, LinkedInIcon, GithubIcon, HeartIcon } from "../../SVGIcons/SvgComponent"

//Images
import Logo from '../../Images/Logo/Logo.png'

const Footer = () => {
    const [Email, SetEmail] = useState('')
    const [api, contextHolder] = notification.useNotification();
    const user = useSelector((state) => state.user)

    const openNotification = (message) => {
        message.includes('Subscribed') ? (
            api.success({
                message: message,
                placement: "bottomRight",
                duration: 2,
                style: {
                    background: "#5cb85c",
                }
            })
        ) : (
            api.error({
                message: message,
                placement: "bottomRight",
                duration: 3,
                style: {
                    background: "rgb(223, 67, 67)",
                }
            })
        )
    };

    const Subscribe = () => {
        if (Email === '') {
            openNotification("Enter your email")
        } else if (!Email.includes('@gmail.com')) {
            openNotification("Enter a valid email")
        } else {
            openNotification("You're Subscribed!")
        }
    }

    return (
        <ConfigProvider 
            theme={{
                token: {
                    colorText: "white",
                    colorSuccess: "white",
                    colorError: "white"
                },
            }}>
            {contextHolder}
            <footer className="bg-[#222] text-white w-full mt-auto"> 
                <div className="Footer-Copyright text-center py-2 border-t border-gray-700"> 
                    <p className="text-sm">Copyright ©2025 All rights reserved</p> 
                </div>
            </footer>
        </ConfigProvider>
    )
}

export default Footer