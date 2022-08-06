/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { TextField, InputAdornment } from "@mui/material"
import BadgeIcon from '@mui/icons-material/Badge';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { registerUser, reset } from '../redux/features/userSlice';



const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    showPassword: false
  });

  const [errorMessage, setErrorMessage] = useState('')
  const [errorState, setErrorState] = useState(false)

  // destruction state from useselector hook
  const {  isLoading, isError,  message } = useSelector((state) => state.user);

  const token = JSON.parse(localStorage.getItem('token'));

  // use useEffect to watch for changes in the state variables
  useEffect(() => {
    // check if error has occured
    if (isError) {
      window.alert(message)
      //TODO: framer motion toast notification
    }
    if (token) {
      navigate('/chooseavatar')
    }

    dispatch(reset())
  }, [token, isError, message])



  function handleChange(e) {
    if (formData.password.length >= 5) {
      setErrorState(false);
      setErrorMessage(false)
    }
    setFormData({ ...formData, [e.target.name]: e.target.value })
  };

  function handleBlur() {
    if (formData.password.length < 5) {
      setErrorState(true)
      setErrorMessage('Password must be minimum 5 characters')
    } else {
      setErrorState(false)
      setErrorMessage('')
    }
  };

  function handleShowPassword() {
    setFormData({ ...formData, showPassword: !formData.showPassword })
  };

  function handleSubmit(e) {

    e.preventDefault();
    if (formData.password.length < 5) {
      window.alert('Enter details properly')
      //TODO: framer motion animate error field
    }
    if (!formData.name || !formData.email || !formData.password) {
      window.alert('Enter details properly')
    }
    // dispatch register user action with details entered by user
    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password
    }

    dispatch(registerUser(userData))
    setFormData({name:"", email:"", password:"", showPassword:false})
   
  }



  return (
    <div className='h-screen md:w-screen w-[80%] mx-auto flex flex-col md:flex-row items-center justify-center '>
      {/* image div  */}
      <div className='w-[50%] flex justify-center items-center'>
        <img src="/assets/hellocat.svg" alt="left hero banner" className='md:h-96 h-56 mt-2 md:mt-0 ' />
      </div>

      {/* trell logo in the center of the page  */}
      <div className='hidden md:flex md:absolute md:top-[50%] md:left-[50%] md:-translate-x-[50%] md:-translate-y-[50%] w-auto z-40  ' >
        <img src="/assets/trell.jpeg" alt="logo" className='md:h-14 md:w-24 h-0 w-0 ' />
      </div>

      {/* register form  */}
      <div className='w-[50%] flex justify-center items-center flex-col'>
        <h2 className='font-dancingScript font-bold text-gray-600 tracking-wide text-2xl md:text-4xl mb-2 mt-6 md:mt-0 w-80'>Hello..!</h2>
        <form className='my-2 flex flex-col items-center justify-start' onSubmit={handleSubmit} >
          <TextField label="Name" type="text" size='small' name='name' color='secondary' autoComplete='off' required InputProps={{ startAdornment: <InputAdornment position='start' > <BadgeIcon fontSize='1rem' /></InputAdornment> }} className='!my-2  w-80' value={formData.name} onChange={handleChange} />

          <TextField label="Email" type="text" size='small' name='email' color='secondary' autoComplete='off' required className='!my-2 w-80' InputProps={{ startAdornment: <InputAdornment position='start' > <AlternateEmailIcon fontSize='1rem' /></InputAdornment> }} value={formData.email} onChange={handleChange} />

          <TextField label="Password" name='password' size='small' color='secondary' autoComplete='off' required type={formData.showPassword ? 'text' : 'password'} className='!my-2 w-80' InputProps={{
            endAdornment: <InputAdornment position='end'><IconButton aria-label='toggle password visibility' edge='end' onClick={handleShowPassword}>
            </IconButton>{formData.showPassword ? <VisibilityIcon fontSize='small' /> : <VisibilityOffIcon fontSize='small' />}</InputAdornment>
          }} value={formData.password} onChange={handleChange} helperText={errorMessage} error={errorState} onBlur={handleBlur} validate='true' />

          <p className='text-xs md:text-sm text-gray-500 font-nunito font-light mt-4'>By signing up, you agree to our <span className='text-purple-700 font-medium'>Terms & Conditions</span> and <span className='text-purple-700 font-medium'>Private Policy</span></p>

          <Button type='submit' className={`!w-80 !p-2 !text-sm !md:text-base !font-nunito !mt-10 !mb-4 !tracking-wide !opacity-[.70] !md:opacity-[.80] !rounded-lg !text-white !transition-all !capitalize ${isLoading ? "!bg-gradient-to-tr from-gray-300 via-gray-300 to-gray-300 !opacity-40 " : ""} bg-gradient-to-tr from-rose-400 via-fuchsia-500 to-indigo-500`} >{!isLoading ? "Agree and register" : <CircularProgress color='secondary' size={25} style={{ paddingTop: "1px" }} />}</Button>

        </form>
        <p className='text-xs md:text-sm text-gray-500 font-nunito font-light tracking-wide -mt-2 mb-3'>Joined us before? <span className='text-purple-700 font-medium cursor-pointer' onClick={() => navigate('/login')}>Login</span></p>
        <div className='absolute flex md:hidden top-5 left-4'>
          <IconButton aria-label='back' color='secondary' onClick={() => navigate('/')} >
            <ArrowBackIosIcon fontSize='small' />
          </IconButton>
        </div>

      </div>
    </div>
  )
}

export default Register;