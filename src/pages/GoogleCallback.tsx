import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userDataStr = searchParams.get("userData");

    if (token && userDataStr) {
      try {
        const userData = JSON.parse(decodeURIComponent(userDataStr));

        // Store token and user data in localStorage
        localStorage.setItem("user_token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        // Redirect to dashboard
        navigate("/");
      } catch (error) {
        console.error("Error processing Google login:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h2>Processing Google login...</h2>
    </div>
  );
};

export default GoogleCallback;
