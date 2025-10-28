import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppShell } from "../pages/Sidebar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Kidsac - Building Young Hearts",
  description: "Kindergarten and Pre-school programs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AppShell>{children} </AppShell>
      </body>
    </html>
  );
}
