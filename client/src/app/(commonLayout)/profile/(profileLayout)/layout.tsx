/* eslint-disable prettier/prettier */
import "@/src/styles/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/src/config/site";
import FollowRequest from "@/src/components/user/FollowRequest";
import Sidebar from "@/src/components/user/Sidber";
import MobileMenu from "@/src/components/user/MobileMenu";

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
    <>
      <div className="flex lg:container gap-4 mx-auto ">
        <div className="hidden xl:block w-[19%]">
          <div className="fixed">
            <Sidebar />
          </div>
        </div>
        <div className="w-full xl:w-[62%] border border-gray-600 min-h-screen">
          {children}
        </div>
        <div className="hidden xl:block w-[23%] h-fit pt-4 rounded-lg">
          <div className="fixed">
            <FollowRequest />
          </div>
        </div>
      </div>
      <MobileMenu />
    </>
  );
}
