import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, User, Lock, FileText } from "lucide-react";
import LOGO from "../../assets/logo.png";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const {mutate, isError, isPending, error} = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }
      console.log(data);
      return data;
    },
    onSuccess: () => {
			toast.success("Account created successfully");
		},
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData)
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      {/* Left side with logo - hidden on small screens */}
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img src={LOGO} alt="Logo" className="lg:w-80" />
      </div>
      
      {/* Right side with form */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <form 
          className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col" 
          onSubmit={handleSubmit}
        >
          {/* Logo visible only on small screens */}
          <img src={LOGO} alt="Logo" className="w-24 lg:hidden" />
          
          <h1 className="text-4xl font-extrabold mb-4 text-center">Join today.</h1>
          
          {/* Email field */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <Mail size={20} />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
              onChange={handleInputChange}
              value={formData.email}
            />
          </label>
          
          {/* Username and Full Name fields */}
          <div className="flex gap-4 flex-wrap">
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <User size={20} />
              <input
                type="text"
                className="grow"
                placeholder="Username"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
              />
            </label>
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FileText size={20} />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
                onChange={handleInputChange}
                value={formData.fullName}
              />
            </label>
          </div>
          
          {/* Password field */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <Lock size={20} />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
              onChange={handleInputChange}
              value={formData.password}
            />
          </label>
          
          {/* Submit button */}
          <button className="btn rounded-full btn-primary text-white">{isPending ? "Loading..." : "Sign up"}</button>
          
          {/* Error message */}
          {isError && <p className="text-red-500">{error.message}</p>}
        </form>
        
        {/* Sign in link */}
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary btn-outline w-full">
              Login in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;