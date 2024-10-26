import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Navbar from '../Navbar/Navbar';
import { Table, Button, Popconfirm, message } from 'antd'; // Import Ant Design components


const ReviewModeration = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get('/unmoderated-reviews');
                setReviews(response.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                message.error("Failed to load reviews."); 
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const handleDeleteReview = async (reviewId) => {
        try {
            await axios.delete(`/reviews/${reviewId}`);
            setReviews(reviews.filter(review => review._id !== reviewId));
            message.success("Review deleted successfully.");
        } catch (error) {
            console.error("Error deleting review:", error);
            message.error("Failed to delete review.");
        }
    };


    const handleKeepReview = async (reviewId) => {
        try {
            await axios.patch(`/reviews/${reviewId}`, { moderated: true });
            setReviews(reviews.filter(review => review._id !== reviewId));
            message.success('Review kept and marked as moderated.');
        } catch (error) {
            console.error("Error keeping review:", error);
            message.error("Failed to keep review.");
        }
    };


    const columns = [

        { title: 'Car No', dataIndex: ['cardetails', 'car_no'], key: 'carNo' },
        { title: 'Owner Name', dataIndex: ['sellerdetails', 'name'], key: 'ownerName' },
        { title: 'User Name', dataIndex: ['userdetails', 'name'], key: 'userName' },
        { title: 'Review Text', dataIndex: 'review_text', key: 'reviewText' },
        { title: 'Rating', dataIndex: 'rating', key: 'rating' },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div className="space-x-2">
                    <Popconfirm
                        title="Are you sure to delete this review?"
                        onConfirm={() => handleDeleteReview(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger>Delete</Button>
                    </Popconfirm>
                    <Button type="primary" onClick={() => handleKeepReview(record._id)}>Keep</Button>
                </div>
            ),
        },

    ];



    return (
        <div className="flex h-screen">
            <Navbar />
            <div className="flex-grow p-6 overflow-y-auto"> 
                <h2 className="text-2xl font-semibold mb-4">Review Moderation</h2>
                <Table
                    dataSource={reviews}
                    columns={columns}
                    loading={loading}
                    rowKey="_id"
                />
            </div>
        </div>
    );
};

export default ReviewModeration;