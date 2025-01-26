import  { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock } from 'lucide-react';
import { renderTimeSlot, parseTime, sortTimeRanges } from '../utils/utils';
import { TimeSlot } from '../types';
import Timetable from './Timetable';


export default function StudentDashboard() {
  const days= ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
  const [isLoading, setIsLoading] = useState(true);  
  const { user, logout } = useAuth();
  const [timetable, setTimetable] = useState<any>();
  const [todayClasses, setTodayClasses] = useState<TimeSlot[]>([]);
  useEffect(() => {
    try{
      const fetchTimetable = async () => {
        let res = await fetch(`${import.meta.env.VITE_HOST}/timetable`)
        let data = await res.json()
   
        let tt:any ={}
        data.timetable.forEach((obj:{day:string,slots:any[]})=>{
          tt[obj.day] = obj.slots
        })
        setTimetable(tt)
        let today = days[new Date().getDay()]
        data.timetable.forEach((obj:{day:string,slots:any[]})=>{
      
          if(obj?.day == today){
            setTodayClasses(obj.slots)
          }
        })  
      }
        fetchTimetable()
    }finally{
   
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Today's Schedule ({days[new Date().getDay()]})</h2>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <Clock className="w-4 h-4 mr-1" />
                Refresh Time
              </button>
            </div>
            <div className="bg-white rounded-lg shadow grid grid-cols-3">
            {todayClasses && todayClasses.sort(sortTimeRanges).map((slot, index) => (
                   <div>
                    {renderTimeSlot(slot,true)}
                   </div>
        
            ))}
            
            {todayClasses && todayClasses.length == 0 && <p className='text-xl p-5 py-3'>No classes today</p>}

            </div>
          </div>

          
        </div>
        <div className="overflow-x-auto">
          <div>
            <h2 className="text-xl font-semibold mt-8">Weekly Timetable</h2>
          </div>
              {
                (!isLoading && timetable) && <Timetable data={timetable} />
              }  
            </div>
      </main>
    </div>
  );
}