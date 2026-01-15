import React, { useState, useEffect } from 'react';
import { Search, Plus, Calendar, Filter, LogOut, Sun, Moon, Check, Clock } from 'lucide-react';
import { taskService } from '../services/taskService';
import { authService } from '../services/authService';
import { getTaskStats } from '../utils/helpers';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import TaskDetail from './TaskDetail';
import LiveClock from './LiveClock';

const Dashboard = ({ user, darkMode, setDarkMode, showNotification }) => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [loading, setLoading] = useState(false);

    const tasksPerPage = 10;

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, priorityFilter, statusFilter, tasks]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await taskService.getAllTasks();
            // Handle both paginated response and direct array
            let taskList = [];
            if (response && response.content) {
                taskList = Array.isArray(response.content) ? response.content : [];
            } else if (Array.isArray(response)) {
                taskList = response;
            } else {
                taskList = [];
            }
            setTasks(taskList);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            showNotification('Failed to fetch tasks', 'error');
            setTasks([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        if (!Array.isArray(tasks)) {
            setFilteredTasks([]);
            return;
        }

        let result = [...tasks];

        if (searchQuery && searchQuery.trim() !== '') {
            result = result.filter(task =>
                task.taskName && task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (priorityFilter !== 'ALL') {
            result = result.filter(task => task.priority === priorityFilter);
        }

        if (statusFilter !== 'ALL') {
            result = result.filter(task => task.status === statusFilter);
        }

        setFilteredTasks(result);
        setCurrentPage(1);
    };

    const handleLogout = () => {
        authService.logout();
        window.location.reload();
    };

    const openTaskModal = (task = null) => {
        setSelectedTask(task);
        setShowTaskModal(true);
    };

    const closeTaskModal = () => {
        setShowTaskModal(false);
        setSelectedTask(null);
    };

    const openDetailModal = (task) => {
        setSelectedTask(task);
        setShowDetailModal(true);
    };

    const closeDetailModal = () => {
        setShowDetailModal(false);
        setSelectedTask(null);
    };

    const stats = getTaskStats(tasks);
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

    return (
        <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                                <Check className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Task Manager</h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Welcome, {user?.username || 'User'}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <LiveClock />

                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
                            </button>

                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="mt-4 flex flex-wrap gap-4">
                        <div className="flex-1 min-w-64">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search tasks by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <select
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
                        >
                            <option value="ALL">All Priorities</option>
                            <option value="HIGH">High</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="LOW">Low</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 transition"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                        </select>

                        <button
                            onClick={() => openTaskModal()}
                            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center space-x-2 font-semibold shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            <span>New Task</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Total Tasks</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Check className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Pending</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                                <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">In Progress</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Filter className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">Completed</p>
                                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tasks Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="text-gray-600 dark:text-gray-400 mt-4">Loading tasks...</p>
                    </div>
                ) : currentTasks.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-block p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                            <Check className="w-16 h-16 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Tasks Found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {searchQuery || priorityFilter !== 'ALL' || statusFilter !== 'ALL'
                                ? 'Try adjusting your filters or search query'
                                : 'Get started by creating your first task!'}
                        </p>
                        {!searchQuery && priorityFilter === 'ALL' && statusFilter === 'ALL' && (
                            <button
                                onClick={() => openTaskModal()}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition inline-flex items-center space-x-2"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Create Your First Task</span>
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentTasks.map(task => (
                            <TaskCard key={task.id} task={task} onClick={() => openDetailModal(task)} />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center space-x-2 flex-wrap gap-2">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`px-4 py-2 rounded-lg shadow transition ${
                                    currentPage === i + 1
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg shadow disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>

            {/* Modals */}
            {showTaskModal && (
                <TaskModal
                    task={selectedTask}
                    onClose={closeTaskModal}
                    onSuccess={() => {
                        fetchTasks();
                        closeTaskModal();
                    }}
                    showNotification={showNotification}
                />
            )}

            {showDetailModal && selectedTask && (
                <TaskDetail
                    task={selectedTask}
                    onClose={closeDetailModal}
                    onEdit={() => {
                        closeDetailModal();
                        openTaskModal(selectedTask);
                    }}
                    onDelete={async () => {
                        try {
                            await taskService.deleteTask(selectedTask.id);
                            showNotification('Task deleted!');
                            fetchTasks();
                            closeDetailModal();
                        } catch (error) {
                            console.error('Delete error:', error);
                            showNotification('Delete failed', 'error');
                        }
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;