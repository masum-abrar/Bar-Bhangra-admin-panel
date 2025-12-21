import Sidebar from "@/app/components/Sidebar";
import MenuAdmin from "@/app/menuComponents/MenuAdmin";
import React from "react";

const page = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <MenuAdmin />
    </div>
  );
};

export default page;
