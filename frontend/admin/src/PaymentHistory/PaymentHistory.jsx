import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Table, message } from 'antd';
import Navbar from '../Navbar/Navbar';
import moment from 'moment';


const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    useEffect(() => {
        fetchPayments();
    }, [pagination.current, pagination.pageSize]);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/payment-history', { 
                params: {
                    page: pagination.current,
                    limit: pagination.pageSize,
                },
            });
            setPayments(response.data.payments);
            setPagination(prevPagination => ({
                ...prevPagination,
                total: response.data.total,
            }));
        } catch (error) {
            console.error("Error fetching payment history:", error);
            message.error("Failed to load payment history.");
        } finally {
            setLoading(false);
        }
    };


    const handleTableChange = (newPagination) => {
        setPagination(newPagination);
    };


    const columns = [
        { title: 'User Name', dataIndex: ['userdetails', 'name'], key: 'userName' },
        { title: 'User Email', dataIndex: ['userdetails', 'email'], key: 'userEmail' },
        { title: 'Payment ID', dataIndex: ['_doc', 'payment_intent_id'], key: 'paymentId' },
        { title: 'Car Number', dataIndex: ['_doc', 'car_no'], key: 'carNo' },
        {
            title: 'Start Date',
            dataIndex: ['bookingDetails', 'start_date'],
            key: 'start_date',
        },
        {
            title: 'Drop Date',
            dataIndex: ['bookingDetails', 'drop_date'],
            key: 'drop_date',
        },
        { title: 'Total Amount', dataIndex: ['_doc', 'amount'], key: 'totalAmount', render: amount => `₹${amount}` },
    ];

    return (
        <div className="flex h-screen">
            <Navbar />
            <div className="flex-grow p-6 overflow-y-auto"> 
                <h2 className="text-2xl font-semibold mb-4">Payment History</h2>

                <Table
                    dataSource={payments}
                    columns={columns}
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    rowKey="_id"
                />

            </div>
        </div>
    );
};

export default PaymentHistory;