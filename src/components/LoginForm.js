import React, { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import InputField from './InputField';
import Modal from './Modal';

const LoginForm = ({ onLoginSuccess, isForAdmin = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [modalInfo, setModalInfo] = useState({ show: false, title: '', message: '', type: 'info' });

    const handleLogin = async (e) => {
        e.preventDefault();
        setModalInfo({ show: false, title: '', message: '', type: 'info' });

        try {
            const endpoint = isForAdmin
                ? 'http://localhost:8080/api/auth/login/admin'
                : 'http://localhost:8080/api/auth/login/user';

            const response = await axios.post(endpoint, { email, password });
            
            console.log('Login successful:', response.data);
            setModalInfo({ show: true, title: 'Login Successful', message: 'You have been successfully logged in!', type: 'success' });

            if (onLoginSuccess) onLoginSuccess(response.data); // Pass user data to parent
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            setModalInfo({ show: true, title: 'Login Failed', message: err.response?.data?.message || 'Invalid credentials', type: 'error' });
        }
    };

    const closeModal = () => setModalInfo({ show: false, title: '', message: '', type: 'info' });

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                {isForAdmin ? 'Admin Login' : 'User Login'}
            </h2>
            <form onSubmit={handleLogin} className="space-y-6">
                <InputField
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <InputField
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" className="w-full">
                    {isForAdmin ? 'Admin Login' : 'Login'}
                </Button>
            </form>

            {modalInfo.show && (
                <Modal
                    title={modalInfo.title}
                    message={modalInfo.message}
                    onClose={closeModal}
                    type={modalInfo.type}
                />
            )}
        </div>
    );
};

export default LoginForm;
