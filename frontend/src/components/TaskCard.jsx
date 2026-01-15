import React from 'react';
import { Calendar } from 'lucide-react';
import { getPriorityColor, getStatusColor, formatDate } from '../utils/helpers';

const TaskCard = ({ task, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer overflow-hidden"
        >
            <div className={`h-2 ${getPriorityColor(task.priority)}`}></div>
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white line-clamp-2 flex-1 mr-2">
                        {task.taskName}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(task.status)}`}>
            {task.status.replace('_', ' ')}
          </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {task.description}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(task.dueDate)}</span>
                    </div>
                    <div className={`px-2 py-1 rounded ${getPriorityColor(task.priority)} text-white font-semibold`}>
                        {task.priority}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;