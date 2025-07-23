import React from 'react';
import Button from './Button'; // Import the Button component

const Modal = ({ title, message, onClose, type = 'info', children }) => (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h3 className={`text-xl font-semibold mb-4 ${type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
                {title}
            </h3>
            {message && <p className="mb-4 text-gray-700">{message}</p>}
            {children} {/* Render children for custom content like textareas */}
            <Button onClick={onClose}>Close</Button>
        </div>
    </div>
);

export default Modal;
