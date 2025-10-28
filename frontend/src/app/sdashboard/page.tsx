import StudentDashboard from "../pages/dashboard_pages/StudentDashboard";
import { WelcomeHeader } from "../pages/dashboard_pages/WelcomeHeader";

export default function StudentDashboardRoute() {
  // Authentication checks have been removed to show the content directly.

  // A placeholder user object to pass to the components.
  const placeholderUser = { id: 0, username: "Student", role: "student" };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* The WelcomeHeader and StudentDashboard now use placeholder data 
        since a specific user is not being authenticated on this page.
      */}
      <WelcomeHeader
        name={placeholderUser.username}
        role={placeholderUser.role}
      />
      <StudentDashboard />
    </div>
  );
}
