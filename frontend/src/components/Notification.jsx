import React from 'react';

const Notification = ({ message, type = 'success', onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all animate-fadeIn ${
                type === 'error' ? 'bg-red-500' : 'bg-green-500'
            } text-white font-semibold`}
        >
            {message}
        </div>
    );
};

export default Notification;