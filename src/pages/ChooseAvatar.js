import React from 'react'
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';
import { useState, useEffect } from 'react';
import axios from "axios";
import { Button } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from "react-redux";
import {  reset, uploadAvatar } from "../redux/features/userSlice";
import { Snackbar } from '@mui/material';




const ChooseAvatar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // state for avatars
    const [avatars, setAvatars] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [profilePic, setProfilePic] = useState(undefined)
    const [uploadMessage, setUploadMessage] = useState("")



    const { isError, isSuccess, message, isLoading } = useSelector((state) => state.user);

    const api = process.env.REACT_APP_AVATAR_API
    const apiKey = process.env.REACT_APP_API_KEY



    useEffect(() => {
        if (isError) {
            setUploadMessage(message)
        }
        if (isSuccess) {
            setUploadMessage(message)

        }
    }, [dispatch, isError, message, isSuccess])


    // call the create funtion in useeffect
    useEffect(() => {
        // create an async function to get data from multiavatar api on page load
        async function getAvatarsFromApi() {
            try {
                // craete an aempty array
                const data = [];
                // run a for loop 5 times to generate a random avatar from the api 
                for (let i = 0; i < 4; i++) {
                    // call the api
                    const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}?apiKey=${apiKey}`);
                    // define a buffer for the image
                    const buffer = new Buffer(image.data)
                    // now push the buffer into the data array but after converting it into base 64 string
                    data.push(buffer.toString('base64'))
                };
                // now the data array has the avatars , we will set the avatars state and change the loading to false
                setAvatars(data);
                setLoading(false)
            } catch (error) {
                console.log(error);
            }
        };
        getAvatarsFromApi()
    }, [api, apiKey]);

    async function uploadImage(e) {
        // make the selected avatar undefined again
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file)
        formData.append('upload_preset', 'TrellMessenger')
        try {
            setSelectedAvatar(undefined)
            setIsImageLoading(true)
            const response = await axios.post('https://api.cloudinary.com/v1_1/uplouder/image/upload', formData)
            const data = await response.data
            setProfilePic(data.secure_url)
            setIsImageLoading(false)
        } catch (error) {
            console.log(error);
            setIsImageLoading(false)
        }
    };

    function handleAvatarSelection(index) {
        setSelectedAvatar(avatars[index])
        setProfilePic(undefined)
    }

    function handleAvatarUploadAndContinue() {

        if (!selectedAvatar && !profilePic) {
            window.alert('Choose an avatar or upload your own')
        }
        if (selectedAvatar) {
            const avatar = `data:image/svg+xml;base64,${selectedAvatar}`
            dispatch(uploadAvatar(avatar))
            setTimeout(() => {
                navigate('/chats')
            }, 3500);

        }

        if (profilePic) {
            const avatar = profilePic
            dispatch(uploadAvatar(avatar))
            setTimeout(() => {
                navigate('/chats')
            }, 3500);

        }
        setTimeout(() => {
            dispatch(reset())
        }, 3000);
    };

    function handleSkipButton() {
        dispatch(reset())
        navigate('/chats')
    }


    return (
        <div className='h-screen w-[90%]  mx-auto flex flex-col md:flex-row items-center '>

            {/* mobile back button  */}
            <div className='absolute flex md:hidden top-5 left-4'>
                <IconButton aria-label='back' color='secondary' onClick={() => navigate('/register')} >
                    <ArrowBackIosIcon fontSize='small' />
                </IconButton>
            </div>

            {/* skip button for mobile  */}
            <div className='absolute flex md:hidden top-6 right-4' onClick={handleSkipButton}>
                <Button aria-label='skip' onClick={() => navigate('/chat')} variant="outlined" size='small' className='!text-xs !capitalize  !p-2' color='secondary' >Skip for now</Button>
            </div>

            {/* left side avatar div  */}

            {/* avatar image div  */}
            <div className={`${selectedAvatar ? 'flex' : 'hidden'}  justify-center items-center text-center w-[50%] mx-auto  mt-20 mb-5 md:my-0 transition-all`}>
                <img src={`data:image/svg+xml;base64,${selectedAvatar}`} alt="avatar_logo" className={` md:w-56 w-32`} />
            </div>

            {/* default avatar logo  */}
            <div className={`${(!selectedAvatar && !profilePic && !isImageLoading) ? 'flex' : 'hidden'}  justify-center items-center text-center w-[50%] mx-auto mt-20 mb-5 md:my-0 transition-all`}>
                <img src="/assets/avatar.svg" alt="avatar_logo" className={` md:w-56 w-32`} />
            </div>

            {/* profile pic image div  */}
            <div className={`${(profilePic || isImageLoading) ? "flex" : "hidden"}  justify-center items-center text-center w-[50%] mx-auto  mt-20 mb-5 md:my-0 transition-all`}>
                {isImageLoading ? <div className='flex my-6 justify-center items-center'>
                    <CircularProgress color='secondary' />
                </div> :
                    <img src={profilePic} alt="avatar_logo" className=" md:w-56 md:h-56 w-32 h-32 rounded-full object-cover" />
                }
            </div>


            {/* mobile screen  */}
            <div className='flex flex-col justify-center items-center mt-6'>
                <p className='flex md:hidden  font-dancingScript text-gray-500 text-[1.6rem] font-semibold tracking-wide'>Choose avatar</p>
                {/* avatars display div  */}
                <div className='md:hidden flex flex-row  mx-auto space-y-3 space-x-1 items-center w-[100%] flex-wrap my-2'>
                    {/* map the avatars  */}
                    {avatars?.map((avatar, index) => {
                        return (
                            loading ? <div className='h-full flex justify-center items-center' key={index}>
                                <Skeleton variant='circular' width={60} height={60} className="mr-3" />
                            </div> :
                                <div className={` w-20 h-20 rounded-full flex justify-center items-center cursor-pointer ${selectedAvatar === avatars[index] ? "border-4 border-green-500" : ""} transition-all`} key={index} onClick={() => handleAvatarSelection(index)}>
                                    <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" className='w-16 h-16 rounded-full' />
                                </div>
                        )
                    })}

                </div>

            </div>

            {/* right side choose avatar div  */}
            <div className='flex flex-col justify-center items-center w-[50%] mx-auto '>
                {(uploadMessage && isSuccess) && <>
                    <Snackbar open={true} autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                        <Alert severity="success" className='text-xs md:text-base' >{uploadMessage}</Alert>
                    </Snackbar>
                </>}
                {(uploadMessage && isError) && <>
                    <Snackbar open={true} autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                        <Alert severity="error" className='text-xs md:text-base' >{uploadMessage}</Alert>
                    </Snackbar>
                </>}
                <p className='hidden md:flex text-center font-dancingScript text-gray-500 text-4xl font-semibold'>Choose avatar</p>
                <div className='hidden md:flex justify-evenly mx-auto space-x-4 space-y-2 items-center w-[100%] flex-wrap my-2'>
                    {/* map the avatars  */}
                    {avatars?.map((avatar, index) => {
                        return (
                            loading ? <Skeleton variant='circular' width={95} height={95} key={index} className='flex items-center justify-center' /> :
                                <div className={`w-28 h-28 rounded-full  flex justify-center items-center cursor-pointer  ${selectedAvatar === avatars[index] ? "border-4 border-green-500" : ""} transition-all`} key={index} onClick={() => handleAvatarSelection(index)}>
                                    <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" className='w-24 h-24 rounded-full' />
                                </div>
                        )
                    })}
                </div>
                <h1 className="hidden md:flex  my-2 font-nunito text-xl text-gray-800">or</h1>


                {/* upload your own  */}
                <div className=' hidden w-[80%] mx-auto md:flex md:flex-col border-dashed border-2 h-36 border-purple-300 rounded-lg my-3 justify-center items-center '>
                    <ImageOutlinedIcon fontSize='large' color='disabled' />
                    <label htmlFor="contained-button-file">
                        <input accept="image/*" id="contained-button-file" type="file" className='!hidden' onChange={uploadImage} />
                        <Button variant="contained" component="span" className='!font-nunito !tracking-wide !my-2 !capitalize  !opacity-80' color='success' size='small' >
                            Upload Profile Pic
                        </Button>
                    </label>
                </div>
                <div className='hidden md:flex items-center justify-center w-[80%] mx-auto space-x-4 my-4 '>
                    <Button aria-label='skip' onClick={handleSkipButton} variant="outlined" size='small' color='secondary' className='!text-sm !capitalize !font-nunito !p-2 !my-2 !flex-1' >Skip for now</Button>
                    <Button aria-label='skip' onClick={handleAvatarUploadAndContinue} variant="contained" size='small' color='secondary' className={`!text-sm !capitalize !opacity-90 !font-nunito !p-2 !my-2 !flex-1 ${isLoading ? "!bg-gradient-to-tr from-gray-300 via-gray-300 to-gray-300 !opacity-40 " : ""} bg-gradient-to-tr from-rose-400 via-fuchsia-500 to-indigo-500`} >{!isLoading ? "Continue" : <CircularProgress color='secondary' size={25} style={{ paddingTop: "1px" }} />}</Button>

                </div>

            </div>

            <h1 className="flex md:hidden my-2 font-nunito text-sm text-gray-800">or</h1>
            <div className=' flex w-[90%] mx-auto md:hidden flex-col border-dashed border-2 h-36 border-purple-300 rounded-lg my-3 justify-center items-center  !lowercase'>
                <ImageOutlinedIcon fontSize='large' color='disabled' />
                <label htmlFor="contained-button-file">
                    {/* upload the image to cloudinary on selectingimage directly  */}
                    <input accept="image/*" id="contained-button-file" type="file" className='!hidden' onChange={uploadImage} />
                    <Button variant="contained" component="span" className='!font-nunito !tracking-wide !my-2 !capitalize  !opacity-70' color='success' size='small' >
                        Upload Profile Pic
                    </Button>
                </label>
            </div>
            <div className='flex md:hidden  w-[100%] mx-auto items-center justify-center my-8'>
                <Button aria-label='skip' onClick={handleAvatarUploadAndContinue} variant="contained" size='medium' color='secondary' className={` !text-sm !capitalize !w-[90%] !mx-auto !font-nunito !p-2 !opacity-70 ${isLoading ? "!bg-gradient-to-tr from-gray-300 via-gray-300 to-gray-300 !opacity-40 " : ""} !bg-gradient-to-tr from-rose-400 via-fuchsia-500 to-indigo-500`} > {!isLoading ? "Continue" : <CircularProgress color='secondary' size={25} style={{ paddingTop: "1px" }} />}</Button>
            </div>
        </div>
    )
};

export default ChooseAvatar