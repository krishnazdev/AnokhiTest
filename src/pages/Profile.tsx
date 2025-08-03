import Header from "@/components/Header";
import { useAuth } from "@/components/AuthContext";
import { format, isValid } from "date-fns";
import { User, Mail, Shield, Calendar } from "lucide-react";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt?: string;
}

const Profile = () => {
  const { user }: { user: User | null } = useAuth();

  // Safe date formatting function
  const formatDate = (dateString: string | undefined, formatString: string): string => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (!isValid(date)) return 'N/A';
      return format(date, formatString);
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  // Safe function to get user initials
  const getUserInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName?.trim() || '';
    const last = lastName?.trim() || '';
    
    if (first && last) {
      return `${first.charAt(0).toUpperCase()}${last.charAt(0).toUpperCase()}`;
    } else if (first) {
      return first.charAt(0).toUpperCase();
    } else if (last) {
      return last.charAt(0).toUpperCase();
    } else {
      return 'U'; // Default to 'U' for User
    }
  };

  // Safe function to get display name
  const getDisplayName = (firstName?: string, lastName?: string): string => {
    const first = firstName?.trim() || '';
    const last = lastName?.trim() || '';
    
    if (first && last) {
      return `${first} ${last}`;
    } else if (first) {
      return first;
    } else if (last) {
      return last;
    } else {
      return 'User'; // Default fallback
    }
  };

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white">
          <div className="text-center max-w-md p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Please Login
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              You need to be logged in to view your profile information.
            </p>
            <button 
              onClick={() => window.location.href = '/login'}
              className="group relative inline-flex items-center gap-2 rounded-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Go to Login
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      {/* ✅ Updated: Added more top margin for laptop view */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-white py-16 px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-32">
        {/* Enhanced Background Decorations */}
        <div className="fixed top-20 left-10 w-32 h-32 rounded-full bg-purple-200/20 blur-3xl animate-pulse" />
        <div className="fixed bottom-40 right-10 w-48 h-48 rounded-full bg-pink-200/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="fixed top-1/2 right-1/4 w-24 h-24 rounded-full bg-purple-300/15 blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-6 py-2 rounded-full text-sm font-semibold mb-6">
              <User className="w-4 h-4" />
              Personal Information
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-4">
              My Profile
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your account information and details
            </p>
          </div>

          {/* Profile Avatar Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50 p-8 md:p-10 mb-8">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl md:text-4xl font-bold text-white">
                    {getUserInitials(user.firstName, user.lastName)}
                  </span>
                </div>
              </div>
              <div className="text-center mt-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {getDisplayName(user.firstName, user.lastName)}
                </h2>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-2 rounded-full border border-purple-200/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-gray-600">Active Account</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Grid */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100/50 p-8 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Details */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
                </div>

                <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-6 rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <User className="w-5 h-5 text-purple-600" />
                    <label className="text-sm font-semibold text-purple-800 uppercase tracking-wide">Full Name</label>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {getDisplayName(user.firstName, user.lastName)}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-6 rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Mail className="w-5 h-5 text-purple-600" />
                    <label className="text-sm font-semibold text-purple-800 uppercase tracking-wide">Email Address</label>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{user.email || 'Not provided'}</p>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Account Information</h3>
                </div>

                <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-6 rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <label className="text-sm font-semibold text-purple-800 uppercase tracking-wide">Account Type</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 text-white capitalize">
                      {user.role || 'user'}
                    </span>
                    {user.role === 'admin' && (
                      <span className="text-xs text-purple-600 font-medium bg-purple-100 px-2 py-1 rounded-full">
                        Admin Privileges
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 p-6 rounded-2xl border border-purple-100/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    <label className="text-sm font-semibold text-purple-800 uppercase tracking-wide">Member Since</label>
                  </div>
                  <p className="text-xl font-bold text-gray-900">
                    {formatDate(user.createdAt, 'MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(user.createdAt, "'Joined' EEEE 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
