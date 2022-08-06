import React, { useState, useEffect } from 'react'
import { Avatar, Skeleton, Button, Badge, IconButton, TextField, InputAdornment, CircularProgress, Alert } from "@mui/material"
import VerifiedIcon from '@mui/icons-material/Verified';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import { logoutUser, reset } from '../redux/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { updateUsername, updateUserPassword, removeAvatar, getMe } from '../redux/features/userSlice';

const ProfileBigScreen = ({ user, loading }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [editNameinput, setEditNameInput] = useState(user?.name)
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const { message, isSuccess, isError } = useSelector((state) => state.user);
    const [messageText, setMessageText] = useState("")
    let passwordError = oldPassword.toLowerCase() === newPassword.toLowerCase()
    const token = JSON.parse(localStorage.getItem('token'));

    useEffect(() => {
        if (isSuccess || isError) {
            setMessageText(message)
        }
    }, [isSuccess, isError, message])

    function logout() {
        dispatch(logoutUser())
        dispatch(reset())
        navigate('/login')
    }

    function updateName() {
        dispatch(updateUsername(editNameinput))
        setTimeout(() => {
            dispatch(reset())
        }, 3000);
    };

    function updatePassword() {
        dispatch(updateUserPassword({ oldPassword, newPassword }))
        setTimeout(() => {
            dispatch(reset())
        }, 3000);
    }

    async function removeAvatarUniversally() {
        await dispatch(removeAvatar())
        dispatch(getMe(token))
        setTimeout(() => {
            dispatch(reset())
        }, 4000);

    }

    return (
        <>
            <div className='!hidden w-[35vw] h-screen md:!flex flex-col items-center overflow-y-auto bg-slate-50 relative scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 transition-all'>
                <div className={`w-[93%] mx-auto flex justify-center items-center rounded-xl my-4 relative`}>
                    {!user ? <Skeleton variant='circular' width={100} height={100} /> :
                        <div className='relative'>
                            <IconButton aria-label='profile' sx={{ position: "absolute", right: -12, top: 5 }} onClick={() => navigate('/loginchangeavatar')}>
                                <Badge color='error' overlap='circular'  >
                                    <EditIcon fontSize='1rem' color='action' />
                                </Badge>
                            </IconButton>
                            <div className='h-36 w-36 rounded-full mx-auto flex justify-center items-center my-2 z-20 relative transition-all '><Avatar src={user.avatar} alt='avatar' sx={{ height: "8.5rem", width: "8.5rem" }} /></div>
                        </div>
                    }
                    {/* details div  */}
                    <div className='absolute bg-white w-60 rounded-lg -bottom-14 pt-14 shadow-sm flex flex-col items-center justify-center'>
                        <p className='font-nunito capitalize font-semibold flex justify-center items-center text-lg'>{user.name}  <span className='!ml-1'><VerifiedIcon color='secondary' fontSize='.9rem' /></span> </p>
                        <p className='font-nunito tracking-wide text-sm text-slate-600 mb-2 font-light'>{user.email}</p>
                    </div>
                </div>

                {/* remove profile picture  */}
                {user?.isAvatarSet && <Button variant='outlined' color='error' className='!capitalize !font-nunito !tracking-wide !mt-16 !mb-5 !font-semibold !bg-white' onClick={removeAvatarUniversally} disabled={loading || !user?.isAvatarSet}>
                    Remove profile picture
                </Button>}
                {/* center options   */}
                <div className={`w-[80%] mx-auto mt-4 mb-[4.2rem] outline-none h-[40vh] ${!user?.isAvatarSet ? "mt-[4.5rem]" : ""}`}>
                    <Accordion sx={{ border: "1.5px solid #7B1FA0", boxShadow: "none", marginBottom: "5px" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="pannel" id='pannel-header' >
                            <p className='!font-nunito !text-gray-700 !font-semibold !my-0 capitalize'>Update username</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField placeholder="username" size='small' variant='standard' color='secondary'  value={editNameinput} autoComplete='off' onChange={(e) => setEditNameInput(e.target.value)} sx={{ width: "100%", marginTop: -2, marginBottom: 0, outlineWidth: "thin" }} InputProps={{ endAdornment: <InputAdornment position='end' sx={{ marginBottom: "2px" }}>{<IconButton disabled={(user?.name.toLowerCase() === editNameinput.toLowerCase()) || editNameinput.length === 0} onClick={updateName}>{!loading ? <CheckCircleIcon fontSize="1rem" color={((user?.name.toLowerCase() === editNameinput.toLowerCase()) || editNameinput.length === 0) ? "disabled" : "success"} /> : <CircularProgress color="secondary" size={20} />}</IconButton>}</InputAdornment> }}></TextField>
                            {message.length > 1 && <Alert sx={{ marginY: "2px", paddingY: 0 }} severity={isError ? "error" : "success"} variant="filled" >{messageText}</Alert>}
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={{ border: "1.5px solid #7B1FA0", boxShadow: "none", marginTop: "5px" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="pannel" id='pannel-header' >
                            <p className='!font-nunito !text-gray-700 !font-semibold !my-0 capitalize'>Change Password</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField placeholder="Current Password" size='small' variant='standard' color='secondary'  value={oldPassword} autoComplete='off' type="password" onChange={(e) => setOldPassword(e.target.value)} sx={{ width: "100%", marginTop: -2, marginBottom: 4, outlineWidth: "thin" }}></TextField>

                            <TextField placeholder="New Password" size='small' variant='standard' color='secondary'  value={newPassword} autoComplete='off' type="password" onChange={(e) => setNewPassword(e.target.value)} sx={{ width: "100%", marginTop: -2, marginBottom: 0, outlineWidth: "thin" }} InputProps={{ endAdornment: <InputAdornment position='end' sx={{ marginBottom: "2px" }}>{<IconButton disabled={passwordError || (oldPassword.length === 0 || newPassword.length === 0)} onClick={updatePassword}>{!loading ? <CheckCircleIcon fontSize="1rem" color={(passwordError || (oldPassword.length === 0 || newPassword.length === 0)) ? "disabled" : "success"} /> : <CircularProgress color="secondary" size={20} />}</IconButton>}</InputAdornment> }}></TextField>
                            {(passwordError && oldPassword.length > 1) && <p className='text-red-600 text-xs font-semibold font-nunito'>Passwords cannot be same</p>}

                            {message.length > 1 && <Alert sx={{ marginY: "2px", paddingY: 0 }} severity={isError ? "error" : "success"} variant="filled" >{messageText}</Alert>}
                        </AccordionDetails>
                    </Accordion>
                </div>
                <p className=' my-2 mx-auto text-center font-dancingScript text-purple-600 text-4xl'>Trell</p>
                {/* logout div  */}
                <Button className='!my-2 !w-[80%] !mx-auto !flex !justify-center !items-center  !p-2  ' variant='contained' color='secondary' onClick={logout}>
                    <LogoutIcon /> <p className='!font-nunito  !ml-1'>Logout</p>
                </Button>
            </div>

            {/* for mobile screen  */}
            <div className='w-full h-[91vh] flex md:!hidden flex-col items-center overflow-y-auto bg-slate-50 relative scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 transition-all'>
                <div className={`w-[93%] mx-auto flex justify-center items-center rounded-xl my-7 relative`}>
                    {!user ? <Skeleton variant='circular' width={100} height={100} /> :
                        <div className='relative'>
                            <IconButton aria-label='profile' sx={{ position: "absolute", right: -12, top: 5 }} onClick={() => navigate('/loginchangeavatar')}>
                                <Badge color='success' overlap='circular'  >
                                    <EditIcon fontSize='1rem' color='action' />
                                </Badge>
                            </IconButton>
                            <div className='h-36 w-36 rounded-full mx-auto flex justify-center items-center my-2 z-20 relative transition-all '><Avatar src={user.avatar} alt='avatar' sx={{ height: "8.5rem", width: "8.5rem" }} /></div>
                        </div>
                    }
                    {/* details div  */}
                    <div className='absolute bg-white w-60 rounded-lg -bottom-14 pt-14 shadow-sm flex flex-col items-center justify-center'>
                        <p className='font-nunito capitalize font-semibold flex justify-center items-center text-lg'>{user.name}  <span className='!ml-1 !mb-1'><VerifiedIcon color='secondary' fontSize='.9rem' /></span> </p>
                        <p className='font-nunito tracking-wide text-sm text-slate-600 mb-2 font-light'>{user.email}</p>
                    </div>
                </div>

                {/* remove profile picture  */}
                {user?.isAvatarSet && <Button variant='outlined' color='error' className='!capitalize !font-nunito !tracking-wide !mt-16 !mb-5 !font-semibold !bg-white' onClick={removeAvatarUniversally} disabled={loading || !user?.isAvatarSet}>
                    Remove profile picture
                </Button>}
                {/* center options   */}
                <div className={`w-[80%] mx-auto mt-4 mb-[4.2rem] outline-none h-[40vh] ${!user?.isAvatarSet ? "mt-[4.5rem]" : ""}`}>
                    <Accordion sx={{ border: "1.5px solid #7B1FA0", boxShadow: "none", marginBottom: "5px" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="pannel" id='pannel-header' >
                            <p className='!font-nunito !text-gray-700 !font-semibold !my-0 capitalize'>Update username</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField placeholder="username" size='small' variant='standard' color='secondary'  value={editNameinput} autoComplete='off' onChange={(e) => setEditNameInput(e.target.value)} sx={{ width: "100%", marginTop: -2, marginBottom: 0, outlineWidth: "thin" }} InputProps={{ endAdornment: <InputAdornment position='end' sx={{ marginBottom: "2px" }}>{<IconButton disabled={(user?.name.toLowerCase() === editNameinput.toLowerCase()) || editNameinput.length === 0} onClick={updateName}>{!loading ? <CheckCircleIcon fontSize="1rem" color={((user?.name.toLowerCase() === editNameinput.toLowerCase()) || editNameinput.length === 0) ? "disabled" : "success"} /> : <CircularProgress color="secondary" size={20} />}</IconButton>}</InputAdornment> }}></TextField>
                            {message.length > 1 && <Alert sx={{ marginY: "2px", paddingY: 0 }} severity={isError ? "error" : "success"} variant="filled" >{messageText}</Alert>}
                        </AccordionDetails>
                    </Accordion>

                    <Accordion sx={{ border: "1.5px solid #7B1FA0", boxShadow: "none", marginTop: "5px" }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="pannel" id='pannel-header' >
                            <p className='!font-nunito !text-gray-700 !font-semibold !my-0 capitalize'>Change Password</p>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField placeholder="Current Password" size='small' variant='standard' color='secondary'  value={oldPassword} autoComplete='off' type="password" onChange={(e) => setOldPassword(e.target.value)} sx={{ width: "100%", marginTop: -2, marginBottom: 4, outlineWidth: "thin" }}></TextField>

                            <TextField placeholder="New Password" size='small' variant='standard' color='secondary'  value={newPassword} autoComplete='off' type="password" onChange={(e) => setNewPassword(e.target.value)} sx={{ width: "100%", marginTop: -2, marginBottom: 0, outlineWidth: "thin" }} InputProps={{ endAdornment: <InputAdornment position='end' sx={{ marginBottom: "2px" }}>{<IconButton disabled={passwordError || (oldPassword.length === 0 || newPassword.length === 0)} onClick={updatePassword}>{!loading ? <CheckCircleIcon fontSize="1rem" color={(passwordError || (oldPassword.length === 0 || newPassword.length === 0)) ? "disabled" : "success"} /> : <CircularProgress color="secondary" size={20} />}</IconButton>}</InputAdornment> }}></TextField>
                            {(passwordError && oldPassword.length > 1) && <p className='text-red-600 text-xs font-semibold font-nunito'>Passwords cannot be same</p>}

                            {message.length > 1 && <Alert sx={{ marginY: "2px", paddingY: 0 }} severity={isError ? "error" : "success"} variant="filled" >{messageText}</Alert>}
                        </AccordionDetails>
                    </Accordion>
                </div>
                <p className=' my-2 mx-auto text-center font-dancingScript text-purple-600 text-4xl'>Trell</p>
                {/* logout div  */}
                <Button className='!mt-5 !mb-7 !w-[80%] !mx-auto !flex !justify-center !items-center  !p-2  ' variant='contained' color='secondary' onClick={logout}>
                    <LogoutIcon /> <p className='!font-nunito  !ml-1'>Logout</p>
                </Button>
            </div>
        </>
    )
}

export default ProfileBigScreen