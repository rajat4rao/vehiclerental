import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useSelector } from 'react-redux';
import { Empty, Button, notification } from 'antd';
import Navbar from '../Navbar/Navbar';
import Footer from '../Home/Footer/Footer';
import Loading from '../Loading/Loading';
import { DownloadOutlined } from '@ant-design/icons';

const PaymentHistoryPage = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
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
                    notification.error({
                        message: "Error",
                        description: "Failed to fetch payment history. Please try again."
                    });
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPaymentHistory();
    }, [uid]);


    const generateInvoice = async (payment) => {
        try {
            const response = await axios.post('/generate-invoice', { payment }, { responseType: 'blob' }); 
            console.log(response);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice_${payment.payment_intent_id}.pdf`; 
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error generating invoice:", error);
            notification.error({
                message: "Error",
                description: "Failed to generate invoice. Please try again."
            });
        }
    };


    if (loading) {
        return <Loading />;
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <Navbar />
            <div className="container mx-auto px-4 py-8 flex-grow">
                <h2 className="text-2xl font-bold mb-4">Payment History</h2>
                {paymentHistory.length > 0 ? (
                    <ul className="space-y-4">
                        {paymentHistory.map((payment) => (
                            <li key={payment._id} className="bg-white rounded-md shadow-md p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <p><strong>Car Number:</strong> {payment.car_no}</p>
                                    <p><strong>Amount:</strong> ₹{payment.amount} {payment.currency}</p>
                                    <p><strong>Date:</strong> {new Date(payment.payment_date).toLocaleDateString()}</p>
                                    <p><strong>Transaction ID:</strong> {payment.payment_intent_id}</p>
                                    <div className="md:col-span-2 mt-4 flex justify-end"> 
                                        <Button
                                            type="primary"
                                            icon={<DownloadOutlined />}
                                            onClick={() => generateInvoice(payment)}
                                        >
                                            Download Invoice
                                        </Button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex justify-center items-center mt-8">
                        <Empty description={<span className="text-gray-500 text-lg">No Payment history found</span>} />
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default PaymentHistoryPage;