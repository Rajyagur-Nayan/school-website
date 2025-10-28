"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter, // Import CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Button } from "@/components/ui/button"; // Import Button
import Link from "next/link"; // Import Link
import {
  ClipboardList,
  CheckCircle,
  Award,
  FileText,
  Clock,
  Dot,
  ArrowUpRight, // Import ArrowUpRight
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

// --- Mock Data for Student Dashboard ---
const mockData = {
  user: {
    username: "Stella Lewis",
    role: "Student",
    avatarFallback: "SL",
  },
  stats: [
    {
      title: "Overall Grade",
      value: "88.2%",
      icon: <Award className="h-5 w-5 text-violet-500" />,
      color: "from-violet-500/10 to-violet-600/10",
    },
    {
      title: "Attendance",
      value: "94%",
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      color: "from-green-500/10 to-green-600/10",
    },
    {
      title: "Pending Assignments",
      value: "3",
      icon: <ClipboardList className="h-5 w-5 text-yellow-600" />,
      color: "from-yellow-500/10 to-yellow-600/10",
    },
    {
      title: "Upcoming Exams",
      value: "2",
      icon: <FileText className="h-5 w-5 text-red-600" />,
      color: "from-red-500/10 to-red-600/10",
    },
  ],
  todaySchedule: [
    {
      time: "09:00 - 09:45 AM",
      subject: "Physics",
      class: "10-A",
      teacher: "Mr. Sharma",
      // Light: light sky bg, medium sky text
      // Dark: dark sky bg, light sky text
      color: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-200",
    },
    {
      time: "10:00 - 10:45 AM",
      subject: "Chemistry",
      class: "10-A",
      teacher: "Mrs. Desai",
      // Light: light pink bg, dark pink text
      // Dark: dark pink bg, light pink text
      color: "bg-pink-100 text-pink-900 dark:bg-pink-950 dark:text-pink-200",
    },
    {
      time: "11:00 - 11:45 AM",
      subject: "Mathematics",
      class: "10-A",
      teacher: "Mr. Kumar",
      // Light: light violet bg, dark violet text
      // Dark: dark violet bg, light violet text
      color:
        "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-200",
    },
  ],
  // --- NEW MOCK DATA ---
  pendingAssignments: [
    {
      title: "Physics Lab Report",
      subject: "Physics",
      dueDate: "22 Sep 2024",
      color: "text-sky-600",
    },
    {
      title: "History Essay: WW2",
      subject: "History",
      dueDate: "24 Sep 2024",
      color: "text-amber-600",
    },
    {
      title: "Trigonometry Problem Set",
      subject: "Mathematics",
      dueDate: "25 Sep 2024",
      color: "text-violet-600",
    },
  ],
  attendanceTrend: [
    { month: "Apr", attended: 95 },
    { month: "May", attended: 98 },
    { month: "Jun", attended: 92 },
    { month: "Jul", attended: 97 },
    { month: "Aug", attended: 94 },
    { month: "Sep", attended: 95 },
  ],
  subjectPerformance: [
    { subject: "Math", score: 88, fullMark: 100 },
    { subject: "Science", score: 92, fullMark: 100 },
    { subject: "English", score: 76, fullMark: 100 },
    { subject: "History", score: 82, fullMark: 100 },
    { subject: "Art", score: 95, fullMark: 100 },
  ],
  recentPerformance: [
    { name: "Math Quiz 1", score: 85 },
    { name: "History Essay", score: 78 },
    { name: "Science Lab", score: 92 },
    { name: "English Test", score: 81 },
    { name: "Math Quiz 2", score: 90 },
  ],
};

// --- 📊 Stats Section ---
const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {mockData.stats.map((card, i) => (
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

// --- 🗓️ Today's Schedule (IMPROVED) ---
const TodaySchedule = () => (
  <Card className="rounded-2xl border shadow-sm">
    <CardHeader>
      <CardTitle>Today&apos;s Schedule</CardTitle>
      <CardDescription>Your upcoming classes for today.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {mockData.todaySchedule.map((item) => (
        <div
          key={item.subject}
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
      ))}
    </CardContent>
    {/* --- NEW FOOTER --- */}
    <CardFooter className="border-t pt-4">
      <Button asChild variant="outline" size="sm" className="ml-auto">
        <Link href="/timetable">
          View Full Timetable
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

// --- 📈 Attendance Trend Chart ---
const AttendanceTrendChart = () => (
  <Card className="rounded-2xl border shadow-sm">
    <CardHeader>
      <CardTitle>Attendance Trend</CardTitle>
      <CardDescription>Your attendance over the last 6 months.</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={mockData.attendanceTrend}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="month" />
          <YAxis domain={[80, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip />
          <Bar dataKey="attended" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// --- 🎯 Subject Performance (Radar) ---
const SubjectPerformanceChart = () => (
  <Card className="rounded-2xl border shadow-sm">
    <CardHeader>
      <CardTitle>Subject Performance</CardTitle>
      <CardDescription>Your average score in each subject.</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={{}} className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={mockData.subjectPerformance}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar
              name="Score"
              dataKey="score"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.6}
            />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </CardContent>
  </Card>
);

// --- 🏅 Recent Performance (Line) ---
const RecentPerformanceChart = () => (
  <Card className="rounded-2xl border shadow-sm">
    <CardHeader>
      <CardTitle>Recent Performance</CardTitle>
      <CardDescription>
        Your scores on recent tests & assignments.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={mockData.recentPerformance}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="name" />
          <YAxis domain={[50, 100]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

// --- 📚 Pending Assignments (NEW) ---
const PendingAssignments = () => (
  <Card className="rounded-2xl border shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>Pending Assignments</CardTitle>
      <a
        href="/assignments"
        className="text-sm font-medium text-violet-600 hover:underline"
      >
        View All
      </a>
    </CardHeader>
    <CardContent>
      <ul className="space-y-4">
        {mockData.pendingAssignments.map((item) => (
          <li
            key={item.title}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <Dot className={`h-5 w-5 ${item.color}`} />
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  Due: {item.dueDate}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={item.color}>
              {item.subject}
            </Badge>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

// --- 🗓️ Calendar Card ---
const CalendarCard = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dates = [
    ...Array(6).fill(null), // Offset for 1st day (Sunday)
    ...Array.from({ length: 30 }, (_, i) => i + 1),
  ];

  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader>
        <CardTitle className="text-center">September 2024</CardTitle>
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
                date === 14 ? "bg-violet-600 text-white" : ""
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
const EventsCard = () => {
  const events = [
    {
      title: "Science Fair",
      time: "10:00 - 18:00",
      description: "Annual school science fair. Submissions are due today.",
    },
    {
      title: "History Midterm",
      time: "10:00 - 14:00",
      description: "Midterm exam for Grade 10 History classes.",
    },
  ];
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader>
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event, i) => (
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
        ))}
      </CardContent>
    </Card>
  );
};

// --- 🧾 Announcements Card ---
const AnnouncementsCard = () => {
  const list = [
    {
      title: "Picture Day Reminder",
      date: "10/09/2024",
      description:
        "School Picture Day is tomorrow! Don't forget to wear your full uniform.",
    },
    {
      title: "Math Olympiad Sign-up",
      date: "10/09/2024",
      description: "Sign-ups for the Math Olympiad are now open in the office.",
    },
  ];
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Announcements</CardTitle>
        <a
          href="#"
          className="text-sm font-medium text-violet-600 hover:underline"
        >
          View All
        </a>
      </CardHeader>
      <CardContent className="space-y-4">
        {list.map((a, i) => (
          <div key={i}>
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-medium text-sm">{a.title}</h3>
              <span className="text-xs text-muted-foreground">{a.date}</span>
            </div>
            <p className="text-sm text-muted-foreground">{a.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

// --- 🏫 Main Student Dashboard Page ---
export default function StudentDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            <StatsCards />
            <TodaySchedule />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AttendanceTrendChart />
              <RecentPerformanceChart />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SubjectPerformanceChart />
              {/* --- REPLACED "SubjectMarks" WITH "PendingAssignments" --- */}
              <PendingAssignments />
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            <CalendarCard />
            <EventsCard />
            <AnnouncementsCard />
          </div>
        </main>
      </div>
    </div>
  );
}
