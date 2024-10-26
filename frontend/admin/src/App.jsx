// React
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from 'react-redux';
import Store from "./Store/Store";

//Module
import Login from "./Login/Login";
import Container from "./Container";
import Dashboard from "./Dashboard/Dashboard";
import Add from './Add/Add.jsx'
import Error from "./Error/Error";
import RentalHistoryPage from './RentalHistory/RentalHistoryPage'
import ReviewModeration from "./ReviewModeration/ReviewModeration";
import UserList from "./UserList/UserList";
import CustomerSupport from "./CustomerSupport/CustomerSupport";
import PaymentHistory from "./PaymentHistory/PaymentHistory";
import ActiveRentals from "./ActiveRentals/ActiveRentals";


const App = () => {
  return (
    <>
    <Provider store={Store}>
    <Container  >
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/Dashboard" element={<Dashboard/>}/>
          <Route path="/Add" element={<Add/>}/>
          <Route path="/RentalHistory" element={<RentalHistoryPage />} /> 
          <Route path="/ReviewModeration" element={<ReviewModeration />} />
          <Route path="/UserList" element={<UserList />} />
          <Route path="/CustomerSupport" element={<CustomerSupport />} />
          <Route path="/PaymentHistory" element={<PaymentHistory />} />
          <Route path="/ActiveRentals" element={<ActiveRentals />} />
          <Route path="*" element={<Error/>}/>
        </Routes>
      </BrowserRouter>
      </Container>
  </Provider>
    </>
  );
};

export default App;
