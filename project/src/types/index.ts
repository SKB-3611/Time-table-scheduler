export interface User {
  id: string;
  name: string;
  role: 'student' | 'teacher' | 'admin';
  username: string;
  password: string;
}
export interface Teacher extends User{
  subjects: string[];
}


export interface TeacherAvailability {
  teacherId: string;
  available: boolean;
}

export interface Subject {
  name: string;
  teachers: string[];
}

export interface CollegeProps {
  startTime: string;
  endTime: string;
  duration: number;
  breakStart: string;
  breakEnd: string;
  workingDays: string;
  clasrooms: string;
}
export interface TimeSlot {
  start_time: string;
  end_time: string;
  subject: string;
  teacher: string;
  classroom: string;
}

export interface TimetableData {
  [key: string]: TimeSlot[];
}

export interface TimetableProps {
  data: TimetableData;
  showDays?: boolean;
  selectedDay?: string;
}