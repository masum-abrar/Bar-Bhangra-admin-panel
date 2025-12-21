"use client";
import Link from "next/link";
import {
  FiHome,
  FiImage,
  FiLayers,
  FiMail,
  FiLogOut,
  FiCalendar,
} from "react-icons/fi";
import { useRouter, usePathname } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // Current path

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: <FiHome /> },
    { name: "Events", href: "/event", icon: <FiCalendar /> },
    { name: "Story", href: "/story", icon: <FiLayers /> },
    { name: "Menu", href: "/menu", icon: <FiLayers /> },
    { name: "Gallery", href: "/bargallery", icon: <FiImage /> },
    { name: "Contacts", href: "/contact", icon: <FiMail /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside className=" bg-gradient-to-r from-yellow-500 to-orange-500 shadow-xl w-64  flex flex-col text-white">
      <div className="p-6 font-extrabold text-2xl tracking-wide drop-shadow-lg">
        BAR BHANGRA <br /> Admin Panel
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-3">
        {links.map((link) => {
          const isActive = pathname === link.href; // Check if active
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 shadow-sm
                ${
                  isActive
                    ? "bg-white text-orange-500 font-bold"
                    : "hover:bg-white hover:text-orange-500"
                }
              `}
            >
              <span className="text-lg">{link.icon}</span>
              <span className="text-lg">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-orange-400">
        <button
          onClick={handleLogout}
          className="flex items-center w-full space-x-3 px-4 py-3 rounded-lg bg-white text-orange-500 font-semibold hover:bg-orange-100 hover:scale-105 transition transform shadow"
        >
          <FiLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
