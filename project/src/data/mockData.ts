import { User, TimeSlot } from '../types';

// Start with just the admin user
export const users: User[] = [{
  id: '1',
  name: 'Admin User',
  role: 'admin',
  username: 'admin',
  password: 'admin123'
},
{
  id: '2',
  name: 'student',
  role: 'student',
  username: 'student',
  password: 'student123'
}
];

export const timetableData: TimeSlot[] = [];