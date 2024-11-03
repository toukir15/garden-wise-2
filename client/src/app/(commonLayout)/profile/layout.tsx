/* eslint-disable prettier/prettier */
import "@/src/styles/globals.css";
import { Metadata, Viewport } from "next";
import { siteConfig } from "@/src/config/site";
import FollowRequest from "@/src/components/user/FollowRequest";
import Sidber from "@/src/components/user/Sidber";

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
    <div className="flex gap-4 justify-center w-full">
      <div className="w-[60%] border-[0.5px] border-gray-600 ">{children}</div>
    </div>
  );
}
