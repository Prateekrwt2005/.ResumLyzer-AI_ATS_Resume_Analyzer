import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeUploadCard from "../components/upload/ResumeUploadCard";

export default function Landing() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/me`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {}
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center relative">

     
      
      <ResumeUploadCard />
    </div>
  );
}