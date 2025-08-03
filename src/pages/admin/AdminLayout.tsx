import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import useAdminAuth from "../../hooks/use-admin-auth";
import { ThemeProvider } from "@/components/theme-provider";

const AdminLayout = () => {
  useAdminAuth(); 

  return (
    <ThemeProvider defaultTheme="light" storageKey="admin-ui-theme">
      <div className="flex h-screen bg-gray-50 dark:bg-black">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Topbar />
          
          {/* Main Content Area with Scroll */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-black">
            <div className="container mx-auto px-6 py-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default AdminLayout;