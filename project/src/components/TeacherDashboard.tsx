import { Calendar, Clock, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { renderTimeSlot, sortTimeRanges } from "../utils/utils"
import Timetable from "./Timetable"

export default function TeacherDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const { user, logout } = useAuth()
  const [timetable, setTimetable] = useState<any>([])
  const [todaysSchedule, setTodaysSchedule] = useState<any>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  useEffect(() => {
    try {
      const fetchTimetable = async () => {
        const result = await fetch(`${import.meta.env.VITE_HOST}/teacher/getSchedule`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: user?.username, day: days[new Date().getDay()] }),
        })
        const res = await result.json()
        if (res.status === "success") {
          if (res?.replacementSlots) {
            let arr = [...res?.schedule]
            const rep = res.replacementSlots.map((slot: any) => ({
              start_time: slot.startTime,
              end_time: slot.endTime,
              subject: slot.subject,
              teacher: slot.replacementTeacher,
              room: slot.room,
              isReplaced: true,
            }))
            arr = arr.concat(rep)
            setTodaysSchedule(arr)
          } else {
            setTodaysSchedule(res.schedule)
          }

          const tt: any = {}
          const a = await fetch(`${import.meta.env.VITE_HOST}/timetable`)
          const data = await a.json()
          data.timetable.forEach((obj: { day: string; slots: any[] }) => {
            tt[obj.day] = obj.slots
          })
          setTimetable(tt)
        }
      }
      fetchTimetable()
    } catch (e) {
      window.location.reload()
    } finally {
      setIsLoading(false)
    }
  }, [user, days])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-blue-600 mr-2" />
              <span className="font-bold text-xl text-gray-800">Teacher Dashboard</span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.username}</span>
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
              <span className="block px-3 py-2 text-base font-medium text-gray-600">Welcome, {user?.username}</span>
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
              <div className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                  <h2 id="schedule-heading" className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">
                    Today's Teaching Schedule
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
                  {!isLoading && todaysSchedule.length > 0 ? (
                    todaysSchedule.sort(sortTimeRanges).map((slot: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-md p-4 shadow-sm">
                        {renderTimeSlot(slot, true)}
                      </div>
                    ))
                  ) : (
                    <p className="text-base col-span-full p-5 py-3 text-gray-500 italic">
                      {isLoading ? "Loading..." : "No classes scheduled for today"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="timetable-heading">
            <h2 id="timetable-heading" className="text-2xl text-center font-bold text-gray-900 mb-4">
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

