import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Image,
  Users
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === `/admin${path}`;

  const navItems = [
    { 
      path: "", 
      label: "Dashboard",
      icon: LayoutDashboard
    },
    { 
      path: "/products", 
      label: "Products",
      icon: Package
    },
    { 
      path: "/categories", 
      label: "Categories",
      icon: FolderTree
    },
    { 
      path: "/banners", 
      label: "Banners",
      icon: Image
    },
    { 
      path: "/users", 
      label: "Users",
      icon: Users
    },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        {/* Sidebar Component */}
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-black border-r border-gray-200 dark:border-gray-800">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-purple-600 dark:bg-purple-500">
              ADMIN
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">Dashboard</span>
          </div>
          
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navItems.map((item) => {
                const isActiveRoute = isActive(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={`/admin${item.path}`}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActiveRoute
                        ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/50 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <div className={`mr-3 flex-shrink-0 ${
                      isActiveRoute 
                        ? "text-purple-600 dark:text-purple-400" 
                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;