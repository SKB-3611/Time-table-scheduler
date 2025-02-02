import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Calendar, Clock } from "lucide-react"
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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center mb-4 sm:mb-0">
              <Calendar className="w-6 h-6 text-blue-600 mr-2" />
              <span className="font-semibold text-lg">Student Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 hidden sm:inline">Welcome, Student</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
              <h2 className="text-xl font-semibold mb-2 sm:mb-0">Today's Schedule ({days[new Date().getDay()]})</h2>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <Clock className="w-4 h-4 mr-1" />
                Refresh Time
              </button>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {todayClasses &&
                  todayClasses
                    .sort(sortTimeRanges)
                    .map((slot) => <div key={slot.start_time}>{renderTimeSlot(slot, true)}</div>)}

                {todayClasses && todayClasses.length === 0 && (
                  <p className="text-xl col-span-full p-5 py-3">No classes today</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Weekly Timetable</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              {!isLoading && timetable && <Timetable data={timetable} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

