import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "./login.css"

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:3001/login', { email, password })
      .then(result => {
        console.log(result)
        if (result.data === "login success") {
          toast.success('Login successful! Redirecting...')
          navigate('/houseowner')
        } else if (result.data === "success") {
          toast.success('Login successful! Redirecting...')
          navigate('/CustomerLogin')
        } else {
          toast.error('Login failed. Please try again.')
        }
      })
      .catch(err => {
        console.log(err)
        toast.error('An error occurred. Please try again.')
      })
  }

  return (
    <div className='login-page-container'>
      <ToastContainer />
      <form onSubmit={handleSubmit} className='login-form-container'>
        <h1>Log in</h1>
        <label htmlFor="email" className='login-emails'>E-mail:</label>
        <input type="email" className='login-email' placeholder="Enter Your E-Mail" onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="pass" className='login-emails'>Password:</label>
        <input type="password" placeholder='Enter Your Password' className='login-email' onChange={(e) => setPassword(e.target.value)} />
        <input type="submit" value="Log in" className='login-email' id='login' />
      </form>
    </div>
  )
}

export default Login
