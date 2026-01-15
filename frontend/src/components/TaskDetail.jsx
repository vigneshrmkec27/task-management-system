import React from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';
import { getPriorityColor, getStatusColor, formatDate, formatDateTime } from '../utils/helpers';

const TaskDetail = ({ task, onClose, onEdit, onDelete }) => {
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            onDelete();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Task Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            {task.taskName}
                        </h3>
                        <div className="flex items-center space-x-2 mb-4 flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ')}
              </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(task.priority)} text-white`}>
                {task.priority}
              </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            Description
                        </h4>
                        <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
                            {task.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Created Date
                            </h4>
                            <p className="text-gray-800 dark:text-white">
                                {formatDateTime(task.createdDate)}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Updated Date
                            </h4>
                            <p className="text-gray-800 dark:text-white">
                                {formatDateTime(task.updatedDate)}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Due Date
                            </h4>
                            <p className="text-gray-800 dark:text-white">
                                {formatDate(task.dueDate)}
                            </p>
                        </div>
                        {task.reminderTime && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                    Reminder
                                </h4>
                                <p className="text-gray-800 dark:text-white">
                                    {formatDateTime(task.reminderTime)}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                        <button
                            onClick={onEdit}
                            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
                        >
                            <Edit2 className="w-5 h-5" />
                            <span>Edit</span>
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
                        >
                            <Trash2 className="w-5 h-5" />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;