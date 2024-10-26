//Firebase 
import auth from "../config/firebase";
import { signOut } from "firebase/auth";

//Slice
import { SignOutDetails } from "../Slice/userSlice";

//React 
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";

//Images
import Logo from '../Images/Logo/Logo.png'


const Navbar = () => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const location = useLocation();

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    const Logout = () => {
        signOut(auth);
        dispatch(SignOutDetails())
        navigate("/")
    }


    return (
        <nav className="bg-gray-800 text-white sticky top-0 z-50">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
                <div className="flex items-center cursor-pointer" onClick={() => { navigate('/') }}>
                    <img src={Logo} alt="Company Logo" className="h-10 w-auto mr-3 md:mr-5" />
                    <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">RentnRide</span>
                </div>
                <div className="w-full md:block md:w-auto">
                    <ul className="flex flex-col p-4 mt-4 bg-gray-800 rounded-lg border border-gray-700 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-gray-800">
                        <li>
                            <Link to="/" className={`block py-2 pr-4 pl-3 md:p-0 ${isActiveLink('/') ? 'border-b-2 border-gold-500' : ''} hover:border-b-2 hover:border-gold-500 transition-all duration-300`}>Book a Car</Link>
                        </li>
                        
                        {user.isAuth ? (
                            <>
                                <li>
                            <Link to="/Contact" className={`block py-2 pr-4 pl-3 md:p-0 ${isActiveLink('/Contact') ? 'border-b-2 border-gold-500' : ''} hover:border-b-2 hover:border-gold-500 transition-all duration-300`}>Contact</Link>
                        </li>
                                <li>
                                    <Link to='/ViewBooking' className={`block py-2 pr-4 pl-3 md:p-0 ${isActiveLink('/ViewBooking') ? 'border-b-2 border-gold-500' : ''} hover:border-b-2 hover:border-gold-500 transition-all duration-300`}>View Booking</Link>
                                </li>
                                <li>
                                    <Link to='/Profile' className={`block py-2 pr-4 pl-3 md:p-0 ${isActiveLink('/Profile') ? 'border-b-2 border-gold-500' : ''} hover:border-b-2 hover:border-gold-500 transition-all duration-300`}>Profile</Link>
                                </li>
                                <li>
                                    <button onClick={Logout} className="block py-2 pr-4 pl-3 md:p-0 hover:border-b-2 hover:border-gold-500 transition-all duration-300">Logout</button>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <Link to="/Login" className={`block py-2 pr-4 pl-3 md:p-0 ${isActiveLink('/Login') ? 'border-b-2 border-gold-500' : ''} hover:border-b-2 hover:border-gold-500 transition-all duration-300`}>Login</Link>
                                </li>
                                <li>
                                    <Link to="/SignUp" className={`block py-2 pr-4 pl-3 md:p-0 ${isActiveLink('/SignUp') ? 'border-b-2 border-gold-500' : ''} hover:border-b-2 hover:border-gold-500 transition-all duration-300`}>SignUp</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;