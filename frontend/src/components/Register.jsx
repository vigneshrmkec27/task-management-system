import React, { useState } from 'react';
import { User } from 'lucide-react';
import { authService } from '../services/authService';

const Register = ({ onRegisterSuccess, onSwitchToLogin, darkMode, showNotification }) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (formData.password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        setLoading(true);
        try {
            await authService.register(formData.username, formData.email, formData.password);
            showNotification('Registration successful! Please login.');
            onRegisterSuccess();
        } catch (error) {
            const errorMessage = error.response?.data || 'Registration failed';
            if (errorMessage.toLowerCase().includes('exists')) {
                showNotification('User Already Exists', 'error');
            } else {
                showNotification(errorMessage, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-purple-50 to-pink-100'}`}>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                        <User className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Create Account</h2>
                    <p className="text-gray-600 dark:text-gray-400">Join us to start managing tasks</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            required
                            disabled={loading}
                            minLength="3"
                            maxLength="50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                            required
                            minLength="6"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <button
                        onClick={onSwitchToLogin}
                        className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;