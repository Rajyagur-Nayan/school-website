// import { getCurrentUser } from "@/lib/actions/auth.action";
import React from "react";
import Agent from "../pages/Agent";
import { AppShell } from "../pages/Sidebar";

const page = async () => {
  // const user = await getCurrentUser();

  // if (!user?.userName || !user?.id) {
  //   return <div>User not found</div>; // Or redirect or show a loading/error state
  // }
  return (
    <div>
      <AppShell>
        <Agent type="generate" userName={""} userId={""} />
      </AppShell>
    </div>
  );
};

export default page;
