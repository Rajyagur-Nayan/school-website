"use client";

// --- React/Axios Imports ---
import { useState, useEffect, FC } from "react";
import axios from "axios";
// --- UI Imports ---
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
// --- Icons ---
import { Dot, List, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

// --- ADDED: ScrollArea for the list ---
import { ScrollArea } from "@/components/ui/scroll-area";

// --- TypeScript Type Definitions ---
interface StatCardProps {
  title: string;
  value: string;
  color: string;
}
interface GenderData {
  name: string;
  value: number;
}
interface AttendanceData {
  name: string;
  present: number;
  absent: number;
}
interface PerformanceData {
  name: string;
  avgScore: number;
}

interface EventData {
  title: string;
  time: string;
  description: string;
}
// --- ADDED: Interfaces for Exam Data ---
interface ExamData {
  subject_name: string;
  class_name: string;
  exam_date: string;
  exam_time: string;
  total_marks: string;
}
interface ApiSummaryCards {
  students: number;
  teachers: number;
  admissions: number;
}
interface ApiGenderDist {
  gender: string;
  count: string;
}
interface ApiAttendanceReport {
  day: string;
  present: string;
  absent: string;
}
interface ApiFacultyPerformance {
  faculty_name: string;
  average_score: string;
}
interface ApiClassPerformance {
  class_name: string;
  average_percentage: string;
}
interface ApiIncomeReport {
  month: string;
  income: string;
}

interface ApiUpcomingEvent {
  type: string;
  title: string;
  description: string;
  date: string;
  time: string;
}
// --- ADDED: API Interface for Exam Data ---
interface ApiUpcomingExam {
  subject_name: string;
  class_name: string;
  exam_date: string;
  start_time: string;
  total_marks: number;
}

// ---------------------------------
// --- Subcomponents / Charts ----
// ---------------------------------

// 📊 Stats Section
const StatsCards: FC<{ stats: StatCardProps[] }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((card, i) => (
        <Card key={i} className={`${card.color} rounded-2xl shadow-md`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// 🧑‍🎓 Student Gender Chart
const StudentGenderChart: FC<{ genderData: GenderData[] }> = ({
  genderData,
}) => {
  const COLORS = ["#6366f1", "#a78bfa"]; // Indigo-500, Violet-400
  const total = genderData.reduce((acc, entry) => acc + entry.value, 0);

  return (
    <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Students</CardTitle>
        <CardDescription>Total: {total}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={genderData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {genderData.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6 mt-4">
          {genderData.map((entry, index) => (
            <div className="flex items-center gap-2" key={entry.name}>
              <Dot
                className={`h-6 w-6 ${
                  index === 0 ? "text-indigo-500" : "text-violet-400"
                }`}
              />
              <div>
                <p className="text-xs text-muted-foreground">{entry.name}</p>
                <p className="font-bold">{entry.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// 📈 Daily Attendance Chart (students)
const DailyAttendanceChart: FC<{ attendanceData: AttendanceData[] }> = ({
  attendanceData,
}) => {
  return (
    <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="present" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// 👨‍🏫 Faculty Performance Chart
const FacultyPerformanceChart: FC<{ facultyPerfData: PerformanceData[] }> = ({
  facultyPerfData,
}) => {
  return (
    <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Faculty Performance</CardTitle>
        <CardDescription>Average scores</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={facultyPerfData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
            <Bar dataKey="avgScore" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// 📚 Class-wise Performance Chart
const ClassPerformanceChart: FC<{ classPerfData: PerformanceData[] }> = ({
  classPerfData,
}) => {
  return (
    <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Class-wise Performance</CardTitle>
        <CardDescription>Average exam scores by grade</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={classPerfData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v: number) => `${v.toFixed(2)}%`} />
            <Bar dataKey="avgScore" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// PROFESSOR ATTENDANCE CHART (right-side)
const ProfessorAttendanceChart: FC<{ data: AttendanceData[] }> = ({ data }) => {
  return (
    <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Professor Attendance</CardTitle>
        <CardDescription>Present / Absent (this week)</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="present"
              name="Present"
              fill="#16a34a"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="absent"
              name="Absent"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// 🗓️ Calendar Card
const CalendarCard: FC = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDate = today.getDate();
  const monthName = today.toLocaleString("default", { month: "long" });
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dates = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-center">
          {monthName} {currentYear}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center">
          {days.map((day) => (
            <div
              key={day}
              className="text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
          {dates.map((date, i) => (
            <div
              key={i}
              className={`flex items-center justify-center h-8 w-8 rounded-full text-sm ${
                date === currentDate ? "bg-violet-600 text-white" : ""
              } ${!date ? "text-transparent" : ""}`}
            >
              {date}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// 🎉 Events Card
const EventsCard: FC<{ eventsData: EventData[] }> = ({ eventsData }) => {
  return (
    <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {eventsData.length > 0 ? (
          eventsData.map((event, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-1 bg-violet-500 rounded-full" />
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{event.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {event.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {event.description}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No upcoming events.</p>
        )}
      </CardContent>
    </Card>
  );
};

// --- ADDED: Upcoming Exams Card Component ---
const UpcomingExamsCard: FC<{ examsData: ExamData[] }> = ({ examsData }) => {
  return (
    <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Upcoming Exams
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-4">
            {examsData.length > 0 ? (
              examsData.map((exam, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-1 bg-blue-500 rounded-full" />
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">
                        {exam.subject_name} ({exam.class_name})
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {exam.total_marks}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exam.exam_date} • {exam.exam_time}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No upcoming exams scheduled.
              </p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

// ---------------------------------
// --- Main Dashboard Page ---
// ---------------------------------
const SchoolDashboardPage: FC = () => {
  // --- States for fetched dashboard data ---
  const [stats, setStats] = useState<StatCardProps[]>([]);
  const [genderData, setGenderData] = useState<GenderData[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [facultyPerfData, setFacultyPerfData] = useState<PerformanceData[]>([]);
  const [classPerfData, setClassPerfData] = useState<PerformanceData[]>([]);
  const [eventsData, setEventsData] = useState<EventData[]>([]);
  // --- ADDED: State for Exams Data ---
  const [examsData, setExamsData] = useState<ExamData[]>([]);
  // --- ADDED: State for Professor Attendance ---
  const [profAttendanceData, setProfAttendanceData] = useState<
    AttendanceData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default stats for cards (colors)
  const cardStyles: { [key: string]: string } = {
    students:
      "bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200",
    teachers:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // --- Data Fetching Effect (for dashboard) ---
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      const baseUrl = `${API_URL}/admin_dashboard`;
      const config = { withCredentials: true };

      try {
        const [
          summaryRes,
          genderRes,
          attendanceRes,
          facultyPerfRes,
          classPerfRes,
          incomeRes,
          eventsRes,
          examsRes,
          profAttendanceRes,
        ] = await Promise.all([
          axios.get<ApiSummaryCards>(`${baseUrl}/summary-cards`, config),
          axios.get<ApiGenderDist[]>(`${baseUrl}/gender-distribution`, config),
          axios.get<ApiAttendanceReport[]>(
            `${baseUrl}/faculty-attendance-report`,
            config
          ),
          axios.get<ApiFacultyPerformance[]>(
            `${baseUrl}/faculty-performance`,
            config
          ),
          axios.get<ApiClassPerformance[]>(
            `${baseUrl}/class-performance`,
            config
          ),
          axios.get<ApiIncomeReport[]>(`${baseUrl}/income-report`, config), // incomeRes (keep if present server-side)
          axios.get<ApiUpcomingEvent[]>(`${baseUrl}/upcoming-events`, config),
          axios.get<ApiUpcomingExam[]>(`${baseUrl}/upcoming-exams`, config),
          axios.get<ApiAttendanceReport[]>(
            `${baseUrl}/attendance-report`,
            config
          ), // profAttendanceRes
        ]);

        // Stats
        const summaryData = summaryRes.data;
        const formattedStats: StatCardProps[] = [
          {
            title: "Students",
            value: summaryData.students.toString(),
            color: cardStyles.students,
          },
          {
            title: "Teachers",
            value: summaryData.teachers.toString(),
            color: cardStyles.teachers,
          },
        ];
        const allStatCards: StatCardProps[] = [...formattedStats];

        // Gender
        if (genderRes.data?.length)
          setGenderData(
            genderRes.data.map((i) => ({
              name: i.gender,
              value: parseInt(i.count, 10),
            }))
          );

        // Attendance (faculty-attendance-report -> used in main charts)
        if (attendanceRes.data?.length)
          setAttendanceData(
            attendanceRes.data.map((i) => ({
              name: i.day.substring(0, 3),
              present: parseInt(i.present ?? "0", 10),
              absent: parseInt(i.absent ?? "0", 10),
            }))
          );

        // Faculty Perf
        if (facultyPerfRes.data?.length)
          setFacultyPerfData(
            facultyPerfRes.data.map((i) => ({
              name: i.faculty_name,
              avgScore: parseFloat(i.average_score),
            }))
          );

        // Class Perf
        if (classPerfRes.data?.length)
          setClassPerfData(
            classPerfRes.data.map((i) => ({
              name: i.class_name,
              avgScore: parseFloat(i.average_percentage),
            }))
          );

        // Events
        if (eventsRes.data?.length)
          setEventsData(
            eventsRes.data.map((i) => ({
              title: i.title,
              time: (i.time || "").substring(0, 5),
              description: i.description,
            }))
          );

        // Exams
        if (examsRes.data?.length) {
          setExamsData(
            examsRes.data.map((i: ApiUpcomingExam) => ({
              subject_name: i.subject_name,
              class_name: i.class_name,
              exam_date: i.exam_date
                ? new Date(i.exam_date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "",
              exam_time: (i.start_time || "").substring(0, 5),
              total_marks: String(i.total_marks ?? ""),
            }))
          );
        }

        // Professor attendance (attendance-report)
        if (profAttendanceRes?.data?.length) {
          setProfAttendanceData(
            profAttendanceRes.data.map((i) => ({
              name: i.day, // show full day from your screenshot; slice to 3 chars if you prefer
              present: parseInt(i.present ?? "0", 10),
              absent: parseInt(i.absent ?? "0", 10),
            }))
          );
        }

        // Set final stats
        setStats(allStatCards);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Loading and Error UI ---
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-12 w-12 animate-spin text-violet-600" />
      </div>
    );
  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 text-red-600 p-4 text-center">
        Error: {error}
      </div>
    );

  // --- Render Dashboard ---
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <StatsCards stats={stats} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StudentGenderChart genderData={genderData} />
              <DailyAttendanceChart attendanceData={attendanceData} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FacultyPerformanceChart facultyPerfData={facultyPerfData} />
              <ClassPerformanceChart classPerfData={classPerfData} />
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Professor attendance chart placed here as requested */}
            <ProfessorAttendanceChart data={profAttendanceData} />
            <CalendarCard />
            <EventsCard eventsData={eventsData} />
            <UpcomingExamsCard examsData={examsData} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SchoolDashboardPage;
