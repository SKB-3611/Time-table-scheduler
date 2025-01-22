import React from 'react';
import { useAuth } from '../context/AuthContext';

import Timetable from './Timetable';
import { timetableData } from '../data/mockData';
import { Calendar, UserCheck, Clock } from 'lucide-react';
import { getCurrentDay, isUpcoming, sortByTime } from '../utils/dateUtils';

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const { setTeacherAvailability, isTeacherAvailable } = useTeacherAvailability();
  const isAvailable = user ? isTeacherAvailable(user.name) : false;

  const today = getCurrentDay();
  const teacherClasses = timetableData
    .filter(slot => slot.day === today && slot.teacher === user?.name)
    .sort(sortByTime);
    
  const upcomingClasses = teacherClasses.filter(slot => isUpcoming(slot.startTime));

  const handleAvailabilityChange = (available: boolean) => {
    if (user) {
      setTeacherAvailability(user.name, available);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-blue-600 mr-2" />
              <span className="font-semibold text-lg">Teacher Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <UserCheck className={`w-5 h-5 ${isAvailable ? 'text-green-600' : 'text-red-600'} mr-2`} />
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAvailable}
                    onChange={(e) => handleAvailabilityChange(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </label>
              </div>
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
              <h2 className="text-xl font-semibold">Today's Teaching Schedule ({today})</h2>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <Clock className="w-4 h-4 mr-1" />
                Refresh Time
              </button>
            </div>
            {isAvailable ? (
              <div className="bg-white rounded-lg shadow">
                <Timetable slots={teacherClasses} showDays={false} />
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                You are currently marked as unavailable. Your classes will be automatically reassigned.
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Upcoming Classes Today</h2>
            <div className="bg-white rounded-lg shadow p-4">
              {isAvailable ? (
                upcomingClasses.length > 0 ? (
                  upcomingClasses.map((cls) => (
                    <div
                      key={cls.id}
                      className="border-b last:border-b-0 py-3"
                    >
                      <div className="font-medium">{cls.subject}</div>
                      <div className="text-sm text-gray-600">
                        {cls.startTime} - {cls.endTime}
                      </div>
                      <div className="text-sm text-gray-600">Room {cls.room}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No more classes for today</p>
                )
              ) : (
                <p className="text-gray-600">You are marked as unavailable</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}