"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CheckCircle,
  Award,
  FileText,
  Clock,
  ArrowUpRight,
  DollarSign, // --- 1. Added new icon ---
} from "lucide-react";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
// --- 2. Added Table components ---
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// --- React and Axios Imports ---
import { useState, useEffect, ReactNode, FC } from "react";
import axios from "axios";

// --- TypeScript Type Definitions ---

interface StatCardData {
  title: string;
  value: string;
  icon: ReactNode;
  color: string;
}

interface ScheduleItem {
  time: string;
  subject: string;
  teacher: string;
  class: string;
  color: string;
}

interface ChartDataItem {
  month: string;
  attended: number;
}

interface RadarDataItem {
  subject: string;
  score: number;
  fullMark: number;
}

interface LineDataItem {
  name: string;
  score: number;
}

interface EventItem {
  title: string;
  time: string;
  description: string;
}

interface AnnouncementItem {
  title: string;
  date: string;
  description: string;
}

// --- Raw API Response Types (based on screenshots) ---

interface ApiSummary {
  overall_grade: number;
  upcoming_exams_count: number;
}

interface ApiAttendance {
  overall_attendance: number;
  attendance_trend: { month: string; percentage: string }[];
}

interface ApiPerformance {
  recent_performance: { label: string; score: number }[];
  subject_performance: { subject_name: string; average_score: string }[];
}

interface ApiFeeStatus {
  total_dues: string;
  total_paid: string;
  balance_due: string;
  status: "Paid" | "Due" | "No Dues";
}

interface ApiScheduleItem {
  time: string;
  subject_name: string;
  faculty: string;
}

interface ApiEventItem {
  title: string;
  description: string;
  date: string;
  time: string;
}

interface ApiAnnouncementItem {
  title: string;
  description: string;
  date: string;
  time: string;
}

// --- 3. Added interface for Exam Results ---
interface ApiExamResult {
  exam_date: string;
  exam_name: string;
  subject_name: string;
  marks_obtained: number;
  total_marks: number;
  percentage: string; // Comes as string from backend
}

// --- Mock Data (Used as fallback or for missing APIs) ---
const mockData = {
  stats: [
    {
      title: "Overall Grade",
      value: "...",
      icon: <Award className="h-5 w-5 text-violet-500" />,
      color: "from-violet-500/10 to-violet-600/10",
    },
    {
      title: "Attendance",
      value: "...",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      color: "from-green-500/10 to-green-600/10",
    },
    {
      title: "Upcoming Exams",
      value: "...",
      icon: <FileText className="h-5 w-5 text-red-600" />,
      color: "from-red-500/10 to-red-600/10",
    },
  ],
};

// --- 📊 Stats Section ---
const StatsCards: FC<{ stats: StatCardData[] }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((card, i) => (
        <Card
          key={i}
          className={`bg-gradient-to-br ${card.color} border border-gray-200/40 dark:border-gray-700/40 rounded-2xl hover:scale-[1.02] hover:shadow-lg transition-all`}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-700 dark:text-gray-300 font-medium">
              {card.title}
            </CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// --- 🗓️ Today's Schedule ---
const TodaySchedule: FC<{ schedule: ScheduleItem[] }> = ({ schedule }) => (
  <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
    <CardHeader>
      <CardTitle>Today&apos;s Schedule</CardTitle>
      <CardDescription>Your upcoming classes for today.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {schedule.length > 0 ? (
        schedule.map((item) => (
          <div
            key={item.subject + item.time}
            className={`p-4 rounded-lg flex items-center justify-between ${item.color} dark:bg-opacity-20 dark:text-white/90`}
          >
            <div className="flex items-center gap-4">
              <Clock className="h-5 w-5" />
              <div>
                <p className="font-semibold">{item.subject}</p>
                <p className="text-xs opacity-80">{item.time}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm">{item.teacher}</p>
              <p className="text-xs opacity-80">{item.class}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-muted-foreground">
          No classes scheduled for today.
        </p>
      )}
    </CardContent>
    <CardFooter className="border-t pt-4">
      <Button asChild variant="outline" size="sm" className="ml-auto">
        <Link href="/timetable-management/view/class-wise">
          View Full Timetable
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

// --- 📈 Attendance Trend Chart ---
const AttendanceTrendChart: FC<{ trendData: ChartDataItem[] }> = ({
  trendData,
}) => (
  <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
    <CardHeader>
      <CardTitle>Attendance Trend</CardTitle>
      <CardDescription>Your attendance over the last 6 months.</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="attended"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// --- 🎯 Subject Performance (Radar) ---
const SubjectPerformanceChart: FC<{ performanceData: RadarDataItem[] }> = ({
  performanceData,
}) => {
  const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"];

  return (
    <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Subject Performance</CardTitle>
        <CardDescription>Your average score in each subject.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={performanceData}
              dataKey="score"
              nameKey="subject"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              labelLine={false}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                percent,
              }) => {
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? "start" : "end"}
                    dominantBaseline="central"
                    className="text-xs"
                  >
                    {`${(percent * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {performanceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [
                `${value.toFixed(0)}%`,
                name,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

// --- 🏅 Recent Performance (Line) ---
const RecentPerformanceChart: FC<{ performanceData: LineDataItem[] }> = ({
  performanceData,
}) => (
  <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
    <CardHeader>
      <CardTitle>Recent Performance</CardTitle>
      <CardDescription>
        Your scores on recent tests & assignments.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(v: number) => `${v.toFixed(0)}%`} />
          <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// --- 🗓️ Calendar Card ---
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

// --- 🎉 Events Card ---
const EventsCard: FC<{ events: EventItem[] }> = ({ events }) => {
  return (
    <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length > 0 ? (
          events.map((event, i) => (
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

// --- 🧾 Announcements Card ---
const AnnouncementsCard: FC<{ announcements: AnnouncementItem[] }> = ({
  announcements,
}) => {
  const list = announcements;
  return (
    <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Notice</CardTitle>
        <a
          href="#"
          className="text-sm font-medium text-violet-600 hover:underline"
        >
          View All
        </a>
      </CardHeader>
      <CardContent className="space-y-4">
        {list.length > 0 ? (
          list.map((a, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-medium text-sm">{a.title}</h3>
                <span className="text-xs text-muted-foreground">{a.date}</span>
              </div>
              <p className="text-sm text-muted-foreground">{a.description}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No new announcements.</p>
        )}
      </CardContent>
    </Card>
  );
};

// --- *** NEW HELPER FUNCTION *** ---
const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") {
    return null;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
};

// --- 4. NEW: Exam Results Card ---
const ExamResultsCard: FC<{ results: ApiExamResult[] }> = ({ results }) => (
  <Card className="rounded-2xl shadow-md bg-white dark:bg-slate-900">
    <CardHeader>
      <CardTitle>Exam Results</CardTitle>
      <CardDescription>Your marks in recent exams.</CardDescription>
    </CardHeader>
    <CardContent>
      {results.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Exam</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="text-right">Marks</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableCell>
                  {new Date(result.exam_date).toLocaleDateString("en-GB")}
                </TableCell>
                <TableCell>{result.exam_name}</TableCell>
                <TableCell>{result.subject_name}</TableCell>
                <TableCell className="text-right">
                  {result.marks_obtained}
                </TableCell>
                <TableCell className="text-right">
                  {result.total_marks}
                </TableCell>
                <TableCell className="text-right">
                  {result.percentage}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-sm text-muted-foreground">No exam results found.</p>
      )}
    </CardContent>
    {/* Optional Footer for a link to full results */}
    {/* <CardFooter className="border-t pt-4">
      <Button asChild variant="outline" size="sm" className="ml-auto">
        <Link href="/exam-results">
          View All Results
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </CardFooter> */}
  </Card>
);

// --- 🏫 Main Student Dashboard Page ---
const StudentDashboard: FC = () => {
  // --- States for fetched data ---
  const [stats, setStats] = useState<StatCardData[]>(mockData.stats);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [attendanceTrend, setAttendanceTrend] = useState<ChartDataItem[]>([]);
  const [subjectPerformance, setSubjectPerformance] = useState<RadarDataItem[]>(
    []
  );
  const [recentPerformance, setRecentPerformance] = useState<LineDataItem[]>(
    []
  );
  const [events, setEvents] = useState<EventItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  // --- 5. Added state for exam results ---
  const [examResults, setExamResults] = useState<ApiExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      const studentId = getCookie("student_id");

      if (!studentId) {
        setError("Student ID not found. Please log in again.");
        setLoading(false);
        return;
      }

      const baseUrl = `${process.env.NEXT_PUBLIC_API_URL}/student_dashboard`;
      const config = { withCredentials: true };

      try {
        // --- 6. Added 'examResultsRes' to Promise.all ---
        const [
          summaryRes,
          attendanceRes,
          performanceRes,
          scheduleRes,
          eventsRes,
          announcementsRes,
          feesRes,
          examResultsRes, // <-- New API call
        ] = await Promise.all([
          axios.get<ApiSummary>(`${baseUrl}/${studentId}/summary`, config),
          axios.get<ApiAttendance>(
            `${baseUrl}/${studentId}/attendance`,
            config
          ),
          axios.get<ApiPerformance>(
            `${baseUrl}/${studentId}/performance`,
            config
          ),
          axios.get<ApiScheduleItem[]>(
            `${baseUrl}/${studentId}/schedule`,
            config
          ),
          axios.get<ApiEventItem[]>(
            `${baseUrl}/${studentId}/upcoming-events`,
            config
          ),
          axios.get<ApiAnnouncementItem[]>(
            `${baseUrl}/${studentId}/upcoming-announcements`,
            config
          ),
          axios.get<ApiFeeStatus>(`${baseUrl}/${studentId}/fees`, config),
          // --- 7. Added the new API call for exam results ---
          axios.get<ApiExamResult[]>(
            `${baseUrl}/${studentId}/exam-results`,
            config
          ),
        ]);

        console.log("Summary Response Data:", summaryRes.data);
        console.log("Attendance Response Data:", attendanceRes.data);
        console.log("Performance Response Data:", performanceRes.data);
        console.log("Schedule Response Data:", scheduleRes.data); // Log actual data
        console.log("Events Response Data:", eventsRes.data); // Log actual data
        console.log("Fees Response Data:", feesRes.data);
        console.log("Exam Results Response Data:", examResultsRes.data); // Added log

        // --- Process Stats Data ---
        const summaryData = summaryRes.data;
        const attendanceData = attendanceRes.data;
        const feesData = feesRes.data;

        const newStats: StatCardData[] = [
          {
            title: "Balance Due",
            value: feesData
              ? `₹${parseFloat(feesData.balance_due).toLocaleString("en-IN")}`
              : "N/A",
            icon: <DollarSign className="h-5 w-5 text-blue-600" />,
            color: "from-blue-500/10 to-blue-600/10",
          },
          {
            ...mockData.stats[0], // Overall Grade
            value: summaryData ? `${summaryData.overall_grade}%` : "N/A",
          },
          {
            ...mockData.stats[1], // Attendance
            value: attendanceData
              ? `${attendanceData.overall_attendance}%`
              : "N/A",
          },
          {
            ...mockData.stats[2], // Upcoming Exams
            value: summaryData
              ? summaryData.upcoming_exams_count.toString()
              : "N/A",
          },
        ];
        setStats(newStats);

        // --- Process Attendance Trend Data ---
        const formattedAttTrend =
          attendanceData && attendanceData.attendance_trend
            ? attendanceData.attendance_trend.map((item) => ({
                month: item.month.substring(0, 3),
                attended: parseInt(item.percentage) || 0,
              }))
            : [];
        setAttendanceTrend(formattedAttTrend);

        // --- Process Schedule Data ---
        const scheduleData = scheduleRes.data; // Use data property
        const formattedSchedule =
          Array.isArray(scheduleData) && scheduleData.length > 0 // Check if it's a non-empty array
            ? scheduleData.map((item: ApiScheduleItem) => ({
                time: item.time,
                subject: item.subject_name,
                teacher: item.faculty,
                class: "N/A",
                color:
                  "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
              }))
            : [];
        setSchedule(formattedSchedule);

        // --- Process Performance Data ---
        const performanceData = performanceRes.data;

        console.log(
          "Value of performanceData.recent_performance:",
          performanceData?.recent_performance
        );

        const formattedRecent =
          performanceData && performanceData.recent_performance
            ? performanceData.recent_performance.map((item) => ({
                name: item.label,
                score: parseInt(item.score.toString()) || 0,
              }))
            : [];

        const formattedSubject =
          performanceData && performanceData.subject_performance
            ? performanceData.subject_performance.map((item) => ({
                subject: item.subject_name,
                score: parseFloat(item.average_score) || 0,
                fullMark: 100,
              }))
            : [];

        setRecentPerformance(formattedRecent);
        setSubjectPerformance(formattedSubject);

        // --- Process Events Data ---
        const eventsData = eventsRes.data; // Use data property
        const formattedEvents =
          Array.isArray(eventsData) && eventsData.length > 0 // Check if it's a non-empty array
            ? eventsData.map((item: ApiEventItem) => ({
                title: item.title,
                description: item.description,
                time: item.time ? item.time.substring(0, 5) : "N/A", // Handle potential null time
              }))
            : [];
        setEvents(formattedEvents);

        // --- Process Announcements Data ---
        const announcementsData = announcementsRes.data; // Use data property
        const formattedAnnouncements =
          Array.isArray(announcementsData) && announcementsData.length > 0 // Check if it's a non-empty array
            ? announcementsData.map((item: ApiAnnouncementItem) => ({
                title: item.title,
                description: item.description,
                date: new Date(item.date).toLocaleDateString("en-GB"),
              }))
            : [];
        setAnnouncements(formattedAnnouncements);

        // --- 8. Process Exam Results Data ---
        const examData = examResultsRes.data; // Use data property
        const formattedExamResults =
          Array.isArray(examData) && examData.length > 0 // Check if it's a non-empty array
            ? examData
            : []; // Data is already in good format
        setExamResults(formattedExamResults);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // --- Loading and Error UI (No Change) ---
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        Loading student dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 text-red-600">
        Error: {error}
      </div>
    );
  }

  // --- Render Dashboard ---
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <StatsCards stats={stats} />
            <TodaySchedule schedule={schedule} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AttendanceTrendChart trendData={attendanceTrend} />
              <RecentPerformanceChart performanceData={recentPerformance} />
            </div>
            {/* --- 9. Added ExamResultsCard here --- */}
            <ExamResultsCard results={examResults} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SubjectPerformanceChart performanceData={subjectPerformance} />
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            <CalendarCard />
            <EventsCard events={events} />
            <AnnouncementsCard announcements={announcements} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
