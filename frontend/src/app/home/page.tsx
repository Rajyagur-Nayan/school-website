import React from "react";
import HomePage from "../pages/Home";
import { AppShell } from "../pages/Sidebar";

const page = () => {
  return (
    <div>
      <AppShell>
        <HomePage />
      </AppShell>
    </div>
  );
};

export default page;
