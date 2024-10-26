import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Pagination, Button, message } from 'antd';
import Navbar from '../Navbar/Navbar'


const CustomerSupport = () => {
    const [messages, setMessages] = useState([]);
    const [statusFilter, setStatusFilter] = useState('open');
    const [currentPage, setCurrentPage] = useState(1);
    const [messagesPerPage] = useState(5);


    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`/contactMessages?status=${statusFilter}&page=${currentPage}&limit=${messagesPerPage}`);
                setMessages(response.data.messages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [statusFilter, currentPage]);



    const handleStatusChange = (status) => {
        setCurrentPage(1); 
        setStatusFilter(status);
    };


    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);


    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleStatusUpdate = async (messageId, newStatus) => {
        try {
            await axios.patch(`/contactMessages/${messageId}`, { status: newStatus });
            message.success('Status updated successfully!'); 
             const updatedMessages = messages.map((msg) =>
                 msg._id === messageId ? { ...msg, status: newStatus } : msg
             );
             setMessages(updatedMessages);
        } catch (error) {
            console.error("Error updating status:", error);
            message.error('Failed to update status.'); 
        }
    };

    return (
        <div className="flex h-screen">
            <Navbar/>

             <div className="bg-gray-100 flex-grow overflow-y-auto">
                    <div className="p-6">
                    <div className="flex space-x-4">
                            <button
                                onClick={() => handleStatusChange('open')}
                                className={`px-4 py-2 rounded-lg ${statusFilter === 'open' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Open
                            </button>
                            <button
                                onClick={() => handleStatusChange('inprogress')}
                                className={`px-4 py-2 rounded-lg ${statusFilter === 'inprogress' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                In Progress
                            </button>
                            <button
                                onClick={() => handleStatusChange('closed')}
                                className={`px-4 py-2 rounded-lg ${statusFilter === 'closed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            >
                                Closed
                            </button>
                        </div>
                        <div className="mt-6">
                        {currentMessages.map((msg) => (
    <div key={msg._id} className="border-b border-gray-200 p-4">
        <div className="flex justify-between items-center mb-2">
            <p className="font-medium">Subject: {msg.subject}</p>
            <span className={`px-2 py-1 rounded text-xs font-medium ${msg.status === 'open' ? 'bg-blue-100 text-blue-800' : msg.status === 'inprogress' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {msg.status}
            </span>
        </div>
        <p className="text-gray-700 mb-4">{msg.message}</p>

           <div className="flex space-x-2"> 
                                        <Button
                                            onClick={() => handleStatusUpdate(msg._id, 'inprogress')}
                                            disabled={msg.status !== 'open'}
                                            size="small"
                                            >
                                            Mark In Progress
                                        </Button>
                                        <Button
                                            onClick={() => handleStatusUpdate(msg._id, 'closed')}
                                            disabled={msg.status === 'closed'}
                                            size="small"
                                            >
                                            Close
                                        </Button>
                                    </div>
    </div>
))}

                        </div>
                    </div>
             </div>

        </div>
    );

};

export default CustomerSupport;