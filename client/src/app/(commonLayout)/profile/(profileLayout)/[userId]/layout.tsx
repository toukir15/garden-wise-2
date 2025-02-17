import "@/src/styles/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/src/config/site";
import FollowRequest from "@/src/components/shared/RightSidebar";
import Sidebar from "@/src/components/shared/Sidber";
import RightSidebar from "@/src/components/shared/RightSidebar";
import MobileMenu from "@/src/components/MobileMenu";


export const metadata: Metadata = {
  title: {
    default: "GardenWise",
    template: `%s - `,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:container mx-auto h-screen">
      {/* Sidebar - visible on extra large screens */}
      <div className="w-full xl:w-[19%] hidden xl:block">
        <div className="fixed">
          <Sidebar />
        </div>
      </div>

      {/* Main content area */}
      <div className="w-full xl:w-[62%] ">{children}</div>

      {/* FollowRequest - visible on extra large screens */}
      <div className="w-full xl:w-[23%] h-fit pt-4 rounded-lg hidden xl:block">
        <div className="fixed">
          <RightSidebar />
        </div>
      </div>
      <MobileMenu />
    </div>
  );
}
