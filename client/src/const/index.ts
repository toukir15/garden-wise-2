import { FaChartPie } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { GoHomeFill } from "react-icons/go";
import { IoIosBookmark } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { MdDiamond, MdMessage } from "react-icons/md";
import { RiUserFill } from "react-icons/ri";
import { ImSearch } from "react-icons/im";

export const items = [
  {
    key: "copy",
    label: "Copy",
  },
  {
    key: "edit",
    label: "Edit",
  },
  {
    key: "delete",
    label: "Delete",
  },
];

// Sidebar navigation links
export const sidebarLinks = [
  { href: "/", icon: GoHomeFill, label: "Home", size: 20 },
  { href: "/admin/dashboard", icon: FaChartPie, label: "Dashboard", size: 10 },
  { icon: ImSearch, label: "Explore", size: 10 },
  { icon: IoNotifications, label: "Notification", size: 20 },
  { icon: MdMessage, label: "Message", size: 20 },
  { href: "/bookmark", icon: IoIosBookmark, label: "Bookmark", size: 20 },
  { icon: FaUsers, label: "Communities", size: 20 },
  { href: "/", icon: MdDiamond, label: "Premium", size: 20 },
  { href: "/profile", icon: RiUserFill, label: "Profile", size: 20 },
];
