
interface Data {
  start_time: string;
  end_time: string;
  break_time: string;
  working_days: string;
  classrooms: string;
  labs: string;
  lecture_duration: string;
  practical_duration: string;
  teachers: [{ name: string; subjects: string[] }];
}
export const generatePropmt = (data: Data) => {
  return `
    "Generate a detailed and practical weekly college timetable based on the following requirements and data inputs. The output should focus on realistic usability, ensuring teacher workload is optimized and classrooms are utilized effectively. Include break times and special rules for practical subjects.

Data Inputs:
College Timings:

Start Time: ${data?.start_time}
Break: ${data?.break_time}
End Time: ${data?.end_time}
Working Days:${data?.working_days}
Classrooms: ${data?.classrooms}
Labs: (for practical subjects only) ${data?.labs}
Lecture Halls (LH) for normal classes
Labs: (for practical subjects only)
Lecture Duration:

Each lecture lasts ${data?.lecture_duration} hour.
Practical Duration:
Each practical session lasts ${data?.practical_duration} hours.
Teachers:
Provide a detailed list of teachers and their assigned subjects:

${data?.teachers
  .map((teacher) => `${teacher.name}: ${teacher.subjects.join(", ")}`)
  .join("")}
    Special Subject Rules:
    Subjects with 'PR' in their name are practical subjects and must only be scheduled in labs (Lab1 to Lab4).
    Practical sessions are 2 consecutive slots of 1 hour each (e.g., 9:00 AM - 11:00 AM).
    Practical subjects must not exceed 2 sessions per day across all teachers.
    Timetable Requirements:
    Balanced Schedule:
    
    Distribute lectures of each subject evenly across the week to avoid clustering.
    Ensure a teacher is not assigned back-to-back lectures.
    Break Times:
    
    Teacher Workload Optimization:
    
Distribute workload evenly for all teachers throughout the week.
Output Format:
Return the timetable in the following structured JSON format, ensuring that labs are only scheduled for practical subjects and include the 2-hour practical sessions as two separate entries.

{
    "Monday": [
        { "start_time": "9:00 AM", "end_time": "10:00 AM", "subject": "Math", "teacher": "Prof. V. Iyer", "room": "LH1" },
        { "start_time": "10:00 AM", "end_time": "11:00 AM", "subject": "PR-Web Development", "teacher": "Prof. S. Desai", "room": "Lab1" },
        ...
        { "start_time": "12:00 PM", "end_time": "12:30 PM", "subject": "Break", "teacher": "", "room": "" }
        ],
        "Tuesday": [...],
        ...
        }
        Important Notes:
        Time table should utilize the entire timings ie, from ${
          data?.start_time
        } to ${data?.end_time}
        Labs must only host practical sessions (subjects with 'PR').
        The timetable should explicitly show two consecutive slots for practical subjects (e.g., 9:00 AM - 10:00 AM and 10:00 AM - 11:00 AM).
        Ensure that the generated timetable is realistic and avoids overloading teachers or rooms.
        Just return the timetable in the expected format as specified above."
        `;
};

export const getRegenerationPrompt = (data: any) => {
  return `You are a scheduling assistant for a school. Your task is to replace absent teachers for today’s timetable. Follow these rules and constraints:

Input Data:
1. Today's Timetable:
   Contains all the slots scheduled for today. Each slot includes: id, teacher, subject, room, start_time, and end_time.

   ${JSON.stringify(data.todaysTimeTable)}

2. Teachers List:
   A list of all teachers with details including: id, name, subjects (list of subjects they can teach), isAvailable (true/false), replacement (initially empty), and workload (number of lectures assigned today).

   ${JSON.stringify(data.teachers)}

3. Not Available Teachers:
   A list of teachers absent today. Update only these teachers.

   ${JSON.stringify(data.notAvailableTr)}

4. Slots to Be Replaced:
   A list of slots that require replacements due to absent teachers.

   ${JSON.stringify(data.slotsToBeReplaced)}

5. Teachers to be updated:
   ${JSON.stringify(data.notAvailableTr)}

Replacement Rules:
1. PR Subjects:
   - If the slot to be replaced is a 'PR' (practical session), find an available teacher who can teach their specific 'PR' subject.
   - Ensure workload balancing by assigning teachers with the **least number of replacement slots** for the day.
   - A teacher **cannot** be assigned more than **2 slots per day**.
   - If no teacher for a 'PR' subject is available, mark the slot as "No replacement found."

2. Lecture Subjects:
   - If the slot is a lecture (non-PR), find an available teacher who can teach their specific lecture subject.
   - Prioritize workload balancing by selecting the teacher with the **fewest replacement assignments**.
   - A teacher **cannot** be assigned more than **2 slots per day**.
   - If no teacher is available for the lecture, mark the slot as "No replacement found."

3. General:
   - Ensure replacements are **distributed evenly** to avoid overloading any single teacher.
   - **Teachers must teach their own subjects**. A replacement teacher should not teach a subject they are not qualified for.
   
   - Update the 'replacement' field of the absent teacher with the replacement teacher's name.
4.Important Notes:
- **The replacement teacher must only teach their respective subjects** and should not be assigned a subject outside their expertise. ie if the absent teacher is assigned to teach 'Mathematics' and the replacement teacher is assigned to teach 'Computer Science', the replacement teacher should only be assigned 'Computer Science' and not 'Mathematics'.

Output Requirements:
1. Updated Teachers List:
   Include **only absent teachers** with their updated replacement fields.

2. Replacement Slots:
   Each entry must include:

   prisma
   model ReplacementSlot {
     id String @id @default(uuid())
     originalTeacher String
     replacementTeacher String
     subject String
     room String
     startTime String
     endTime String
     replacementLogId String?
     replacementLog ReplacementLog? @relation(fields: [replacementLogId], references: [id])
   }

3. Replacement Logs:
   Each log must include:

   prisma
   model ReplacementLog {
     id String @id @default(uuid())
     originalTeacher String
     replacementTeacher String
     replacementSlots ReplacementSlot[]
   }

Expected Output:
- The updated teachers list with **replacement fields updated**.
- Replacement slots and logs in this format:

{
  "updatedTeachers": [
    {
      "id": "teacher-id",
      "name": "Absent Teacher Name",
      "subjects": ["Subject A", "Subject B"],
      "isAvailable": false,
      "replacement": "Replacement Teacher Name"
    }
  ],
  "replacementSlots": [
    {
      "id": "slot-id",
      "originalTeacher": "Absent Teacher Name",
      "replacementTeacher": "Replacement Teacher Name",
      "subject": "Replacement Teacher's Specific Subject", // Match PR or Lecture type
      "room": "Room Name",
      "startTime": "Start Time",
      "endTime": "End Time",
      "replacementLogId": "log-id"
    }
  ],
  "replacementLogs": [
    {
      "id": "log-id",
      "originalTeacher": "Absent Teacher Name",
      "replacementTeacher": "Replacement Teacher Name",
      "replacementSlots": ["slot-id"]
    }
  ]
}

Just return the output. Only update the teacher whose 'isAvailable' property is false.
- **Incase of PR subjects, check the list of teacehrs who teach PR subjects and if any of them do have a schedule for the day, ensure that , that teacher is not assigned as replacement.**
`;
};
