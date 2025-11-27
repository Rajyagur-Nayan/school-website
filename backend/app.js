const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const {
  initializeBirthdayScheduler,
} = require("./src/controllers/birthday/birthdayScheduler.js"); // Adjust path

//scheduler
initializeBirthdayScheduler();

//middlewear
app.use(
  cors({
    origin: [
      "https://school-website-nine-psi.vercel.app",
      "https://admin-smv-nine.vercel.app",
      "https://student-smv.vercel.app",
      "http://localhost:3000",
    ], // your frontend URL
    credentials: true, // allow cookies
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use("/signup", require("./src/routes/user/signup.js"));
app.use("/login", require("./src/routes/user/login.js"));
app.use("/profile", require("./src/routes/user/profile.js"));
app.use("/faculty_register", require("./src/routes/faculty/register.js"));
app.use("/add_class", require("./src/routes/addition/addClass.js"));
app.use("/add_period", require("./src/routes/addition/addPeriod.js"));
app.use("/add_subject", require("./src/routes/addition/addSubject.js"));
app.use("/add_slot", require("./src/routes/timetable/addSlot.js"));
app.use("/timetable", require("./src/routes/timetable/showTimetable.js"));
app.use("/add_student", require("./src/routes/student/addStudent.js"));
app.use("/attendance", require("./src/routes/attendance/attendance.js"));
app.use("/event", require("./src/routes/event/Event.js"));

app.use("/exam", require("./src/routes/exam/exam.js"));
app.use("/mark_get", require("./src/routes/exam/mark_get.js"));
app.use("/mark_entry", require("./src/routes/exam/mark_entry.js"));

app.use("/inventory_item", require("./src/routes/inventory/inventoryItem.js"));
app.use("/assign_item", require("./src/routes/inventory/assignItem.js"));
app.use("/add_fee", require("./src/routes/fee/addFee.js"));
app.use("/fee_payment", require("./src/routes/fee/feePayment.js"));
app.use("/create_paper", require("./src/routes/paper/createPaper.js"));
app.use("/chat_bot", require("./src/routes/paper/chatBot.js"));

app.use(
  "/admin_dashboard",
  require("./src/routes/dashboard/adminDashboard.js")
);
app.use(
  "/student_dashboard",
  require("./src/routes/dashboard/studentDashboard.js")
);
app.use("/holiday", require("./src/routes/holiday/holiday.js"));
app.use("/add", require("./src/routes/studentData/studentAdd.js"));
app.use("/add/staff", require("./src/routes/staffAdd/stafAdd.js"));
app.use("/add_school", require("./src/routes/addSchool/add_school.js"));
app.use("/login_school", require("./src/routes/addSchool/login_school.js"));

app.get("/verify-session", (req, res) => {
  const token = req.cookies.session;
  if (!token) return res.json({ success: false });

  try {
    const user = verifyJWT(token); // your JWT verification logic
    return res.json({ success: true, user });
  } catch {
    return res.json({ success: false });
  }
});

module.exports = app;
