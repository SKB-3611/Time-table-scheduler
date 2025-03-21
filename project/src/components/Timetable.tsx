import { parseTime, sortTimeRanges, renderTimeSlot } from "../utils/utils"

interface TimeSlot {
  start_time: string
  end_time: string
  subject: string
  teacher: string
  room: string
}

interface TimetableData {
  [key: string]: TimeSlot[]
}

interface TimetableProps {
  data: TimetableData
  showDays?: boolean
  selectedDay?: string
}

export default function Timetable({ data, showDays = true, selectedDay }: TimetableProps) {
  const days = data ? Object.keys(data) : []

  // Single day view
  if (!showDays && selectedDay) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-50 w-1/4 text-xs sm:text-sm md:text-base">Start Time</th>
              <th className="border p-2 bg-gray-50 w-1/4 text-xs sm:text-sm md:text-base">End Time</th>
              <th className="border p-2 bg-gray-50 text-xs sm:text-sm md:text-base">Details</th>
            </tr>
          </thead>
          <tbody>
            {data[selectedDay]?.sort(sortTimeRanges).map((slot, index) => (
              <tr key={index}>
                <td className="border p-2 text-xs sm:text-sm md:text-base">{slot.start_time}</td>
                <td className="border p-2 text-xs sm:text-sm md:text-base">{slot.end_time}</td>
                <td className="border p-2 text-xs sm:text-sm md:text-base">{renderTimeSlot(slot)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Full week view
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-50 text-xs sm:text-sm md:text-base">Time</th>
            {days.map((day) => (
              <th key={day} className="border p-2 bg-gray-50 w-1/6 text-xs sm:text-sm md:text-base">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from(
            new Set(days.flatMap((day) => data[day]?.map((slot) => `${slot.start_time}-${slot.end_time}`) ?? [])),
          )
            .sort((a, b) => {
              const [startA] = a.split("-")
              const [startB] = b.split("-")
              return parseTime(startA) - parseTime(startB)
            })
            .map((timeRange) => {
              const [startTime, endTime] = timeRange.split("-")

              return (
                <tr key={timeRange}>
                  <td className="border p-2 font-medium whitespace-nowrap text-xs sm:text-sm md:text-base">
                    {startTime} - {endTime}
                  </td>
                  {days.map((day) => {
                    const slot = data[day]?.find((s) => s.start_time === startTime)
                    return (
                      <td key={`${day}-${timeRange}`} className="border p-2 text-xs sm:text-sm md:text-base">
                        {slot && renderTimeSlot(slot)}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}

