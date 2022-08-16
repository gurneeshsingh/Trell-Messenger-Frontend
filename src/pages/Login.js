/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { TextField, InputAdornment } from "@mui/material"
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, reset, removeError } from '../redux/features/userSlice';
import Alert from '@mui/material/Alert';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false
  });

  const { isLoading, isError, message } = useSelector((state) => state.user);

 

  useEffect(() => {
    setTimeout(() => {
      dispatch(reset())
    }, 5000);
  }, [dispatch])

  


  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  function handleShowPassword() {
    setFormData({ ...formData, showPassword: !formData.showPassword })
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      window.alert('Enter Credentials Properly')
      // TODO: framer motion toast notification
    }
    const userData = {
      email: formData.email,
      password: formData.password
    }
    await dispatch(loginUser(userData))
    setFormData({ email: "", password: "", showPassword: false })
    window.location.replace('/chats')

  }




  return (
    <div className="h-screen md:w-screen w-[80%] mx-auto flex flex-col md:flex-row items-center justify-center">

      <div className='w-[50%] flex justify-center items-center'>
        <img src="/assets/loginimage.svg" alt="left hero banner" className='md:h-96 h-56  md:mt-0 ' />
      </div>

      {/* trell logo in the center of page   */}
      <div className='hidden md:flex md:absolute md:top-[50%] md:left-[50%] md:-translate-x-[50%] md:-translate-y-[50%] w-auto z-40  ' >
        <img src="/assets/trell.jpeg" alt="logo" className='md:h-14 md:w-24 h-0 w-0 ' />
      </div>

      {/* register form  */}
      <div className='w-[50%] flex justify-center items-center flex-col'>
        <h2 className='font-dancingScript font-bold text-gray-600 tracking-wide text-2xl md:text-4xl mb-2 mt-6 md:mt-0 w-80'>Welcome back..!</h2>
        <p className='text-xs md:text-sm w-80 tracking-wide text-gray-400 font-nunito mb-3'>Enter your credentials to continue</p>
        {isError && <Alert onClose={() => { dispatch(removeError()) }} variant="filled" color='error' className='transition-all my-2 w-80' severity="error" >{message}</Alert>}

        <form className='my-4 flex flex-col items-center justify-start ' onSubmit={handleSubmit} >
          <TextField label="Email" type="text" size='small' name='email' color='secondary' autoComplete='off' required className='!my-2 w-80' InputProps={{ startAdornment: <InputAdornment position='start' > <AlternateEmailIcon fontSize='1rem' /></InputAdornment> }} value={formData.email} onChange={handleChange} />

          <TextField label="Password" name='password' size='small' color='secondary' autoComplete='off' required type={formData.showPassword ? 'text' : 'password'} className='!my-2 w-80' InputProps={{
            endAdornment: <InputAdornment position='end'><IconButton aria-label='toggle password visibility' edge='end' onClick={handleShowPassword}>
            </IconButton>{formData.showPassword ? <VisibilityIcon fontSize='small' /> : <VisibilityOffIcon fontSize='small' />} </InputAdornment>
          }} value={formData.password} onChange={handleChange} />

          <Button type='submit' className={`!w-80 !p-2 !text-sm !md:text-base !font-nunito !mt-10 !mb-4 !tracking-wide !opacity-[.70] !md:opacity-[.80] !rounded-lg !text-white !transition-all !capitalize ${isLoading ? "!bg-gradient-to-tr from-gray-300 via-gray-300 to-gray-300 !opacity-40 " : ""} bg-gradient-to-tr from-rose-400 via-fuchsia-500 to-indigo-500`} >{!isLoading ? "Login" : <CircularProgress color='secondary' size={25} style={{ paddingTop: "1px" }} />}</Button>
        </form>

        <p className='text-xs md:text-sm text-gray-500 font-nunito font-light tracking-wide -mt-2 mb-3'>New user? <span className='text-purple-700 font-medium cursor-pointer' onClick={() => navigate('/register')}>Register</span></p>
        <div className='absolute flex md:hidden top-5 left-4'>
          <IconButton aria-label='back' color='secondary' onClick={() => navigate('/')} >
            <ArrowBackIosIcon fontSize='small' />
          </IconButton>
        </div>

      </div>
    </div>
  )
};

export default Login