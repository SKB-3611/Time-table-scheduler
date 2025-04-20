
# API Routes Documentation

## Base URL
`https://time-table-scheduler-j9ry.onrender.com`

---

## 📁 File: `timetable.ts`

### POST `/generate`
Generates a weekly timetable using Google Generative AI.

#### Request Body
```json
{
  "start_time": "09:00",
  "end_time": "17:00",
  "break_time": "13:00",
  "working_days": "Monday to Friday",
  "classrooms": "5",
  "labs": "2",
  "lecture_duration": "45",
  "practical_duration": "90",
  "teachers": [
    { "name": "Alice", "subjects": ["Math", "Physics"] },
    { "name": "Bob", "subjects": ["Chemistry"] }
  ]
}
```

#### Response
```json
{
  "status": "success",
  "message": "Timetable generated successfully",
  "timetableJSON": {
    "Monday": [...],
    "Tuesday": [...],
    ...
  }
}
```

---

### POST `/addTeacher`
Adds or updates a teacher.

#### Request Body
```json
{
  "username": "john_doe",
  "name": "John Doe",
  "subjects": ["Math", "Physics"],
  "password": "securepassword123"
}
```

#### Response
```json
{
  "status": "success",
  "message": "Teacher added successfully"
}
```

---

### POST `/deleteTeacher`
Deletes a teacher by username.

#### Request Body
```json
{
  "username": "john_doe"
}
```

#### Response
```json
{
  "status": "success",
  "message": "Teacher deleted successfully"
}
```

---

### GET `/clearTimetable`
Clears the entire timetable and slot entries.

#### Response
```json
{
  "status": "success",
  "message": "Timetable cleared successfully"
}
```

---

### GET `/getTeachers`
Fetches all teachers and their availability.

#### Response
```json
{
  "status": "success",
  "message": "Teachers fetched successfully",
  "teachers": [
    {
      "name": "John Doe",
      "username": "john_doe",
      "subjects": ["Math"],
      "isAvailable": true
    },
    ...
  ]
}
```

---

## 📁 File: `auth.ts`

### POST `/login`
Authenticates a teacher, student, or admin.

#### Request Body
```json
{
  "username": "teacher1",
  "password": "pass123",
  "role": "teacher"
}
```

#### Response (for teacher)
```json
{
  "status": "success",
  "message": "Login successful",
  "user": {
    "name": "John Doe",
    "username": "john_doe",
    "role": "TEACHER",
    "isAvailable": true
  }
}
```

#### Response (for admin/student)
```json
{
  "status": "success",
  "message": "Login successful",
  "user": {
    "username": "admin",
    "role": "admin"
  }
}
```

---

## 📁 File: `common.ts`

### GET `/timetable`
Fetches the full timetable along with replacement slots for unavailable teachers.

#### Response
```json
{
  "status": "success",
  "timetable": [
    {
      "day": "Monday",
      "slots": [
        {
          "teacher": "john_doe",
          "subject": "Math",
          ...
        }
      ]
    },
    ...
  ],
  "replacementSlots": [
    {
      "replacementTeacher": "jane_doe",
      ...
    }
  ]
}
```

---

## 📁 File: `getSchedule.ts`

### POST `/getSchedule`
Returns a specific teacher's schedule for a given day.

#### Request Body
```json
{
  "name": "john_doe",
  "day": "Monday"
}
```

#### Response
```json
{
  "status": "success",
  "schedule": [...], // normal slots
  "replacementSlots": [...] // any replacement slots for that teacher
}
```

---

