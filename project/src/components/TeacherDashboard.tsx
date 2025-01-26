import { Calendar, UserCheck, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { renderTimeSlot, sortTimeRanges } from '../utils/utils';
import Timetable from './Timetable';
export default function TeacherDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const {user,logout} =  useAuth()
  const [timetable, settimetable] = useState<any>([]);
  const [todaysSchedule, setTodaysSchedule] = useState<any>([]);
  let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  useEffect(() => {
    
    try{
      const fetchTimetable = async () => {
        let result = await fetch(`${import.meta.env.VITE_HOST}/teacher/getSchedule`, {
          method: 'POST',
          headers: {  
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({name:user?.username , day: "Monday" })
        });
        let res = await result.json()
        setTodaysSchedule(res.schedule)
       
        let tt:any ={}
        let a =await fetch(`${import.meta.env.VITE_HOST}/timetable`)
        let data = await a.json()
        data.timetable.forEach((obj:{day:string,slots:any[]})=>{
          tt[obj.day] = obj.slots
        })
        settimetable(tt)
      };
      fetchTimetable();
    }catch(e){
      window.location.reload()
    }
    finally{
      setIsLoading(false)
    }
  }, [])
  
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
              
              <span className="text-gray-600">Welcome, {user?.username}</span>
              <button
              onClick={()=>logout()}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Today's Teaching Schedule ({days[new Date().getDay()]})</h2>
              <button
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <Clock className="w-4 h-4 mr-1" />
                Refresh Time
              </button>
            </div>
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 grid grid-cols-3 gap-5">
                {(!isLoading && todaysSchedule) && todaysSchedule.sort(sortTimeRanges).map((slot: any) => {
                 return renderTimeSlot(slot,true)
                })}
                {todaysSchedule.length == 0 && <p>No classes today</p>}
                {isLoading && <p>Loading...</p>}
              </div>
            </div>
          </div>

          
        </div>
        <div >
          <h2 className="text-xl font-semibold mt-8 mb-2">Weekly Timetable</h2>
                {
                  (!isLoading && timetable) && <Timetable data={timetable} />
                }
        </div>
      </main>
    </div>
  );
}
