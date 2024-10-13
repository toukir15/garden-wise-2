/* eslint-disable prettier/prettier */
import "@/src/styles/globals.css";
import { Metadata, Viewport } from "next";

import { siteConfig } from "@/src/config/site";

import Image from "next/image";

import profile from "../../../../public/toukir.jpg";
import premium from "../../../../public/premium.png";

const suggetionData = [
  {
    id: 1,
    img: profile,
    name: "Soeab Ahmed",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 2,
    img: profile,
    name: "Hafizur Rahman",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 3,
    img: profile,
    name: "Soeab Ahmed",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 4,
    img: profile,
    name: "Hafizur Rahman",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 5,
    img: profile,
    name: "Soeab Ahmed",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 6,
    img: profile,
    name: "Hafizur Rahman",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 7,
    img: profile,
    name: "Soeab Ahmed",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 8,
    img: profile,
    name: "Hafizur Rahman",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 9,
    img: profile,
    name: "Soeab Ahmed",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 10,
    img: profile,
    name: "Hafizur Rahman",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 8,
    img: profile,
    name: "Hafizur Rahman",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 9,
    img: profile,
    name: "Soeab Ahmed",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 10,
    img: profile,
    name: "Hafizur Rahman",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 8,
    img: profile,
    name: "Hafizur Rahman",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 9,
    img: profile,
    name: "Soeab Ahmed",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 10,
    img: profile,
    name: "Hafizur Rahman",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 8,
    img: profile,
    name: "Hafizur Rahman",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 9,
    img: profile,
    name: "Soeab Ahmed",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 10,
    img: profile,
    name: "Hafizur Rahman",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 8,
    img: profile,
    name: "Hafizur Rahman",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 9,
    img: profile,
    name: "Soeab Ahmed",
    email: "demo@gmail.com",
    requested: false,
  },
  {
    id: 10,
    img: profile,
    name: "Hafizur Rahman",
    email: "demo@gmail.com",
    requested: false,
  },
];

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 w-full">
      <div className="w-[17%] h-fit ">
        <div className="border-[0.5px] border-gray-600 p-3 rounded-lg">
          <Image
            alt="Description of image"
            className="rounded-full"
            src={profile}
            height={80}
            width={80}
          />
          <p className="mt-2">Toukir Ahmed</p>
          <p className="mt-1 text-sm">toukir486@gmail.com</p>
        </div>
        <div className="border-[0.5px] mt-4 border-gray-600 p-3 rounded-lg">
          <p className="text-sm text-green-500 font-medium">
            Unlock premium posts
          </p>
          <div className="flex gap-2 items-center">
            <Image src={premium} height={16} width={16} alt="premium" />
            <p className="text-sm mt-1 text-gray-300">Try for BDT 500</p>
          </div>
        </div>
      </div>
      <div className="w-[60%] border-[0.5px] border-gray-600  rounded-lg">
        {children}
      </div>
      <div className="w-[23%] h-fit border-[0.5px] border-gray-600 pt-4 rounded-lg">
        <div>
          <p className="px-2 border-b border-gray-700 pb-3">
            Suggested for you
          </p>
          <div className=" h-[calc(100vh-359px)] overflow-y-scroll follow_box ">
            {suggetionData.map((data, key) => {
              return (
                <div
                  key={key}
                  className=" py-3 border-b hover:bg-[#080808] transition duration-150 border-gray-900  "
                >
                  <div className="flex gap-2 px-2 items-center ">
                    <div>
                      <Image
                        className="rounded-full"
                        height={40}
                        width={40}
                        src={data.img}
                        alt="profile image"
                      />
                    </div>
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <p className="text-sm text-gray-200 font-medium">
                          {data?.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Suggested for you
                        </p>
                      </div>
                      {!data.requested && (
                        <button className=" bg-green-600 hover:bg-green-500 transition  duration-150 text-white text-xs py-[3px] px-3 rounded-full">
                          Follow
                        </button>
                      )}
                      {data.requested && (
                        <button className="hover:bg-black bg-gray-800 transition  duration-150 text-white text-sm py-[2px] px-3 rounded-full">
                          Requested
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
