import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { DatePicker, Button, Table, notification } from 'antd';
import moment from 'moment';
import Navbar from '../Navbar/Navbar';

const { RangePicker } = DatePicker;

const ActiveRentals = () => {
    const [rentalHistory, setRentalHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    useEffect(() => {
        const fetchInitialData = async () => {
            await fetchData();
        };
        fetchInitialData();
    }, []);

    const fetchData = async (params = {}) => {
        setLoading(true);
        try {
            const response = await axios.get('/active-rentals', {
                params: {
                    page: pagination.current,
                    pageSize: pagination.pageSize,
                    ...params,
                },
            });
            setRentalHistory(response.data.rentalHistory);
            if (response.data.totalCount !== undefined) {
                setPagination(prevPagination => ({
                    ...prevPagination,
                    total: response.data.totalCount,
                }));
            }
        } catch (error) {

            console.error("Error fetching rental history:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (pagination.current > 1 || pagination.pageSize !== 10) {
            fetchData();
        }
    }, [pagination]);

    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination);
    };

    const columns = [
        { title: 'User', dataIndex: ['userdetails', 'name'], key: 'user' },
        { title: 'Host', dataIndex: ['sellerdetails', 'name'], key: 'host' },
        { title: 'Location', dataIndex: ['cardetails', 'location'], key: 'location' },
        { title: 'Car Number', dataIndex: 'car_no', key: 'carNumber' }, 
        {
            title: 'Start Date',
            dataIndex: 'start_date',
            key: 'startDate',
            render: (date) => moment(date).format('YYYY-MM-DD'),
        },
        {
            title: 'Drop Date',
            dataIndex: 'drop_date',
            key: 'endDate',
            render: (date) => moment(date).format('YYYY-MM-DD'),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: amount => `₹${amount}`,
        },
    ];


    return (
        <div className="flex h-screen bg-gray-100"> 
            <Navbar />
            <div className="flex-grow p-6 overflow-y-auto"> 
                <h2 className="text-2xl font-semibold mb-4">Rental History</h2>

                
                <Table
                    dataSource={rentalHistory}
                    columns={columns}
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    className="ant-table-striped ant-table-bordered"
                    size="middle"
                />

            </div>
        </div>
    );
};

export default ActiveRentals;