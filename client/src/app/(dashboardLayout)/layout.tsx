"use client";
import "@/src/styles/globals.css";
import { Layout, Menu, Breadcrumb, theme } from "antd";
import { useState } from "react";
import { FaChartPie, FaRegUser } from "react-icons/fa";
import Link from 'next/link'; // Import Next.js Link for navigation
import { GoHomeFill } from "react-icons/go";
import { MdPayment } from "react-icons/md";
import { GrAppsRounded } from "react-icons/gr";

const { Header, Content, Sider } = Layout;


// Menu items for the sidebar, update to use Next.js routes
const items = [
  { label: 'Home', key: '2', icon: <GoHomeFill size={20} />, link: '/' }, 
  { label: 'Dashboard', key: '1', icon: <FaChartPie  size={20} />, link: '/admin/dashboard' }, // Dashboard page
  { label: 'Posts', key: '5', icon: <GrAppsRounded size={20} />, link: '/admin/posts' }, // Posts page
  { label: 'Users', key: '3', icon: <FaRegUser size={20} />, link: '/admin/users' }, // Users page
  { label: 'Payments', key: '4', icon: <MdPayment size={20} />, link: '/admin/payments' }, // Payments page
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
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
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']} 
          mode="inline"
        >
          {items.map(item => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link className="font-medium" href={item.link}>{item.label}</Link> {/* Wrap with Link for navigation */}
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}> {/* Adjust the margin for collapsed state */}
        {/* Header */}
        <Header style={{ padding: 0, background: colorBgContainer }} />
        
        {/* Main content area */}
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
          </Breadcrumb>

          {/* Main content */}
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children} {/* Render the child page content */}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
