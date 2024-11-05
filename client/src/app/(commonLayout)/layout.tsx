/* eslint-disable prettier/prettier */
import "@/src/styles/globals.css";
import { Metadata, Viewport } from "next";
import FollowRequest from "@/src/components/user/FollowRequest"; // Ensure this path is correct
import { siteConfig } from "@/src/config/site";
import Sidebar from "@/src/components/user/Sidber";

export const metadata: Metadata = {
  title: {
    default: siteConfig?.name,
    template: `%s - ${siteConfig?.name}`,
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex container gap-4 mx-auto h-screen">
      <div className="w-[19%]">
        <Sidebar />
      </div>
      <div className="w-[62%]">{children}</div>
      <div className="w-[23%] h-fit pt-4 rounded-lg">
        <FollowRequest />
      </div>
    </div>
  );
}
