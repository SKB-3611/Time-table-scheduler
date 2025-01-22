import { TimeSlot, User, Subject, SchoolTiming } from '../types';

const rooms = ['101', '102', '103', '104', '105'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

interface TeacherSchedule {
  [key: string]: {
    [key: string]: {
      [key: string]: boolean;
    };
  };
}

let globalTimetable: TimeSlot[] = [];

function generateTimeSlots(timing: SchoolTiming, duration: number): { start: string; end: string }[] {
  const slots: { start: string; end: string }[] = [];
  const [startHour] = timing.startTime.split(':').map(Number);
  const [endHour] = timing.endTime.split(':').map(Number);

  for (let hour = startHour; hour < endHour; hour += duration) {
    const start = `${String(hour).padStart(2, '0')}:00`;
    const end = `${String(hour + duration).padStart(2, '0')}:00`;
    slots.push({ start, end });
  }

  return slots;
}

export function generateTimetable(
  teachers: User[],
  subjects: Subject[],
  timing: SchoolTiming
): TimeSlot[] {
  const timetable: TimeSlot[] = [];
  const teacherSchedule: TeacherSchedule = {};
  let idCounter = 1;

  // Generate default 1-hour slots
  const defaultTimeSlots = generateTimeSlots(timing, timing.duration);

  // Initialize teacher schedule
  teachers.forEach((teacher) => {
    teacherSchedule[teacher.name] = {};
    days.forEach((day) => {
      teacherSchedule[teacher.name][day] = {};
      defaultTimeSlots.forEach((time) => {
        teacherSchedule[teacher.name][day][time.start] = false;
      });
    });
  });

  // Generate timetable
  days.forEach((day) => {
    defaultTimeSlots.forEach((time, index) => {
      const shuffledRooms = [...rooms].sort(() => Math.random() - 0.5);
      const shuffledSubjects = [...subjects].sort(() => Math.random() - 0.5);

      let roomIndex = 0;

      shuffledSubjects.forEach((subject) => {
        if (roomIndex >= shuffledRooms.length) return;

        const isPractical = subject.name.includes('(PR)');
        const duration = isPractical ? timing.duration * 2 : timing.duration;
        const consecutiveTimeSlot = defaultTimeSlots[index + 1];

        // Get available teachers for this subject
        const availableTeachers = subject.teachers.filter(
          (teacher) =>
            !teacherSchedule[teacher]?.[day]?.[time.start] &&
            (!isPractical || (consecutiveTimeSlot && !teacherSchedule[teacher]?.[day]?.[consecutiveTimeSlot.start]))
        );

        if (availableTeachers.length > 0) {
          const selectedTeacher = availableTeachers[Math.floor(Math.random() * availableTeachers.length)];
          const slot: TimeSlot = {
            id: String(idCounter++),
            day,
            startTime: time.start,
            endTime: `${String(Number(time.start.split(':')[0]) + duration).padStart(2, '0')}:00`,
            subject: subject.name,
            teacher: selectedTeacher,
            room: shuffledRooms[roomIndex],
          };

          timetable.push(slot);
          teacherSchedule[selectedTeacher][day][time.start] = true;

          if (isPractical && consecutiveTimeSlot) {
            teacherSchedule[selectedTeacher][day][consecutiveTimeSlot.start] = true;
          }

          roomIndex++;
        }
      });
    });
  });

  globalTimetable = timetable;
  console.log(timetable);
  return timetable;
}

export function getGlobalTimetable(): TimeSlot[] {
  return globalTimetable;
}
