
import React from 'react';

interface TimeSlot {
  start_time: string;
  end_time: string;
  subject: string;
  teacher: string;
  classroom: string;
}

interface TimetableData {
  [key: string]: TimeSlot[];
}

interface TimetableProps {
  data: TimetableData;
  showDays?: boolean;
  selectedDay?: string;
}

export default function Timetable({ data, showDays = true, selectedDay }: TimetableProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const renderTimeSlot = (slot: TimeSlot) => (
    <div className={`p-2 rounded ${slot.subject === 'Break' ? 'bg-gray-50' : 'bg-blue-50'}`}>
      {slot.subject !== 'Break' ? (
        <>
          <div className="font-medium">
            {slot.subject}
            {slot.subject.includes('PR') && 
              <span className="ml-1 text-xs bg-blue-200 text-blue-800 px-1 rounded">
                Practical
              </span>
            }
          </div>
          <div className="text-sm text-gray-600">Room: {slot.classroom}</div>
          <div className="text-sm text-gray-600">{slot.teacher}</div>
        </>
      ) : (
        <div className="text-center font-medium text-gray-500">Break</div>
      )}
    </div>
  );

  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes; // Convert time to total minutes for comparison
  };

  const sortTimeRanges = (timeRangeA: string, timeRangeB: string) => {
    const [startA] = timeRangeA.split('-');
    const [startB] = timeRangeB.split('-');
    return parseTime(startA) - parseTime(startB);
  };

  // Single day view
  if (!showDays && selectedDay) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-50 w-1/4">Start Time</th>
              <th className="border p-2 bg-gray-50 w-1/4">End Time</th>
              <th className="border p-2 bg-gray-50">Details</th>
            </tr>
          </thead>
          <tbody>
            {data[selectedDay]?.map((slot, index) => (
              <tr key={index}>
                <td className="border p-2">{slot.start_time}</td>
                <td className="border p-2">{slot.end_time}</td>
                <td className="border p-2">
                  {renderTimeSlot(slot)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Full week view
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-50">Time</th>
            {days.map((day) => (
              <th key={day} className="border p-2 bg-gray-50 w-1/6">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from(new Set(days.flatMap(day => 
            data[day]?.map(slot => `${slot.start_time}-${slot.end_time}`) ?? []
          ))).sort(sortTimeRanges).map(timeRange => {
            const [startTime] = timeRange.split('-');
            return (
              <tr key={timeRange}>
                <td className="border p-2 font-medium whitespace-nowrap">
                  {startTime}
                </td>
                {days.map(day => {
                  const slot = data[day]?.find(s => 
                    s.start_time === startTime
                  );
                  return (
                    <td key={`${day}-${timeRange}`} className="border p-2">
                      {slot && renderTimeSlot(slot)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
