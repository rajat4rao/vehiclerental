import Navbar from '../Navbar/Navbar';
import Banner from './Banner/Banner'
import About from "./About/About";
import Why from "./Why/Why";
import LuxuryFleet from "./LuxuryFleets/LuxuryFleets";
import GeneralReview from "./GeneralReview/GeneralReview";
import Pack from "./Pack/Pack";
import Footer from './Footer/Footer';


const Home=()=>
{
    return(
        <>
            <Navbar/>
            <Banner/>
            <About/>
            <Why/>  
            <LuxuryFleet/>
            <GeneralReview/>
            <Pack/>
            <Footer/>
        </>
    )
}

export default Home;