import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Calendar, Clock, Menu, X } from "lucide-react"
import { renderTimeSlot, sortTimeRanges } from "../utils/utils"
import type { TimeSlot } from "../types"
import Timetable from "./Timetable"

export default function StudentDashboard() {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const [isLoading, setIsLoading] = useState(true)
  const { user, logout } = useAuth()
  const [timetable, setTimetable] = useState<any>()
  const [todayClasses, setTodayClasses] = useState<TimeSlot[]>([])
  const [replacementSlots, setReplacementSlots] = useState<any>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    try {
      const fetchTimetable = async () => {
        const res = await fetch(`${import.meta.env.VITE_HOST}/timetable`)
        const data = await res.json()
        if (data.replacementSlots) {
          setReplacementSlots(data.replacementSlots)
        }
        const tt: any = {}
        data.timetable.forEach((obj: { day: string; slots: any[] }) => {
          tt[obj.day] = obj.slots
        })
        setTimetable(tt)
      }
      fetchTimetable()
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const today = days[new Date().getDay()]

    if (timetable) {
      let temp = timetable[today] ? [...timetable[today]] : []

      temp = temp.map((obj) => {
        const newObj = { ...obj }

        replacementSlots?.forEach((slot: any) => {
          if (newObj.teacher === slot.originalTeacher) {
            newObj.teacher = slot.replacementTeacher
            newObj.subject = slot.subject
            newObj.room = slot.room
            newObj.isReplaced = true
          }
        })
        return newObj
      })

      setTodayClasses(temp)
    }
  }, [timetable, replacementSlots])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-600 mr-2" />
              <span className="font-bold text-xl text-gray-800">Student Dashboard</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name || "Student"}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-500 hover:text-gray-600">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <span className="block px-3 py-2 text-base font-medium text-gray-600">
                Welcome, {user?.name || "Student"}
              </span>
              <button
                onClick={logout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <section aria-labelledby="schedule-heading">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                  <h2 id="schedule-heading" className="text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
                    Today's Schedule
                  </h2>
                  <button
                    onClick={() => window.location.reload()}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    Refresh
                  </button>
                </div>
                <p className="text-gray-600 mb-4">
                  {days[new Date().getDay()]}, {new Date().toLocaleDateString()}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {todayClasses && todayClasses.length > 0 ? (
                    todayClasses.sort(sortTimeRanges).map((slot) => (
                      <div key={slot.start_time} className="bg-gray-50 rounded-md p-4 shadow-sm">
                        {renderTimeSlot(slot, true)}
                      </div>
                    ))
                  ) : (
                    <p className="text-xl col-span-full p-5 py-3 text-gray-500 italic">
                      No classes scheduled for today
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="timetable-heading">
            <h2 id="timetable-heading" className="text-2xl font-bold text-gray-900 mb-4">
              Weekly Timetable
            </h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-6 overflow-x-auto">
                {!isLoading && timetable ? (
                  <Timetable data={timetable} />
                ) : (
                  <p className="text-gray-500 italic">Loading timetable...</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

