import { TimeSlot } from '../types';
const renderTimeSlot = (slot: TimeSlot,showtime:boolean=false) => (
  <div className={`p-2 rounded ${slot.subject === 'Break' ? 'bg-gray-50' : 'bg-blue-50'}`}>
    {slot.subject !== 'Break' ? (
      <>
      <div className='flex justify-between w-full'>

        <div className="font-medium">
          {slot.subject}
          {slot.subject.includes('PR') && 
            <span className="ml-1 text-xs bg-blue-200 text-blue-800 px-1 rounded">
              Practical
            </span>
          }
        </div>
          {showtime && <span className="text-sm text-gray-800">{slot.start_time} - {slot.end_time}</span>}
          </div>
        <div className="text-sm text-gray-600">Room: {slot.room}</div>
        <div className="text-sm text-gray-600">{slot.teacher}</div>
      </>
    ) : (
      <div className="text-center font-medium text-gray-500">Break</div>
    )}
  </div>
);

const parseTime = (time: string) => {
  const [hours, minutesPart] = time.replace(/AM|PM/, '').split(':').map(Number);
  const isPM = time.includes('PM');
  const hours24 = (hours % 12) + (isPM ? 12 : 0);
  return hours24 * 60 + (minutesPart || 0);
};

const sortTimeRanges = (timeRangeA: TimeSlot, timeRangeB: TimeSlot) => {
  return parseTime(timeRangeA.start_time) - parseTime(timeRangeB.start_time);
};

export { renderTimeSlot, sortTimeRanges, parseTime };