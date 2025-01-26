export const userPrompt =`
"\"Generate a detailed and practical weekly college timetable based on the following requirements and data inputs. The output should focus on realistic usability, ensuring teacher workload is optimized and classrooms are utilized effectively. Include break times and special rules for practical subjects.\n\nData Inputs:\nCollege Timings:\n\nStart Time: 9:00 AM\nBreak: 12:00 PM to 12:30 PM\nEnd Time: 3:30 PM\nWorking Days:\n\nMonday to Friday\nClassrooms:\n\nLecture Halls (LH): LH1 to LH10\nLabs: Lab1 to Lab4 (for practical subjects only)\nLecture Duration:\n\nEach lecture lasts 1 hour.\nTeachers:\nProvide a detailed list of teachers and their assigned subjects:\n\n[\n  { \"name\": \"Prof. A. Sharma\", \"subjects\": [\"Programming in C\", \"Data Structures\"] },\n  { \"name\": \"Prof. R. Mehta\", \"subjects\": [\"Computer Networks\", \"Operating Systems\"] },\n  { \"name\": \"Prof. K. Patel\", \"subjects\": [\"Database Management Systems\", \"SQL Lab\", \"PR-DBMS\"] },\n  { \"name\": \"Prof. S. Desai\", \"subjects\": [\"Web Development\", \"HTML & CSS\", \"PR-Web Development\"] },\n  { \"name\": \"Prof. M. Gupta\", \"subjects\": [\"Microprocessors\", \"Computer Organization\"] },\n  { \"name\": \"Prof. N. Rao\", \"subjects\": [\"Software Engineering\", \"Project Management\"] },\n  { \"name\": \"Prof. V. Iyer\", \"subjects\": [\"Mathematics for Computing\", \"Discrete Mathematics\"] }\n]\nSpecial Subject Rules:\nSubjects with 'PR' in their name are practical subjects and must only be scheduled in labs (Lab1 to Lab4).\nPractical sessions are 2 consecutive slots of 1 hour each (e.g., 9:00 AM - 11:00 AM).\nPractical subjects must not exceed 2 sessions per day across all teachers.\nTimetable Requirements:\nBalanced Schedule:\n\nDistribute lectures of each subject evenly across the week to avoid clustering.\nEnsure a teacher is not assigned back-to-back lectures.\nBreak Times:\n\nInclude a 30-minute break from 12:00 PM to 12:30 PM in the daily schedule.\nTeacher Workload Optimization:\n\nDistribute workload evenly for all teachers throughout the week.\nOutput Format:\nReturn the timetable in the following structured JSON format, ensuring that labs are only scheduled for practical subjects and include the 2-hour practical sessions as two separate entries.\n\n{\n  \"Monday\": [\n    { \"start_time\": \"9:00 AM\", \"end_time\": \"10:00 AM\", \"subject\": \"Math\", \"teacher\": \"Prof. V. Iyer\", \"classroom\": \"LH1\" },\n    { \"start_time\": \"10:00 AM\", \"end_time\": \"11:00 AM\", \"subject\": \"PR-Web Development\", \"teacher\": \"Prof. S. Desai\", \"classroom\": \"Lab1\" },\n    ...\n    { \"start_time\": \"12:00 PM\", \"end_time\": \"12:30 PM\", \"subject\": \"Break\", \"teacher\": \"\", \"classroom\": \"\" }\n  ],\n  \"Tuesday\": [...],\n  ...\n}\nImportant Notes:\nLabs must only host practical sessions (subjects with 'PR').\nThe timetable should explicitly show two consecutive slots for practical subjects (e.g., 9:00 AM - 10:00 AM and 10:00 AM - 11:00 AM).\nEnsure that the generated timetable is realistic and avoids overloading teachers or rooms.\nJust return the timetable in the expected format as specified above.\"\n\n\n\n\n\n\n\n\n\n\n"
`

export const assistantPrompt = "```json\n{\n  \"Monday\": [\n    {\n      \"start_time\": \"9:00 AM\",\n      \"end_time\": \"10:00 AM\",\n      \"subject\": \"Mathematics for Computing\",\n      \"teacher\": \"Prof. V. Iyer\",\n      \"classroom\": \"LH1\"\n    },\n    {\n        \"start_time\": \"10:00 AM\",\n        \"end_time\": \"11:00 AM\",\n        \"subject\": \"PR-Web Development\",\n        \"teacher\": \"Prof. S. Desai\",\n        \"classroom\": \"Lab1\"\n      },\n      {\n        \"start_time\": \"11:00 AM\",\n        \"end_time\": \"12:00 PM\",\n         \"subject\": \"PR-Web Development\",\n         \"teacher\": \"Prof. S. Desai\",\n         \"classroom\": \"Lab1\"\n       },\n    {\n      \"start_time\": \"12:00 PM\",\n      \"end_time\": \"12:30 PM\",\n      \"subject\": \"Break\",\n      \"teacher\": \"\",\n      \"classroom\": \"\"\n    },\n    {\n      \"start_time\": \"12:30 PM\",\n      \"end_time\": \"1:30 PM\",\n      \"subject\": \"Computer Networks\",\n      \"teacher\": \"Prof. R. Mehta\",\n      \"classroom\": \"LH2\"\n    },\n    {\n      \"start_time\": \"1:30 PM\",\n      \"end_time\": \"2:30 PM\",\n      \"subject\": \"Programming in C\",\n      \"teacher\": \"Prof. A. Sharma\",\n      \"classroom\": \"LH3\"\n    },\n    {\n      \"start_time\": \"2:30 PM\",\n      \"end_time\": \"3:30 PM\",\n      \"subject\": \"Software Engineering\",\n      \"teacher\": \"Prof. N. Rao\",\n      \"classroom\": \"LH4\"\n    }\n  ],\n  \"Tuesday\": [\n    {\n      \"start_time\": \"9:00 AM\",\n      \"end_time\": \"10:00 AM\",\n      \"subject\": \"Discrete Mathematics\",\n      \"teacher\": \"Prof. V. Iyer\",\n      \"classroom\": \"LH1\"\n    },\n    {\n      \"start_time\": \"10:00 AM\",\n      \"end_time\": \"11:00 AM\",\n      \"subject\": \"Operating Systems\",\n      \"teacher\": \"Prof. R. Mehta\",\n      \"classroom\": \"LH2\"\n    },\n    {\n      \"start_time\": \"11:00 AM\",\n      \"end_time\": \"12:00 PM\",\n      \"subject\": \"Data Structures\",\n      \"teacher\": \"Prof. A. Sharma\",\n      \"classroom\": \"LH3\"\n    },\n    {\n      \"start_time\": \"12:00 PM\",\n      \"end_time\": \"12:30 PM\",\n      \"subject\": \"Break\",\n      \"teacher\": \"\",\n      \"classroom\": \"\"\n    },\n    {\n      \"start_time\": \"12:30 PM\",\n      \"end_time\": \"1:30 PM\",\n        \"subject\": \"PR-DBMS\",\n      \"teacher\": \"Prof. K. Patel\",\n      \"classroom\": \"Lab2\"\n    },\n      {\n        \"start_time\": \"1:30 PM\",\n        \"end_time\": \"2:30 PM\",\n        \"subject\": \"PR-DBMS\",\n        \"teacher\": \"Prof. K. Patel\",\n        \"classroom\": \"Lab2\"\n      },\n    {\n      \"start_time\": \"2:30 PM\",\n      \"end_time\": \"3:30 PM\",\n      \"subject\": \"Project Management\",\n      \"teacher\": \"Prof. N. Rao\",\n      \"classroom\": \"LH4\"\n    }\n  ],\n  \"Wednesday\": [\n    {\n      \"start_time\": \"9:00 AM\",\n      \"end_time\": \"10:00 AM\",\n       \"subject\": \"Computer Organization\",\n        \"teacher\": \"Prof. M. Gupta\",\n      \"classroom\": \"LH1\"\n    },\n     {\n      \"start_time\": \"10:00 AM\",\n      \"end_time\": \"11:00 AM\",\n      \"subject\": \"HTML & CSS\",\n      \"teacher\": \"Prof. S. Desai\",\n       \"classroom\": \"LH2\"\n    },\n    {\n      \"start_time\": \"11:00 AM\",\n      \"end_time\": \"12:00 PM\",\n      \"subject\": \"Database Management Systems\",\n      \"teacher\": \"Prof. K. Patel\",\n      \"classroom\": \"LH3\"\n    },\n    {\n      \"start_time\": \"12:00 PM\",\n      \"end_time\": \"12:30 PM\",\n      \"subject\": \"Break\",\n      \"teacher\": \"\",\n      \"classroom\": \"\"\n    },\n    {\n      \"start_time\": \"12:30 PM\",\n      \"end_time\": \"1:30 PM\",\n        \"subject\": \"SQL Lab\",\n        \"teacher\": \"Prof. K. Patel\",\n        \"classroom\": \"Lab3\"\n      },\n      {\n        \"start_time\": \"1:30 PM\",\n        \"end_time\": \"2:30 PM\",\n          \"subject\": \"SQL Lab\",\n          \"teacher\": \"Prof. K. Patel\",\n          \"classroom\": \"Lab3\"\n      },\n    {\n      \"start_time\": \"2:30 PM\",\n      \"end_time\": \"3:30 PM\",\n         \"subject\": \"Microprocessors\",\n      \"teacher\": \"Prof. M. Gupta\",\n      \"classroom\": \"LH4\"\n    }\n  ],\n  \"Thursday\": [\n    {\n      \"start_time\": \"9:00 AM\",\n      \"end_time\": \"10:00 AM\",\n        \"subject\":\"Web Development\",\n      \"teacher\": \"Prof. S. Desai\",\n      \"classroom\": \"LH1\"\n    },\n      {\n        \"start_time\": \"10:00 AM\",\n        \"end_time\": \"11:00 AM\",\n        \"subject\": \"Programming in C\",\n        \"teacher\": \"Prof. A. Sharma\",\n        \"classroom\": \"LH2\"\n      },\n    {\n      \"start_time\": \"11:00 AM\",\n      \"end_time\": \"12:00 PM\",\n        \"subject\": \"Operating Systems\",\n        \"teacher\":\"Prof. R. Mehta\",\n      \"classroom\": \"LH3\"\n    },\n    {\n      \"start_time\": \"12:00 PM\",\n      \"end_time\": \"12:30 PM\",\n      \"subject\": \"Break\",\n      \"teacher\": \"\",\n      \"classroom\": \"\"\n    },\n    {\n      \"start_time\": \"12:30 PM\",\n      \"end_time\": \"1:30 PM\",\n      \"subject\": \"Mathematics for Computing\",\n      \"teacher\": \"Prof. V. Iyer\",\n      \"classroom\": \"LH4\"\n    },\n      {\n        \"start_time\": \"1:30 PM\",\n        \"end_time\": \"2:30 PM\",\n        \"subject\": \"Computer Networks\",\n        \"teacher\": \"Prof. R. Mehta\",\n        \"classroom\": \"LH5\"\n      },\n    {\n      \"start_time\": \"2:30 PM\",\n      \"end_time\": \"3:30 PM\",\n       \"subject\": \"Software Engineering\",\n      \"teacher\": \"Prof. N. Rao\",\n      \"classroom\": \"LH6\"\n    }\n  ],\n    \"Friday\": [\n        {\n          \"start_time\": \"9:00 AM\",\n          \"end_time\": \"10:00 AM\",\n          \"subject\": \"Discrete Mathematics\",\n          \"teacher\": \"Prof. V. Iyer\",\n          \"classroom\": \"LH1\"\n        },\n        {\n          \"start_time\": \"10:00 AM\",\n          \"end_time\": \"11:00 AM\",\n          \"subject\": \"Data Structures\",\n          \"teacher\": \"Prof. A. Sharma\",\n          \"classroom\": \"LH2\"\n        },\n        {\n            \"start_time\":\"11:00 AM\",\n            \"end_time\":\"12:00 PM\",\n            \"subject\":\"Project Management\",\n            \"teacher\":\"Prof. N. Rao\",\n            \"classroom\":\"LH3\"\n        },\n        {\n            \"start_time\": \"12:00 PM\",\n            \"end_time\": \"12:30 PM\",\n            \"subject\": \"Break\",\n            \"teacher\": \"\",\n            \"classroom\": \"\"\n        },\n        {\n           \"start_time\": \"12:30 PM\",\n            \"end_time\": \"1:30 PM\",\n            \"subject\": \"Computer Organization\",\n            \"teacher\": \"Prof. M. Gupta\",\n            \"classroom\": \"LH4\"\n        },\n        {\n            \"start_time\": \"1:30 PM\",\n             \"end_time\": \"2:30 PM\",\n             \"subject\": \"Database Management Systems\",\n              \"teacher\": \"Prof. K. Patel\",\n            \"classroom\": \"LH5\"\n        },\n        {\n            \"start_time\": \"2:30 PM\",\n            \"end_time\": \"3:30 PM\",\n            \"subject\": \"Microprocessors\",\n            \"teacher\": \"Prof. M. Gupta\",\n            \"classroom\": \"LH6\"\n         }\n    ]\n}\n```\n"

interface Data{
    start_time:string
    end_time:string
    break_time:string
    working_days:string
    classrooms:string
    labs:string
    lecture_duration:string
    practical_duration:string
    teachers:[{name:string,subjects:string[]}]
}
export const generatePropmt = (data:Data)=>{
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

${data?.teachers.map((teacher)=>`${teacher.name}: ${teacher.subjects.join(", ")}`).join("\n")}
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
        Time table should utilize the entire timings ie, from ${data?.start_time} to ${data?.end_time}
        Labs must only host practical sessions (subjects with 'PR').
        The timetable should explicitly show two consecutive slots for practical subjects (e.g., 9:00 AM - 10:00 AM and 10:00 AM - 11:00 AM).
        Ensure that the generated timetable is realistic and avoids overloading teachers or rooms.
        Just return the timetable in the expected format as specified above."
        `
        } 