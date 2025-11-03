// import { getCurrentUser } from "@/lib/actions/auth.action";
import React from "react";
import Agent from "../pages/Agent";

const page = async () => {
  // const user = await getCurrentUser();

  // if (!user?.userName || !user?.id) {
  //   return <div>User not found</div>; // Or redirect or show a loading/error state
  // }
  return (
    <div>
      <Agent type="generate" userName={""} userId={""} />
    </div>
  );
};

export default page;
