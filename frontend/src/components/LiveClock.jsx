import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

const LiveClock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
            <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-mono font-semibold text-gray-800 dark:text-white">
        {currentTime.toLocaleTimeString()}
      </span>
        </div>
    );
};

export default LiveClock;