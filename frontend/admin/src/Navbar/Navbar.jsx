//React
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
//import { signOut } from "firebase/auth";
//import auth from "../Config/firebase";

//Antd-Framework
import { BarChartOutlined, LogoutOutlined, PlusSquareOutlined, HistoryOutlined, CommentOutlined, TeamOutlined, CustomerServiceOutlined } from '@ant-design/icons';

//Images
import Logo from '../Images/Logo.png';

const Navbar = () => {
    const location = useLocation();
    const Navigate = useNavigate();

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    return (
      <aside className="bg-[#222] text-white w-[25%] md:w-[15%] lg:w-[20%] h-full min-h-screen min-w-[258px] flex flex-col">
            <div className="flex items-center py-4 px-6">
                <img src={Logo} alt="Company Logo" className="h-12 w-auto mr-4" />
                <h2 className="text-xl font-semibold">RentnRide</h2>
            </div>

            <div className="flex-grow flex flex-col justify-between items-start py-8 px-6">
                <div>
                    <Link
                        to="/Dashboard"
                        className={`flex items-center py-2 px-4 text-lg hover:bg-gray-700 transition-colors duration-200 rounded-lg ${isActiveLink("/Dashboard") ? 'bg-gray-700' : ''}`}
                    >
                        <BarChartOutlined className="mr-2 text-xl" />
                        Dashboard
                    </Link>
                    <Link
                        to="/Add"
                        className={`flex items-center py-2 px-4 mt-2 text-lg hover:bg-gray-700 transition-colors duration-200 rounded-lg ${isActiveLink("/Add") ? 'bg-gray-700' : ''}`}
                    >
                        <PlusSquareOutlined className="mr-2 text-xl rotate-180" />
                        Vehicle Metadata
                    </Link>
                    <Link
                        to="/RentalHistory"
                        className={`flex items-center py-2 px-4 mt-2 text-lg hover:bg-gray-700 transition-colors duration-200 rounded-lg ${isActiveLink("/RentalHistory") ? 'bg-gray-700' : ''}`}
                    >
                        
                         <PlusSquareOutlined className="mr-2 text-xl rotate-180" />
                        Rental History
                    </Link>
                    <Link
                        to="/ActiveRentals"
                        className={`flex items-center py-2 px-4 mt-2 text-lg hover:bg-gray-700 transition-colors duration-200 rounded-lg ${isActiveLink("/ActiveRentals") ? 'bg-gray-700' : ''}`}
                    >
                        
                         <PlusSquareOutlined className="mr-2 text-xl rotate-180" />
                        Active Rentals
                    </Link>
                    <Link
                        to="/ReviewModeration" 
                        className={`flex items-center py-2 px-4 mt-2 text-lg hover:bg-gray-700 transition-colors duration-200 rounded-lg ${isActiveLink("/ReviewModeration") ? 'bg-gray-700' : ''}`}
                    >
                        <CommentOutlined className="mr-2 text-xl" />
                        Review Moderation
                    </Link>
                    <Link
                        to="/UserList"
                        className={`flex items-center py-2 px-4 mt-2 text-lg hover:bg-gray-700 transition-colors duration-200 rounded-lg ${isActiveLink("/UserList") ? 'bg-gray-700' : ''}`}
                    >
                    <TeamOutlined className="mr-2 text-xl" /> 
                        User List
                    </Link>
                    <Link
                to="/CustomerSupport"
                className={`flex items-center py-2 px-4 mt-2 text-lg hover:bg-gray-700 transition-colors duration-200 rounded-lg ${isActiveLink("/CustomerSupport") ? 'bg-gray-700' : ''}`}
            >
                <CustomerServiceOutlined className="mr-2 text-xl" />
                 Support
            </Link>
            <Link
                    to="/PaymentHistory"
                    className={`flex items-center py-2 px-4 mt-2 text-lg hover:bg-gray-700 transition-colors duration-200 rounded-lg ${isActiveLink("/PaymentHistory") ? 'bg-gray-700' : ''}`}
                >
                    <HistoryOutlined className="mr-2 text-xl" />
                    Payment History
                </Link>
                </div>
                <div>
                    <button
                        onClick={() => {
                            sessionStorage.removeItem("userAuth");
                            Navigate("/");
                        }}
                        className="flex items-center w-full py-2 px-4 mt-2 text-lg hover:bg-red-600 transition-colors duration-200 rounded-lg"
                    >
                        <LogoutOutlined className="mr-2 text-xl" />
                        Logout
                    </button>
                </div>
            </div>
        
        </aside>
    );
};

export default Navbar;