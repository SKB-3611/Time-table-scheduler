import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, UserPlus, RefreshCw, Clock } from 'lucide-react';

import {  Subject, Teacher, CollegeProps, TimetableData } from '../types';
import Timetable from './Timetable';

interface TeacherForm {
  name: string;
  username: string;
  password: string;
  subjects: string[];
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [formData, setFormData] = useState<TeacherForm>({
    name: '',
    username: '',
    password: '',
    subjects: []
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [message, setMessage] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [timetable, setTimetable] = useState<TimetableData>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [timing, setTiming] = useState<CollegeProps>({
    startTime: '09:00',
    endTime: '17:00',
    duration: 1,
    breakStart: '12:00',
    breakEnd: '12:30',
    workingDays: 'Mon,Tue,Wed,Thu,Fri',
    clasrooms: 'LH1 , LH2 , LH3 , Lab1, Lab2 '
  });

  const handleGenerateTimetable = async () => {
    if (teachers.length === 0) {
      setMessage('Please add teachers before generating the timetable');
      return;
    }

    if (subjects.length === 0) {
      setMessage('Please add subjects before generating the timetable');
      return;
    }

    // Validate timing
    const [startHour] = timing.startTime.split(':').map(Number);
    const [endHour] = timing.endTime.split(':').map(Number);
    
    if (startHour >= endHour) {
      setMessage('End time must be after start time');
      return;
    }

    if (timing.duration <= 0) {
      setMessage('Duration must be greater than 0');
      return;
    }

    if ((endHour - startHour) < timing.duration) {
      setMessage('School hours must be greater than class duration');
      return;
    }

    setIsGenerating(true);
    // try {
    //   const newTimetable = generateTimetable(teachers, subjects, timing);
    //   setTimetable(newTimetable);
    //   setMessage('Timetable generated successfully');
    // } catch (error) {
    //   setMessage('Error generating timetable');
    // } finally {
    //   setIsGenerating(false);
    // }
    let t = teachers.map((teacher)=>{
      return {
        name:teacher.name,
        subjects:teacher.subjects
      }
    })
  
    let obj = {
      start_time:timing.startTime,
      end_time:timing.endTime,
      break_time:`${timing.breakStart} to ${timing.breakEnd}`,
      working_days:timing.workingDays,
      classrooms:timing.clasrooms,
      lecture_duration:timing.duration,
      teachers:t
    }
    console.log(obj)
    try{
      let res = await fetch(`${import.meta.env.VITE_HOST}/timetable/generate`,{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
          'Content-Type':'application/json'
        }
      })
      let data = await res.json()
      setMessage(data?.message)
      if(data?.status === 'success'){
        setTimetable(data.timetableJSON)
      }
    }catch(e){
      console.log(e)
    }
    finally{
      setIsGenerating(false)
    }

  };

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.subjects.length === 0) {
      setMessage('Please add at least one subject for the teacher');
      return;
    }

    const teacher: Teacher = {
      id: String(teachers.length + 1),
      name: formData.name,
      username: formData.username,
      password: formData.password,
      role: 'teacher',
      subjects: formData.subjects
    };

    const newSubjects = formData.subjects.map(subject => ({
      name: subject,
      teachers: [teacher.name]
    }));

    const updatedSubjects = [...subjects];
    newSubjects.forEach(newSubject => {
      const existingSubject = updatedSubjects.find(s => s.name === newSubject.name);
      if (existingSubject) {
        existingSubject.teachers.push(teacher.name);
      } else {
        updatedSubjects.push(newSubject);
      }
    });

    setTeachers([...teachers, teacher]);
    setSubjects(updatedSubjects);
    setFormData({
      name: '',
      username: '',
      password: '',
      subjects: []
    });
    
    setMessage('Teacher added successfully with assigned subjects');
  };

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      if (formData.subjects.includes(newSubject.trim())) {
        setMessage('This subject is already added');
        return;
      }
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }));
      setNewSubject('');
      setMessage('');
    }
  };

  const handleRemoveSubject = (subjectToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(subject => subject !== subjectToRemove)
    }));
  };

  

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 text-blue-600 mr-2" />
              <span className="font-semibold text-lg">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
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
        {message && (
          <div className={`border px-4 py-3 rounded mb-4 ${
            message.includes('error') || message.includes('Please') 
              ? 'bg-red-100 border-red-400 text-red-700'
              : 'bg-green-100 border-green-400 text-green-700'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* School Timing Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">School Timing Settings</h2>
            </div>
            <div className="space-y-4">
              <div className='flex w-full gap-5'>
                <div className='w-1/2'>

                <label className="block text-sm font-medium text-gray-700">School Start Time</label>
                <input
                  type="time"
                  value={timing.startTime}
                  onChange={(e) => setTiming({ ...timing, startTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
              
                  </div>
              <div className='w-1/2'>

                <label className="block text-sm font-medium text-gray-700">School End Time</label>
                <input
                  type="time"
                  value={timing.endTime}
                  onChange={(e) => setTiming({ ...timing, endTime: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Class Duration (hours)</label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={timing.duration}
                  onChange={(e) => setTiming({ ...timing, duration: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Break Duration (hours)</label>
                <div className='flex gap-2'>

                <input
                  type="time"
                  value={timing.breakStart}
                  onChange={(e) => setTiming({ ...timing, breakStart: (e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                <input
                  type="time"
                  value={timing.breakEnd}
                  onChange={(e) => setTiming({ ...timing, breakEnd: (e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  </div>
                  <div className='mt-2'>
                    <label className=' block text-sm font-medium text-gray-700' htmlFor="working-days">Add Working Days</label>
                    <input type="text" className='w-full rounded-md border-gray-300 shadow-sm mt-2 focus:border-blue-500 focus:ring-blue-500' value={timing.workingDays} onChange={(e) => setTiming({ ...timing, workingDays: (e.target.value) })} />
                  </div>
                  <div className='mt-2'>
                    <label className=' block text-sm font-medium text-gray-700' htmlFor="classrooms">Add Classrooms</label>
                    <input type="text" className='w-full rounded-md border-gray-300 shadow-sm mt-2 focus:border-blue-500 focus:ring-blue-500' value={timing.clasrooms} onChange={(e) => setTiming({ ...timing, clasrooms: (e.target.value) })} />
                  </div>
              </div>
            </div>
          </div>

          {/* Add Teacher Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <UserPlus className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">Add New Teacher with Subjects</h2>
            </div>
            <form onSubmit={handleAddTeacher} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Add Subjects</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter subject name"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {subject}
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(subject)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Teacher with Subjects
              </button>
            </form>
          </div>
        </div>

        {/* Teacher Absence Management */}
        {/* <div className="bg-white rounded-lg shadow p-6 mb-8 hidden">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
            <h2 className="text-xl font-semibold">Manage Teacher Absence</h2>
          </div>
          <form onSubmit={handleTeacherAbsence} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Absent Teacher</label>
              <select
                value={absentTeacher}
                onChange={(e) => setAbsentTeacher(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select teacher</option>
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.name}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Replacement Teacher</label>
              <select
                value={replacementTeacher}
                onChange={(e) => setReplacementTeacher(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select replacement</option>
                {teachers
                  .filter(teacher => teacher.name !== absentTeacher)
                  .map(teacher => (
                    <option key={teacher.id} value={teacher.name}>
                      {teacher.name}
                    </option>
                  ))}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors"
            >
              Update Schedule
            </button>
          </form>
        </div> */}

        {/* Current Teachers List */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Teachers and Their Subjects</h2>
          {teachers.length > 0 ? (
            <div className="space-y-4">
              {teachers.map(teacher => (
                <div key={teacher.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium text-lg">{teacher.name}</div>
                  <div className="text-sm text-gray-600">Username: {teacher.username}</div>
                  <div className="mt-2">
                    <div className="text-sm font-medium text-gray-700">Assigned Subjects:</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {subjects
                        .filter(subject => subject.teachers.includes(teacher.name))
                        .map(subject => (
                          <span
                            key={subject.name}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                          >
                            {subject.name}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No teachers added yet. Add teachers to get started.</p>
          )}
        </div>

        {/* Timetable Section with Generate Button */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Current Timetable</h2>
            <button
              onClick={handleGenerateTimetable}
              disabled={isGenerating || teachers.length === 0}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
              {isGenerating ? 'Generating...' : 'Generate New Timetable'}
            </button>
          </div>
          {timetable ? (
            <div className="overflow-x-auto">
              <Timetable data={timetable} />
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No timetable generated yet. Add teachers and click the generate button to create a timetable.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}