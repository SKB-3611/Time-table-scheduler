import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Timetable from './Timetable';
import { timetableData } from '../data/mockData';
import { Calendar, Clock } from 'lucide-react';
import { getCurrentDay, isUpcoming, sortByTime } from '../utils/dateUtils';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [currentTimetable] = useState(timetableData);
  
  const today = getCurrentDay();
  const todayClasses = currentTimetable
    .filter(slot => slot.day === today)
    .sort(sortByTime);
    
  const upcomingClasses = todayClasses.filter(slot => isUpcoming(slot.startTime));

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-blue-600 mr-2" />
              <span className="font-semibold text-lg">Student Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Today's Schedule ({today})</h2>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <Clock className="w-4 h-4 mr-1" />
                Refresh Time
              </button>
            </div>
            <div className="bg-white rounded-lg shadow">
              <Timetable slots={todayClasses} showDays={false} />
            </div>
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Upcoming Classes Today</h2>
            <div className="bg-white rounded-lg shadow p-4">
              {upcomingClasses.length > 0 ? (
                upcomingClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="border-b last:border-b-0 py-3"
                  >
                    <div className="font-medium">{cls.subject}</div>
                    <div className="text-sm text-gray-600">
                      {cls.startTime} - {cls.endTime}
                    </div>
                    <div className="text-sm text-gray-600">
                      Room {cls.room} • {cls.teacher}
                      {cls.isReplacement && (
                        <span className="ml-1 text-orange-600">(Replacement)</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">No more classes for today</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}