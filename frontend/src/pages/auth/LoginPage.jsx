import React from 'react'

const LoginPage = () => {
  return (
    <div>
      <h1 className='text-3xl font-bold'>Login Page</h1>
      <p className='text-lg'>Welcome to the login page!</p>
      <form className='flex flex-col gap-4'>
        <input type="email" placeholder='Email' className='border border-gray-300 p-2 rounded' />
        <input type="password" placeholder='Password' className='border border-gray-300 p-2 rounded' />
        <button type="submit" className='bg-blue-500 text-white p-2 rounded'>Login</button>
      </form>
      
    </div>
  )
}

export default LoginPage
