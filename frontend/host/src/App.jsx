import { BrowserRouter,Route,Routes } from "react-router-dom";
import { Provider } from 'react-redux';
import Store from "./store/Store";

//Components

import SignUp from "./SignUp/SignUp";
import Login from "./Login/Login";
import Dashboard from "./Dashboard/Dashboard";
import MyCars from "./MyCars/MyCars";
import Container from "./Container";
import ViewBooking from "./ViewBookings/Viewbooking";
import Profile from "./Profile/Profile";
import PasswordReset from "./PasswordReset/PasswordReset";
import AddCar from "./AddCar/AddCar";
import Error from "./Error/Error"

const App=()=>
{
    return(
      <Provider store={Store}>
        <Container>
        <BrowserRouter>
        <Routes>
          <Route path="/" >
            <Route index element={<Login/>} />
            <Route path="SignUp" element={<SignUp/>}/>
            <Route path="Dashboard" element={<Dashboard/>}/>
            <Route path="MyCars" element={<MyCars/>}/>
            <Route path="ViewBooking" element={<ViewBooking/>}/>
            <Route path="AddCar" element={<AddCar/>}/>
            <Route path="Profile" element={<Profile/>}/>
            <Route path="Forgotpassword" element={<PasswordReset/>}/>
            <Route path="*" element={<Error/>} />
          </Route>
        </Routes>
      </BrowserRouter>
      </Container>
      </Provider>
    );
}

export default App;