import { BrowserRouter,Route,Routes } from "react-router-dom";
import { Provider } from 'react-redux';
import Store from "./store/Store";

import SignUp from "./SignUp/SignUp";
import Container from "./Container";
import Login from "./Login/Login";
import Carlist from "./CarList/Carlist"
import Pay from "./Payment/pay";
import ViewBooking from "./ViewBookings/ViewBooking";
import ReviewForm from "./ReviewForm/ReviewForm";
import Error from "./Error/Error";
import TermsConditions from "./Terms&Conditions/Terms&Conditions";
import PasswordReset from "./PasswordReset/PasswordReset";
import Profile from "./Profile/Profile";
import Contact from './Contact/Contact'
import PaymentHistoryPage from "./Payment/PaymentHistoryPage";


import "./App.css"

  

const App=()=>
{
  return(
  <Provider store={Store}>
    <Container  >
      <BrowserRouter>
        <Routes>
          <Route path="/"  >
            <Route index element={<Carlist/>}/>
            <Route path="Login" element={<Login/>} />
            <Route path="SignUp" element={<SignUp/>}/>
            <Route path="forgotPassword" element={<PasswordReset/>}/>
            <Route path="ViewBooking" element={<ViewBooking/>}/>
            <Route path="ReviewForm" element={<ReviewForm/>}/>
            <Route path="Pay" element={<Pay/>}/>
            <Route path="PaymentHistory" element={<PaymentHistoryPage/>}/>
            <Route path="Profile" element={<Profile/>}/>
            <Route path="Contact" element={<Contact/>}/>
            <Route path="Terms&Conditions" element={<TermsConditions/>}/>
            
            <Route path="*" element={<Error/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </Container>
  </Provider>

  );
}

export default App;