import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import SignupPage from './pages/auth/SignupPage'
import LoginPage from './pages/auth/LoginPage'
import Sidebar from './components/Sidebar'
import RightPanel from './components/RightPannel'
import NotificationPage from './pages/NotificationPage'
import ProfilePage from './pages/ProfilePage'
import { useQuery } from '@tanstack/react-query'




const App = () => {

	const { data: authUser, isLoading } = useQuery({
		// we use queryKey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/auth/check");
				const data = await res.json();
				if (data.error) return null;
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				console.log("authUser is here:", data);
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		retry: false,
	});
   
  return (
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/notifications" element={<NotificationPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/profile/:username" element={<ProfilePage/>} />
      </Routes>
      <RightPanel/>
      <Toaster/>
    </div>
  )
}

export default App
