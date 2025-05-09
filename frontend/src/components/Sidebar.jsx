import { Link } from "react-router-dom";
import { Home, Bell, User, LogOut } from "lucide-react";
import LOGO from "../assets/sidebarlogo.png";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { use } from "react";



const Sidebar = () => {


  const queryClient = useQueryClient();

  const {mutate: logout, isError, error}= useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }
      return data;
    },
    onSuccess: () => {
      // clear user so App.jsx redirect logic kicks in immediately
      queryClient.setQueryData(["authUser"], null);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged out successfully");
    },
  })
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });


  // Navigation items
  const navItems = [
    { path: "/", icon: <Home size={24} />, label: "Home" },
    { path: "/notifications", icon: <Bell size={22} />, label: "Notifications" },
    { path: `/profile/${authUser?.username}`, icon: <User size={22} />, label: "Profile" },
  ];

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full bg-white">
        {/* Logo */}
        <Link to="/" className="flex justify-center md:justify-start">
          <img 
            src={LOGO} 
            alt="Logo" 
            className=" p-3 md:w-40 md:h-15 rounded-full" 
          />
        </Link>

        {/* Navigation Menu */}
        <ul className="flex flex-col gap-3 mt-4">
          {navItems.map((item) => (
            <li key={item.path} className="flex justify-center md:justify-start">
              <Link
                to={item.path}
                className="flex gap-3 items-center hover:bg-primary/20 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
              >
                {item.icon}
                <span className="text-lg hidden md:block">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* User Profile */}
        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-primary/20 py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} alt="Profile" />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="font-bold text-sm w-20 truncate">{authUser?.fullName}</p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <LogOut  size={20} className="cursor-pointer" onClick={(e) =>{
                e.preventDefault();
                logout();
                if (isError) {
                  toast.error(error.message);
                }
              }} />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;