import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Calendar, UserPlus, RefreshCw, Clock, X, Trash2, Edit } from "lucide-react"

import type { Teacher, CollegeProps, TimetableData } from "../types"
import Timetable from "./Timetable"

interface TeacherForm {
  name: string
  username: string
  password: string
  subjects: string[]
}

export default function AdminDashboard() {
  const { logout } = useAuth()
  const [formData, setFormData] = useState<TeacherForm>({
    name: "",
    username: "",
    password: "",
    subjects: [],
  })
  const [isLoading, setisLoading] = useState(false)
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [message, setMessage] = useState("")
  const [newSubject, setNewSubject] = useState("")
  const [timetable, setTimetable] = useState<TimetableData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [timing, setTiming] = useState<CollegeProps>({
    startTime: "09:00",
    endTime: "17:00",
    class_duration: 1,
    practical_duration: 1,
    breakStart: "12:00",
    breakEnd: "12:30",
    workingDays: "Mon,Tue,Wed,Thu,Fri",
    clasrooms: "LH1 , LH2 , LH3",
    labs: "Lab1, Lab2",
  })
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  useEffect(() => {
    ;(async () => {
      try {
        setisLoading(true)
        const timetable = await fetch(`${import.meta.env.VITE_HOST}/timetable`)
        const data = await timetable.json()
        if (data.timetable.length == 0) return
        const obj: { [key: string]: any } = {}
        data.timetable.map((item: { day: string; slots: any[] }) => {
          obj[item.day] = item.slots
        })
        setTimetable(obj)
        const teacher = await fetch(`${import.meta.env.VITE_HOST}/admin/getTeachers`)
        const teacherData = await teacher.json()
        setTeachers(teacherData.teachers)
      } finally {
        setisLoading(false)
      }
    })()
  }, [])

  const handleGenerateTimetable = async () => {
    if (teachers.length === 0) {
      setMessage("Please add teachers before generating the timetable")
      return
    }

    if (teachers.filter((teacher) => teacher.subjects.length === 0).length > 0) {
      setMessage("Please add subjects before generating the timetable")
      return
    }

    // Validate timing
    const [startHour] = timing.startTime.split(":").map(Number)
    const [endHour] = timing.endTime.split(":").map(Number)

    if (startHour >= endHour) {
      setMessage("End time must be after start time")
      return
    }

    if (timing.class_duration <= 0) {
      setMessage("Duration must be greater than 0")
      return
    }

    if (endHour - startHour < timing.class_duration) {
      setMessage("School hours must be greater than class duration")
      return
    }

    setIsGenerating(true)
    const t = teachers.map((teacher) => {
      return {
        name: teacher.name,
        subjects: teacher.subjects,
      }
    })

    const obj = {
      start_time: timing.startTime,
      end_time: timing.endTime,
      break_time: `${timing.breakStart} to ${timing.breakEnd}`,
      working_days: timing.workingDays,
      classrooms: timing.clasrooms,
      labs: timing.labs,
      lecture_duration: timing.class_duration,
      practical_duration: timing.practical_duration,
      teachers: t,
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_HOST}/admin/generate`, {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await res.json()
      setMessage(data?.message)
      if (data?.status === "success") {
        setTimetable(data.timetableJSON)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    setisLoading(true)

    if (formData.subjects.length === 0) {
      setMessage("Please add at least one subject for the teacher")
      return
    }

    if (editingTeacherId) {
      // Update existing teacher
      const updatedTeachers = teachers.map((teacher) =>
        teacher.id === editingTeacherId
          ? {
              ...teacher,
              name: formData.name,
              username: formData.username,
              password: formData.password,
              subjects: formData.subjects,
            }
          : teacher,
      )

      setTeachers(updatedTeachers)
      setEditingTeacherId(null)
      setMessage("Teacher updated successfully")
      const result = await fetch(`${import.meta.env.VITE_HOST}/admin/addTeacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          password: formData.password,
          subjects: formData.subjects,
        }),
      })
    } else {
      // Add new teacher
      const teacher: Teacher = {
        id: String(teachers.length + 1),
        name: formData.name,
        username: formData.username,
        password: formData.password,
        role: "teacher",
        subjects: formData.subjects,
      }

      setTeachers([...teachers, teacher])
      setMessage("Teacher added successfully with assigned subjects")
      const result = await fetch(`${import.meta.env.VITE_HOST}/admin/addTeacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          password: formData.password,
          subjects: formData.subjects,
        }),
      })
    }

    // Reset form
    setFormData({
      name: "",
      username: "",
      password: "",
      subjects: [],
    })
    setNewSubject("")
    setisLoading(false)
  }

  const handleEditTeacher = (teacher: Teacher) => {
    // Populate form with teacher details
    setFormData({
      name: teacher.name,
      username: teacher.username,
      password: teacher.password,
      subjects: teacher.subjects,
    })
    // Set editing mode
    setEditingTeacherId(teacher.id)
  }

  const handleDeleteTeacher = async (teacherUsername: string) => {
    // Remove teacher from state
    try {
      const res = await fetch(`${import.meta.env.VITE_HOST}/admin/deleteTeacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: teacherUsername }),
      })
      if (res.status !== 200) {
        setMessage("Failed to delete teacher")
        return
      } else {
        const updatedTeachers = teachers.filter((teacher) => teacher.username !== teacherUsername)
        setTeachers(updatedTeachers)

        // Close confirmation dialog
        setShowDeleteConfirm(null)
        setMessage("Teacher deleted successfully")
      }
    } catch (e) {
      console.log(e)
    }
  }
  const handleAddSubject = () => {
    if (newSubject.trim()) {
      if (formData.subjects.includes(newSubject.trim())) {
        setMessage("This subject is already added")
        return
      }
      setFormData((prev) => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()],
      }))
      setNewSubject("")
      setMessage("")
    }
  }

  const handleRemoveSubject = (subjectToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((subject) => subject !== subjectToRemove),
    }))
  }
  const handleClearTimetable = async () => {
    setisLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_HOST}/admin/clearTimetable`)
      const data = await res.json()
      setMessage(data?.message)
      setTimetable(null)
    } catch (e) {
      console.log(e)
    } finally {
      setisLoading(false)
    }
  }

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

      <main className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {message && (
          <div
            className={`border px-4 py-3 rounded mb-4 ${
              message.includes("error") || message.includes("Please")
                ? "bg-red-100 border-red-400 text-red-700"
                : "bg-green-100 border-green-400 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* School Timing Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold">School Timing Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-5">
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">School Start Time</label>
                  <input
                    type="time"
                    value={timing.startTime}
                    onChange={(e) => setTiming({ ...timing, startTime: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="block text-sm font-medium text-gray-700">School End Time</label>
                  <input
                    type="time"
                    value={timing.endTime}
                    onChange={(e) => setTiming({ ...timing, endTime: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Class Duration (hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={timing.class_duration}
                    onChange={(e) =>
                      setTiming({
                        ...timing,
                        class_duration: Number(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-gray-700">Practical Duration (hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="3"
                    value={timing.practical_duration}
                    onChange={(e) =>
                      setTiming({
                        ...timing,
                        practical_duration: Number(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Break Duration (hours)</label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={timing.breakStart}
                    onChange={(e) => setTiming({ ...timing, breakStart: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={timing.breakEnd}
                    onChange={(e) => setTiming({ ...timing, breakEnd: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div className="mt-2">
                  <label className=" block text-sm font-medium text-gray-700" htmlFor="working-days">
                    Add Working Days
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm mt-2 focus:border-blue-500 focus:ring-blue-500"
                    value={timing.workingDays}
                    onChange={(e) => setTiming({ ...timing, workingDays: e.target.value })}
                  />
                </div>
                <div className="mt-2">
                  <label className=" block text-sm font-medium text-gray-700" htmlFor="classrooms">
                    Add Classrooms
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm mt-2 focus:border-blue-500 focus:ring-blue-500"
                    value={timing.clasrooms}
                    onChange={(e) => setTiming({ ...timing, clasrooms: e.target.value })}
                  />
                </div>
                <div className="mt-2">
                  <label className=" block text-sm font-medium text-gray-700" htmlFor="classrooms">
                    Add Practical Labs
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border-gray-300 shadow-sm mt-2 focus:border-blue-500 focus:ring-blue-500"
                    value={timing.labs}
                    onChange={(e) => setTiming({ ...timing, labs: e.target.value })}
                  />
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
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
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
                disabled={isLoading}
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Adding...
                  </div>
                ) : (
                  "Add Teacher with Subjects"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Current Teachers List */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Teachers and Their Subjects</h2>
          {teachers.length > 0 ? (
            <div className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teachers.map((teacher) => (
                <div key={teacher.username} className="p-4 bg-gray-50 rounded-lg relative">
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button onClick={() => handleEditTeacher(teacher)} className="text-blue-600 hover:text-blue-800">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(teacher.username)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="font-medium text-lg">{teacher.name}</div>
                  <div className="text-sm text-gray-600">Username: {teacher.username}</div>
                  <div className="mt-2">
                    <div className="text-sm font-medium text-gray-700">Assigned Subjects:</div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {teacher.subjects.map((subject) => (
                        <span key={subject} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                          {subject}
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
              <p className="mb-6">Are you sure you want to delete this teacher?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTeacher(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Timetable Section with Generate Button */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
            <h2 className="text-xl font-semibold">Current Timetable</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-5 w-full sm:w-auto">
              <button
                onClick={handleClearTimetable}
                disabled={timetable === null}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
              >
                <X /> Clear Time Table
              </button>
              <button
                onClick={handleGenerateTimetable}
                disabled={isGenerating || teachers.length === 0}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 w-full sm:w-auto"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                {isGenerating ? "Generating..." : "Generate New Timetable"}
              </button>
            </div>
          </div>
          {!isLoading && timetable ? (
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
  )
}

