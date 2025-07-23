import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Button from './Button';
import InputField from './InputField';
import Modal from './Modal';

const AdminDashboard = () => {
    const { user, authToken } = useAuth();
    const [adminData, setAdminData] = useState('Loading admin data...');
    const [uidToSetAdmin, setUidToSetAdmin] = useState(''); // For setting admin claims
    const [notificationMessage, setNotificationMessage] = useState(''); // For custom notification
    const [selectedUserForNotification, setSelectedUserForNotification] = useState(null); // UID of user to notify
    const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '', type: 'info' });

    // Mock users for demonstration. In a real app, you'd fetch these from a database.
    const mockUsers = [
        { uid: 'mockuser1_uid', email: 'user1@example.com' },
        { uid: 'mockuser2_uid', email: 'user2@example.com' },
        { uid: 'mockuser3_uid', email: 'user3@example.com' },
        { uid: user?.uid, email: user?.email + " (You)"} // Include current admin
    ].filter(u => u.uid); // Filter out null if user is not available yet

    useEffect(() => {
        const fetchAdminData = async () => {
            if (!authToken) {
                setAdminData('Not authenticated or not an admin.');
                return;
            }
            try {
                const response = await fetch('http://localhost:8080/admin/dashboard', {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.text();
                setAdminData(data);
            } catch (error) {
                console.error("Error fetching admin data:", error);
                setModalInfo({ show: true, title: 'Error', message: `Failed to fetch admin data: ${error.message}`, type: 'error' });
                setAdminData(`Failed to fetch admin data.`);
            }
        };
        fetchAdminData();
    }, [authToken]);

    const handleSetAdminClaim = async () => {
        if (!authToken || !uidToSetAdmin) {
            setModalInfo({ show: true, title: 'Error', message: 'Authentication token and UID are required.', type: 'error' });
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/auth/set-admin-claim', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ uid: uidToSetAdmin })
            });

            const result = await response.text();
            if (!response.ok) {
                throw new Error(result || `HTTP error! Status: ${response.status}`);
            }
            setModalInfo({ show: true, title: 'Success', message: `Successfully set admin claim for UID: ${uidToSetAdmin}. User's tokens revoked. They need to log in again.`, type: 'success' });
            setUidToSetAdmin(''); // Clear input
        } catch (error) {
            console.error("Error setting admin claim:", error);
            setModalInfo({ show: true, title: 'Error', message: `Failed to set admin claim: ${error.message}`, type: 'error' });
        }
    };

    const handleNotifyUserClick = (userUid) => {
        setSelectedUserForNotification(userUid);
        setNotificationMessage(''); // Clear previous message
        setModalInfo({ show: true, title: `Notify User: ${userUid}`, message: '', type: 'prompt' });
    };

    const sendNotification = async () => {
        if (!authToken || !selectedUserForNotification || !notificationMessage) {
            setModalInfo({ show: true, title: 'Error', message: 'Authentication token, target user, and message are required.', type: 'error' });
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/notifications/send-custom-notification', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    targetUid: selectedUserForNotification,
                    message: notificationMessage
                })
            });

            const result = await response.text();
            if (!response.ok) {
                throw new Error(result || `HTTP error! Status: ${response.status}`);
            }
            setModalInfo({ show: true, title: 'Notification Sent', message: `Notification successfully sent to user: ${selectedUserForNotification}`, type: 'success' });
            setSelectedUserForNotification(null); // Reset
            setNotificationMessage(''); // Reset
        } catch (error) {
            console.error("Error sending notification:", error);
            setModalInfo({ show: true, title: 'Notification Error', message: `Failed to send notification: ${error.message}`, type: 'error' });
        }
    };

    const closeModal = () => {
        setModalInfo({ show: false, title: '', message: '', type: 'info' });
        if (modalInfo.type === 'prompt') { // If it was a notification prompt, clear selection
            setSelectedUserForNotification(null);
            setNotificationMessage('');
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
            {user && (
                <p className="text-lg text-gray-700 mb-4">
                    Welcome, Admin <span className="font-semibold text-indigo-600">{user.email}</span>!
                    <br/>Your UID: <span className="font-mono text-sm">{user.uid}</span>
                </p>
            )}
            <p className="text-gray-600 mb-6">{adminData}</p>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Manage User Roles</h3>
                <p className="text-sm text-gray-500 mb-4">
                    (Use this to set an admin claim for a user. The user will need to log out and log back in for changes to take effect.)
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                    <InputField
                        type="text"
                        placeholder="User UID to make admin"
                        value={uidToSetAdmin}
                        onChange={(e) => setUidToSetAdmin(e.target.value)}
                        className="flex-grow"
                    />
                    <Button onClick={handleSetAdminClaim}>
                        Set Admin Claim
                    </Button>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Send Custom Notifications</h3>
                <p className="text-sm text-gray-500 mb-4">
                    (Click "Notify Me" next to a user to send a custom push notification.
                    For this demo, mock UIDs are used. In a real app, these would be fetched from your database.)
                </p>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">User Email (Mock)</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">User UID (Mock)</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockUsers.map((mockUser, index) => (
                                <tr key={mockUser.uid} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="py-3 px-4 text-gray-800">{mockUser.email}</td>
                                    <td className="py-3 px-4 font-mono text-sm text-gray-600">{mockUser.uid}</td>
                                    <td className="py-3 px-4">
                                        <Button
                                            onClick={() => handleNotifyUserClick(mockUser.uid)}
                                            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700"
                                        >
                                            Notify Me
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {modalInfo.show && (
                modalInfo.type === 'prompt' ? (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full text-center">
                            <h3 className="text-xl font-semibold mb-4">Notify User: {selectedUserForNotification}</h3>
                            <textarea
                                className="w-full h-24 p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Enter notification message..."
                                value={notificationMessage}
                                onChange={(e) => setNotificationMessage(e.target.value)}
                            ></textarea>
                            <div className="flex justify-center gap-4">
                                <Button onClick={sendNotification} className="bg-green-600 hover:bg-green-700">
                                    Send Notification
                                </Button>
                                <Button onClick={closeModal} className="bg-gray-500 hover:bg-gray-600">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Modal
                        title={modalInfo.title}
                        message={modalInfo.message}
                        onClose={closeModal}
                        type={modalInfo.type}
                    />
                )
            )}
        </div>
    );
};

export default AdminDashboard;
