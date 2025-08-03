import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Moon, Sun, LogOut, Settings, User, Menu } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";

export default function Topbar() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [adminUser, setAdminUser] = useState({
    firstName: "A",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("admin_user") || "{}");
    if (storedUser?.firstName) {
      setAdminUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    toast({
      title: "Admin Logged Out",
      description:
        "You have been successfully logged out from the admin panel.",
      variant: "default",
    });
    navigate("/admin/login");
  };

  return (
    <header className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className="h-10 w-10 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center rounded-xl shadow-lg group-hover:scale-105 transition-all">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl blur opacity-20 group-hover:opacity-40 -z-10"></div>
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Admin Console
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Management Portal
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">
            <button className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <Menu className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4 text-gray-600" />
              ) : (
                <Sun className="h-4 w-4 text-yellow-500" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-purple-500/20 transition-all flex items-center justify-center"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <span className="text-sm font-semibold text-white">
                    {adminUser?.firstName?.[0]?.toUpperCase() || "A"}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-black
 rounded-lg shadow-xl border border-gray-200/50 dark:border-gray-800/50 p-2 z-50"
                >
                  <div className="px-3 py-2 mb-2">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {adminUser?.firstName || "Admin"}{" "}
                      {adminUser?.lastName || ""}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {adminUser?.email || "admin@example.com"}
                    </div>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>

                  <button className="w-full flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                    <User className="mr-3 h-4 w-4" />
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md">
                    <Settings className="mr-3 h-4 w-4" />
                    <span>Account Settings</span>
                  </button>
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {dropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </header>
  );
}
