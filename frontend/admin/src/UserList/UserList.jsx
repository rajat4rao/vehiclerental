import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Navbar from '../Navbar/Navbar';
import { Table, message } from 'antd';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10, // Initial page size
        total: 0, // Initialize total to 0
    });



    useEffect(() => {
        fetchUsers();
    }, [pagination.current, pagination.pageSize]); 


    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/user-list', {
                params: {
                    page: pagination.current,
                    limit: pagination.pageSize,
                },
            });

            setUsers(response.data.users);
            setPagination(prevPagination => ({
                ...prevPagination,
                total: response.data.total, 
            }));

        } catch (error) {
            console.error("Error fetching users:", error);
            message.error("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (newPagination) => {
        setPagination(newPagination);
    };

    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Phone', dataIndex: 'phone', key: 'phone' },
        
    ];

    return (
        <div className="flex h-screen">
            <Navbar />
            <div className="flex-grow p-6 overflow-y-auto">
                <h2 className="text-2xl font-semibold mb-4">User List</h2>
                <Table
                    dataSource={users}
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


export default UserList;