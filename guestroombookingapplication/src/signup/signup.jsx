import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './signup.css'

const Signup = () => {
  const [name, setName ] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [password, setPassword] = useState('')
  const [userType, setUserType] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:3001/register', { name, mobileNumber, email, password, userType })
      .then(result => {
        console.log(result)
        toast.success('Signup successful! Redirecting to login...')
        navigate('/login')
      })
      .catch(err => {
        console.log(err)
        toast.error('An error occurred. Please try again.')
      })
  }

  return (
    <div className='signup-container'>
      <ToastContainer />
      <form onSubmit={handleSubmit} className='form_containers'>
        <h1>Sign-Up</h1>
        <label>Name:</label>
        <input type="text" placeholder="Enter your Name" required onChange={(e) => setName(e.target.value)} />
        <label>Mobile Number:</label>
        <input type="number" placeholder="Enter your Mobile Number" required onChange={(e) => setMobileNumber(e.target.value)} />
        <label>E-mail:</label>
        <input type="email" placeholder="Enter your email" required onChange={(e) => setEmail(e.target.value)} />
        <label>Password:</label>
        <input type="password" placeholder='Enter Your Password' required onChange={(e) => setPassword(e.target.value)} />
        <select name="choice" className='select' required onChange={(e) => setUserType(e.target.value)}>
          <option value="">Choose Your Role</option>
          <option value="House Owner">House Owner</option>
          <option value="Customer">Customer</option>
        </select>
        <input type="submit" value="Sign-up" className="sign" />
        <span className='already'>
          Already have an account? <a href="/login">Login</a>
        </span>
      </form>
    </div>
  )
}

export default Signup
