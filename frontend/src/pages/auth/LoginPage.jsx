import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Lock } from "lucide-react";
import LOGO from "../../assets/logo.png";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isError = false;

  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10">
      {/* Left side with logo - hidden on small screens */}
      <div className="flex-1 hidden lg:flex items-center justify-center">
        <img src={LOGO} alt="Logo" className="lg:w-90" />
      </div>
      
      {/* Right side with form */}
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col" onSubmit={handleSubmit}>
          {/* Logo visible only on small screens */}
          <img src={LOGO} alt="Logo" className="w-24 lg:hidden" />
          
          <h1 className="text-4xl font-extrabold mb-4 text-center">Let's go.</h1>
          
          {/* Username field */}
          <label className="input input-bordered rounded flex items-center gap-2">
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
          
          {/* Login button */}
          <button className="btn rounded-full btn-primary text-white">Login</button>
          
          {/* Error message */}
          {isError && <p className="text-red-500">Something went wrong</p>}
        </form>
        
        {/* Sign up link */}
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className=" text-lg">Don't have an account?</p>
          <Link to="/signup">
            <button className="btn rounded-full btn-primary btn-outline w-full">
              Sign up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;