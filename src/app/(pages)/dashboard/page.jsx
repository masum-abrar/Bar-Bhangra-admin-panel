"use client";
import Sidebar from "@/app/components/Sidebar";
import { FiImage, FiLayers, FiMail, FileList } from "react-icons/fi";
import { MdEvent } from "react-icons/md";
const sections = [
  {
    title: "Event",
    link: "/event",
    icon: MdEvent,
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    title: "Gallery",
    link: "/bargallery",
    icon: FiImage,
    gradient: "from-pink-500 to-red-500",
  },
  {
    title: "Menu",
    link: "/menu",
    icon: FiLayers,
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    title: "Contacts",
    link: "/contact",
    icon: FiMail,
    gradient: "from-green-400 to-teal-500",
  },
];

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
          Dashboard
        </h1>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <a
                key={section.title}
                href={section.link}
                className={`
                  group flex flex-col items-center justify-center p-6 rounded-2xl shadow-2xl
                  bg-white hover:scale-105 transform transition duration-500
                  relative overflow-hidden
                `}
              >
                {/* Gradient circle for icon */}
                <div
                  className={`w-16 h-16 mb-4 rounded-full bg-gradient-to-r ${section.gradient} flex items-center justify-center text-white text-2xl shadow-lg transition group-hover:scale-110`}
                >
                  <Icon />
                </div>

                {/* Section title */}
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition">
                  {section.title}
                </h2>

                {/* Optional overlay gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-br opacity-10 pointer-events-none rounded-2xl"></div>
              </a>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
