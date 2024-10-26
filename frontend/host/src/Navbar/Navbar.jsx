//React 
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

//Antd-Framework 
import { BarChartOutlined, CarOutlined, PhoneOutlined, SettingOutlined, BookOutlined, PlusSquareOutlined, UserOutlined } from '@ant-design/icons'

//Images
import Logo from '../Images/Logo.png'

const Navbar = () => {
    const location = useLocation();
    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    const [isCollapsed, setIsCollapsed] = useState(false);


    return (
        <div className={`bg-gray-900 text-white fixed left-0 h-screen flex flex-col z-50 transition-width duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-[20%] md:w-[15%]'}`}> 
            <div className="w-full h-[20%] flex items-center px-4"> 
                <img src={Logo} alt="Company Logo" className="w-8 h-8 mr-2" /> 
                {!isCollapsed && <h2 className="text-lg font-semibold">RentnRide</h2>} 
            </div>

            <div className="w-full overflow-y-auto"> 
                <ul className="p-0"> 
                    {[
                        { path: '/Dashboard', icon: <BarChartOutlined style={{ fontSize: '20px' }} />, text: "Dashboard" },
                        { path: '/MyCars', icon: <CarOutlined style={{ fontSize: '20px' }} />, text: "My Cars" },
                        { path: '/AddCar', icon: <PlusSquareOutlined style={{ fontSize: '20px' }} />, text: "Add Car" },
                        { path: '/ViewBooking', icon: <BookOutlined style={{ fontSize: '20px' }} />, text: "Bookings" },
                        { path: '/Profile', icon: <UserOutlined style={{ fontSize: '20px' }} />, text: "Settings" },
                    ].map(({ path, icon, text }) => (
                        <li key={path} className="my-1"> 
                            <Link
                                to={path}
                                className={`flex items-center w-full py-3 px-4 hover:bg-gray-800 ${isActiveLink(path) ? 'bg-gray-800' : ''}`}
                            >
                                <span className="mr-2">{icon}</span>
                                {!isCollapsed && <span>{text}</span>} 
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute bottom-4 right-2 p-1 rounded bg-gray-800 hover:bg-gray-700 focus:outline-none">
                {isCollapsed ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6 18V6h12v12H6zm-2 4h16v2H4v-2z"/></svg>}
            </button>
        </div>
    )
}

export default Navbar;