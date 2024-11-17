"use client";
import "@/src/styles/globals.css";
import { Layout, Menu, Breadcrumb, theme } from "antd";
import { useState } from "react";
import { FaChartPie, FaRegUser } from "react-icons/fa";
import Link from "next/link";
import { GoHomeFill } from "react-icons/go";
import { MdPayment } from "react-icons/md";
import { GrAppsRounded } from "react-icons/gr";
import logo from "../../../public/plant.png";
import Image from "next/image";

const { Header, Content, Sider } = Layout;
const items = [
  {
    label: "Dashboard",
    key: "1",
    icon: <FaChartPie size={20} />,
    link: "/admin/dashboard",
  },
  {
    label: "Posts",
    key: "5",
    icon: <GrAppsRounded size={20} />,
    link: "/admin/posts",
  },
  {
    label: "Users",
    key: "3",
    icon: <FaRegUser size={20} />,
    link: "/admin/users",
  },
  {
    label: "Payments",
    key: "4",
    icon: <MdPayment size={20} />,
    link: "/admin/payments",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar for larger screens */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          backgroundColor: "#000",
        }}
      >
        {/* Logo Section */}
        <Link href={"/"} className="flex items-center gap-1 px-2 py-4">
          {/* <Image src={logo} width={30} height={30} alt="logo" /> */}
          {/* Conditionally render text based on the collapsed state */}
          {!collapsed && (
            <span className="text-xl font-medium relative top-1 text-white">
              Garden-Wise
            </span>
          )}
        </Link>

        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          {items.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link className="font-medium" href={item.link}>
                {item.label}
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        {/* Header */}
        <Header style={{ padding: 0, background: colorBgContainer }} />
        
        {/* Main content area */}
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>

          {/* Main content */}
          <div className="xl:p-6 min-h-[360px] bg-white rounded-lg">
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
