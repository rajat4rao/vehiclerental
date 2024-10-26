import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useSelector } from 'react-redux'; 


const PaymentHistory = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const user = useSelector((state) => state.user); 
    const uid = user.uid;          

    useEffect(() => {
        const fetchPaymentHistory = async () => {
            if (uid) { 
                try {
                    const response = await axios.get(`/payment-history/${uid}`);
                    setPaymentHistory(response.data);
                } catch (error) {
                    console.error("Error fetching payment history:", error);
                    
                }
            }
        };

        fetchPaymentHistory();
    }, [uid]); 

    return (
        <div>
          <h2>Payment History</h2>
          
          <ul>
            {paymentHistory.map((payment) => (
              <li key={payment._id}>
                <p>Car Number: {payment.car_no}</p> 
                <p>Amount: {payment.amount} {payment.currency}</p>
                <p>Date: {new Date(payment.payment_date).toLocaleDateString()}</p>
                
              </li>
            ))}

           {paymentHistory && paymentHistory.length===0 && <p>No Payment history found</p>}
          </ul>
        </div>
      );
};


export default PaymentHistory;