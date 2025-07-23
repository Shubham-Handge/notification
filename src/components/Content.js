import React from 'react';
import { useAuth } from './AuthContext';
import LoginForm from './LoginForm';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import Button from './Button';

const Content = ({ view, setView }) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
        return (
            <div className="text-center text-xl text-gray-600">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4 mx-auto"></div>
                Loading authentication state...
            </div>
        );
    }

    if (user) {
        if (isAdmin) {
            return <AdminDashboard />;
        } else {
            return <UserDashboard />;
        }
    }

    switch (view) {
        case 'userLogin':
            return <LoginForm onLoginSuccess={() => setView('userDashboard')} />;
        case 'adminLogin':
            return <LoginForm onLoginSuccess={() => setView('adminDashboard')} isForAdmin={true} />;
        case 'home':
        default:
            return (
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome!</h2>
                    <p className="text-lg text-gray-700 mb-8">
                        Please log in as a user or an admin to access the application.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={() => setView('userLogin')}>User Login</Button>
                        <Button onClick={() => setView('adminLogin')}>Admin Login</Button>
                    </div>
                </div>
            );
    }
};

export default Content;
