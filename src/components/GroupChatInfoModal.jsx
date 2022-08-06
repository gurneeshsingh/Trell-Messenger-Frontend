import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from "react-redux"
import { Dialog, DialogActions, IconButton, InputAdornment, TextField } from "@mui/material"
import { Button, Avatar, Skeleton } from '@mui/material'
import { format } from 'date-fns'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { CircularProgress } from '@mui/material';
import axios from "axios"
import { updateGroupImage, renameGroup, removeFromGroup, resetStatus, deleteGroup, addUsersInGroup } from '../redux/features/chatSlice'
import { FaCrown } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { IoCloseOutline } from 'react-icons/io5'
import { searchUsersForChat } from '../utils/apiRoutes'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import { GrInfo } from "react-icons/gr"
import LogoutIcon from '@mui/icons-material/Logout';

const GroupChatInfoModal = ({ show, toggleShow, fetchAgain, setFetchAgain, showChatInfo, setShowChatInfo, goBackToChats }) => {

    const { activeChat, isLoading } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.user);
    const [groupNameText, setGroupNameText] = useState(activeChat?.groupName);
    const [changeGroupImageDisplay, setChangeGroupImageDisplay] = useState(false);
    const [uploadedGroupImage, setUploadedGroupImage] = useState(undefined);
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [addGroupMembersDisplay, setAddGroupMembersDisplay] = useState(false);
    const [searchMembersInput, setSearchMembersInput] = useState("")
    const [searching, setSearching] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [selectedGroupUsers, setSelectedGroupUsers] = useState([])
    const token = JSON.parse(localStorage.getItem('token'));
    const [toggleTextField, setToggleTextField] = useState(false);
    const inputFileRef = useRef();
    const [showConfirmButtons, setShowConfirmButtons] = useState(false);

    const dispatch = useDispatch()


    useEffect(() => {
        async function searchUsersToAddToGroup() {
            setSearching(true);
            if (searchMembersInput.length > 2) {
                const response = await axios.get(`${searchUsersForChat}?search=${searchMembersInput.toLowerCase()}`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                })
                const searchResults = await response.data
                let filteredResults = []
                filteredResults = searchResults.users.filter(element1 => {
                    return !activeChat?.users.find(element2 => {
                        return element2._id === element1._id
                    })
                });

                setSearchedUsers(filteredResults)
            }
            if (searchMembersInput.length === 0) {
                setSearchedUsers([])
            }
            setSearching(false)
            dispatch(resetStatus())
        }

        // call the function
        token && searchUsersToAddToGroup()
    }, [dispatch, token, searchMembersInput, activeChat?.users])


    async function uploadGroupImage(e) {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file)
        formData.append('upload_preset', 'TrellMessenger')
        try {
            setIsImageLoading(true)
            const response = await axios.post('https://api.cloudinary.com/v1_1/uplouder/image/upload', formData);
            const data = await response.data
            setUploadedGroupImage(data.secure_url)
            setIsImageLoading(false)
        } catch (error) {
            console.log(error);
            setIsImageLoading(false)
        }

    };
    async function uploadGroupImageMobile(e) {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file)
        formData.append('upload_preset', 'TrellMessenger')
        try {
            setIsImageLoading(true)
            const response = await axios.post('https://api.cloudinary.com/v1_1/uplouder/image/upload', formData);
            const data = await response.data
            setUploadedGroupImage(data.secure_url)
            setIsImageLoading(false)
            setShowConfirmButtons(!showConfirmButtons)

        } catch (error) {
            console.log(error);
            setIsImageLoading(false)
        }

    };


    function closeImageUpload() {
        setUploadedGroupImage(undefined)
        setChangeGroupImageDisplay(!changeGroupImageDisplay)
    }

    function updateImageUniversally(chatId, groupImage) {
        if (chatId && groupImage) {
            dispatch(updateGroupImage({ chatId, groupImage }))
            setChangeGroupImageDisplay(!changeGroupImageDisplay)
        }
    }
    function updateImageUniversallyMobile(chatId, groupImage) {
        if (chatId && groupImage) {
            dispatch(updateGroupImage({ chatId, groupImage }))
            setShowConfirmButtons(!showConfirmButtons)
            setChangeGroupImageDisplay(!changeGroupImageDisplay)
        }
    }

    function closeMainModal() {
        setFetchAgain(!fetchAgain)
        toggleShow(!show)
    }

    function renamegroupUniversally(chatId, groupName) {
        if (chatId && groupName) {
            dispatch(renameGroup({ chatId, groupName }))
        }
    };
    function renamegroupUniversallyMobile(chatId, groupName) {
        if (chatId && groupName) {
            dispatch(renameGroup({ chatId, groupName }))
        }
        setToggleTextField(!toggleTextField)
    };

    async function leaveGroupUniversally(chatId) {
        if (chatId && activeChat?.users?.length > 1) {
            await dispatch(removeFromGroup(chatId))
            setFetchAgain(!fetchAgain)
            toggleShow(!show)
        }
        if (chatId && activeChat?.users?.length === 1) {
            toggleShow(!show)
            await dispatch(deleteGroup(chatId))
            setFetchAgain(!fetchAgain)
        }
    };
    async function leaveGroupUniversallyMobile(chatId) {
        if (chatId && activeChat?.users?.length > 1) {
            setShowChatInfo(!showChatInfo)
            await dispatch(removeFromGroup(chatId))
            setFetchAgain(!fetchAgain)
        }
        if (chatId && activeChat?.users?.length === 1) {
            setShowChatInfo(!showChatInfo)
            goBackToChats()
            await dispatch(deleteGroup(chatId))
            setFetchAgain(!fetchAgain)
        }
    };


    function removeFromSeletedMembers(id) {
        let remainingUsers = [];
        remainingUsers = selectedGroupUsers.filter((element) => element._id !== id)
        setSelectedGroupUsers(remainingUsers)
    }

    function closeAddMembers() {
        setSearchMembersInput("")
        setSelectedGroupUsers([])
        setAddGroupMembersDisplay(false)
    }

    async function addUsersToGroupUniversally(chatId, users) {
        if (chatId) {
            await dispatch(addUsersInGroup({ chatId, users }))
            setFetchAgain(!fetchAgain)
            toggleShow(!show)
        }
    };
    async function addUsersToGroupMobile(chatId, users) {
        if (chatId) {
            await dispatch(addUsersInGroup({ chatId, users }))
            setFetchAgain(!fetchAgain)
            goBackToChats()
        }
    };


    function saveMobile() {
        setFetchAgain(!fetchAgain)
        setShowChatInfo(!showChatInfo)
    };

    function hanldeMobileUpload() {
        inputFileRef.current.click()
    };

    function cancelMobileUpload() {
        setChangeGroupImageDisplay(!changeGroupImageDisplay)
        setUploadedGroupImage(undefined)
    };



    return (
        <>
            {/* for desktop screen  */}
            <Dialog open={show} onClose={() => toggleShow(false)} fullWidth={true} maxWidth="sm" className='!hidden md:!block !transition-all !scrollbar-thin !scrollbar-thumb-purple-300 !scrollbar-track-purple-100 !overflow-y-auto'>
                {!activeChat ? <Skeleton variant="circular" width="6.3rem" height="6.3rem" /> : (!changeGroupImageDisplay && !addGroupMembersDisplay) ? <div className='w-28 h-28 rounded-full border-2 border-green-400 flex justify-center items-center mt-2 mb-2 mx-auto shadow-sm cursor-pointer hover:bg-gray-50 transition-all ' onClick={() => setChangeGroupImageDisplay(!changeGroupImageDisplay)}>
                    <Avatar alt="Group Image" src={activeChat?.groupImage} sx={{ height: "6.3rem", width: "6.3rem" }} />
                </div>
                    :
                    !addGroupMembersDisplay && <div className='w-[90%]  h-52  flex justify-center items-center mt-5 mb-4 mx-auto  transition-all '>
                        {isImageLoading ? <CircularProgress color='secondary' /> : (uploadedGroupImage === undefined) ? <Avatar alt="Group Image" src={activeChat?.groupImage} sx={{ height: "100%", width: "100%", borderRadius: "10px" }} /> : <Avatar alt="Group Image" src={uploadedGroupImage} sx={{ height: "100%", width: "100%", borderRadius: "10px" }} />}
                    </div>
                }
                {!activeChat ? <Skeleton variant='text' /> : <p className={`font-nunito font-bold text-center text-xl capitalize ${addGroupMembersDisplay && "mt-5 "}`}>{activeChat?.groupName}</p>}
                {!activeChat ? <Skeleton variant='text' /> : <div className='w-[90%] mx-auto flex flex-col items-center justify-center pb-2  bg-yellow-300 pt-2 rounded-lg my-2 shadow-md'>
                    <p className='font-nunito font-light text-sm text-gray-600 text-center'>Group - {activeChat?.users.length} {activeChat?.users.length > 1 ? "participants" : "participant"}</p>
                    {activeChat?.createdAt === activeChat?.updatedAt ? <p className='font-nunito font-light text-sm text-gray-600 text-center'>Created by {activeChat?.groupAdmin?.name} on {format(new Date(activeChat?.createdAt), 'dd/MM/yy')}</p> :
                        <p className='font-nunito font-light text-sm text-gray-600 text-center'>Updated by {activeChat?.groupAdmin?.name} on {format(new Date(activeChat?.updatedAt), 'dd/MM/yy')}</p>
                    }
                </div>}
                {!activeChat ? <Skeleton variant='rectangular' height={50} width={90} /> :
                    !changeGroupImageDisplay && <div>
                        <p className='w-[90%] mx-auto font-nunito font-semibold mt-2'>Participants ({activeChat?.users?.length})</p>
                        <div className='w-[90%] mx-auto my-1 flex items-center flex-wrap  overflow-y-auto rounded-lg max-h-28 scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-green-50 transition-all'>
                            {activeChat?.users.map((auser) => (
                                <div key={auser?._id} className=" my-1 py-1 px-2 w-[31%] mx-1 flex border-[1.5px] border-dotted border-green-600  items-center  rounded-lg  ">
                                    <Avatar alt="individual_user" src={auser?.avatar} />
                                    <p className='capitalize text-sm text-gray-600 font-nunito  ml-2 flex-1'>{auser?.name}</p>
                                    {activeChat?.groupAdmin?._id === auser?._id && <FaCrown color='#FDE047' />}
                                </div>
                            ))}
                        </div>
                    </div>
                }
                {(user?._id === activeChat?.groupAdmin._id && !addGroupMembersDisplay) && <Button variant='outlined' color="success" sx={{ width: "90%", marginX: "auto", marginY: ".2rem" }} className={`!text-sm !capitalize ${changeGroupImageDisplay && "!hidden"}`} onClick={() => setAddGroupMembersDisplay(!addGroupMembersDisplay)}>Add members +</Button>}
                {(!changeGroupImageDisplay && !addGroupMembersDisplay) && <p className='font-nunito font-semibold  w-[90%] mx-auto mt-1.5'>Group Name</p>}
                {(!changeGroupImageDisplay && !addGroupMembersDisplay) && <div className='!w-[90%] !mx-auto  !transition-all flex items-center my-1 '>
                    <TextField color='secondary' autoComplete='off' name='groupNameText' value={groupNameText} onChange={(e) => setGroupNameText(e.target.value)} size="small" sx={{ flex: "1", backgroundColor: "rgb(249 250 251)", marginRight: "1rem", padding: "0" }} placeholder="Group name" />
                    <Button variant='outlined' color="success" size='medium' disabled={(groupNameText.toLowerCase() === activeChat?.groupName.toLowerCase()) || (groupNameText.length === 0)} onClick={() => renamegroupUniversally(activeChat?._id, groupNameText)}>Update</Button>
                </div>}

                {/* add more menmbers div   */}

                {addGroupMembersDisplay && <div className='flex flex-col justify-center w-[90%] mx-auto my-3'>

                    <TextField color='secondary' autoComplete='off' name='search' value={searchMembersInput} onChange={(e) => setSearchMembersInput(e.target.value)} size="small" sx={{ backgroundColor: "rgb(249 250 251)", marginBottom: ".5rem", flexGrow: "1" }} placeholder="Search users to add" InputProps={{ startAdornment: <InputAdornment position='start' ><FiSearch fontSize="1.1rem" /></InputAdornment>, endAdornment: <InputAdornment position='end'>{searchMembersInput.length > 0 && <IconButton color='error' onClick={() => setSearchMembersInput("")}>{!searching ? <IoCloseOutline fontSize="1.1rem" /> : <CircularProgress color="secondary" size={20} />}</IconButton>}</InputAdornment> }} />

                    {searchMembersInput.length > 0 && <div className='!w-[100%] !mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-purple-50 !max-h-48 mt-2'>
                        <h2 className=' mb-4  p-2 font-nunito mr-5 text-purple-700 font-medium border-b tracking-wide'>Users ({searchedUsers.length})</h2>
                        {searchedUsers.length > 0 && searchedUsers?.map((searchedUser) => (
                            <div className='flex items-center w-[96%] mx-auto transition-all' key={searchedUser._id}>
                                <button className="flex items-center mt-1 mb-1 mr-2 p-2 rounded-xl transition-all cursor-pointer hover:bg-purple-300 bg-gray-50 w-[100%] disabled:pointer-events-none disabled:bg-green-300 disabled:hover:bg-none disabled:w-[90%]" onClick={() => setSelectedGroupUsers([...selectedGroupUsers, searchedUser])} disabled={selectedGroupUsers?.find((guser) => guser?._id === searchedUser?._id)}>
                                    <Avatar alt='user' src={searchedUser?.avatar} sx={{ marginRight: "1.3rem", width: 40, height: 40 }} />
                                    <div className='flex flex-col justify-center '>
                                        <p className='text-left font-nunito tracking-wide text-sm '>{searchedUser?.name}</p>
                                        <p className='text-left font-nunito tracking-wide text-xs text-gray-500'>{searchedUser?.email}</p>
                                    </div>
                                </button>
                                {selectedGroupUsers?.find((guser) => guser._id === searchedUser?._id) && <IconButton color='error' className='!z-50' onClick={() => removeFromSeletedMembers(searchedUser._id)} >
                                    <IoCloseOutline fontSize="1.1rem" />
                                </IconButton>}
                            </div>
                        ))}
                    </div>}
                </div>}

                {/* upload group div  */}
                {changeGroupImageDisplay && <div className=' w-[90%] mx-auto md:flex md:flex-col border-dashed border-2 h-32 border-green-500 rounded-lg my-3 justify-center items-center '>
                    <ImageOutlinedIcon fontSize='large' color='disabled' />
                    <label htmlFor="contained-button-file">
                        <input accept="image/*" id="contained-button-file" type="file" className='!hidden' onChange={uploadGroupImage} />
                        <Button variant="outlined" component="span" className='!font-nunito !tracking-wide !my-2 !capitalize  ' color='success' size='small' disabled={isImageLoading} >
                            Upload Group Pic
                        </Button>
                    </label>
                </div>}

                {(!changeGroupImageDisplay && !addGroupMembersDisplay) ? <DialogActions sx={{ width: "93%", marginX: "auto", marginY: ".4rem" }}>
                    <Button onClick={closeMainModal} variant="outlined" size='small' color="warning" sx={{ marginRight: ".5rem" }}>Close</Button>
                    <Button autoFocus onClick={() => leaveGroupUniversally(activeChat?._id)} color="error" variant='contained' size="small" >{activeChat?.users?.length === 1 ? "Exit and Delete Group" : "Leave Group"}</Button>
                </DialogActions> :
                    <DialogActions sx={{ width: "93%", marginX: "auto", marginY: ".4rem" }}>
                        <Button onClick={!addGroupMembersDisplay ? closeImageUpload : closeAddMembers} variant="outlined" size='small' color="warning" sx={{ marginRight: ".5rem" }}>Back</Button>
                        <Button autoFocus onClick={!addGroupMembersDisplay ? () => updateImageUniversally(activeChat?._id, uploadedGroupImage) : () => addUsersToGroupUniversally(activeChat?._id, selectedGroupUsers)} color="success" variant='contained' size="small" disabled={isLoading || (selectedGroupUsers.length === 0 && uploadedGroupImage === undefined)} >{!addGroupMembersDisplay ? "Update group image" : "Add members"}</Button>
                    </DialogActions>
                }

            </Dialog>

            {/* for mobile screen left side drawer  */}
            <div className='md:hidden  w-[100vw] h-screen flex flex-col overflow-y-auto bg-white  relative scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 transition-all'>

                <div className='flex w-[100%] mx-auto mt-5 mb-2 pb-3 items-center border-b border-[rgb(209 213 219)]'>
                    <IconButton size="medium" color="secondary" onClick={() => setShowChatInfo(!showChatInfo)} className="!ml-3"  >
                        <ArrowBackIosIcon fontSize='1rem' color="secondary" />
                    </IconButton>
                    <p className='font-nunito font-bold flex-grow text-center text-lg ml-7'>Edit Group</p>
                    <Button size="small" color="secondary" variant='text' className='!capitalize !font-nunito !font-semibold  !mt-1 !mr-3 ' onClick={saveMobile}>Save</Button>
                </div>
                {/* group icon div */}
                <div className={`my-3 w-[100%] flex flex-col items-center ${changeGroupImageDisplay && 'justify-center h-full !my-0'} transition-all`}>
                    {!changeGroupImageDisplay ? <div className='flex justify-center items-center w-[8rem] h-[8rem] rounded-full border-2 border-purple-600 cursor-pointer mb-6 hover:bg-slate-50 transition-all' onClick={() => setChangeGroupImageDisplay(!changeGroupImageDisplay)}>
                        <Avatar alt="Group Image" src={activeChat?.groupImage} sx={{ height: "7.5rem", width: "7.5rem" }} />
                    </div> :
                        <div className='justify-center items-center w-[90%] mx-auto flex h-[15rem] transition-all -mt-10'>
                            {isImageLoading ? <CircularProgress color='secondary' /> : (uploadedGroupImage === undefined) ?
                                <Avatar alt="Group Image" src={activeChat?.groupImage} sx={{ height: "100%", width: "100%", borderRadius: "5px" }} /> : <Avatar alt="Group Image" src={uploadedGroupImage} sx={{ height: "100%", width: "100%", borderRadius: "5px" }} />}
                        </div>}
                    {!changeGroupImageDisplay && <div className='flex w-[90%] mx-auto mt-2 mb-2 items-center'>
                        <GrInfo />
                        <h2 className='font-nunito font-bold text-left text-lg self-baseline w-[90%] ml-3'>Info</h2>
                    </div>}

                    {!changeGroupImageDisplay && <div className='w-[90%] mx-auto bg-purple-100 bg-opacity-50 rounded-lg shadow-sm drop-shadow-sm p-3 mb-1 flex items-center'>
                        {!toggleTextField ? <p className={`font-nunito font-semibold text-base capitalize text-purple-900 flex-1`}>{activeChat?.groupName}</p> :
                            <input autoComplete='off' name='groupNameText' value={groupNameText} onChange={(e) => setGroupNameText(e.target.value)} placeholder="Group name" className='bg-transparent flex-1 outline-none border-b border-purple-800 mr-3' />}
                        {!toggleTextField ? <IconButton size='small' color="success" onClick={() => setToggleTextField(!toggleTextField)}>
                            <EditIcon fontSize=".7rem" color="success" />
                        </IconButton> :
                            <>
                                <IconButton size='small' color="success" onClick={() => renamegroupUniversallyMobile(activeChat?._id, groupNameText)} disabled={(groupNameText.toLowerCase() === activeChat?.groupName.toLowerCase()) || (groupNameText.length === 0)}>
                                    <CheckCircleIcon fontSize=".7rem" color={((groupNameText.toLowerCase() === activeChat?.groupName.toLowerCase()) || (groupNameText.length === 0)) ? "disabled" : "success"} />
                                </IconButton>
                                <IconButton size='small' color="error" onClick={() => setToggleTextField(!toggleTextField)}>
                                    <CloseRoundedIcon fontSize=".7rem" color="error" />
                                </IconButton>
                            </>}
                    </div>}
                    {!changeGroupImageDisplay && <div className='w-[90%] mx-auto bg-purple-100 bg-opacity-50 rounded-lg shadow-sm drop-shadow-sm py-3 px-3 mb-1 flex flex-col justify-center '>
                        <p className='font-nunito  text-xs text-black '>Group - {activeChat?.users.length} {activeChat?.users.length > 1 ? "participants" : "participant"}</p>
                        {activeChat?.createdAt === activeChat?.updatedAt ? <p className='font-nunito tracking-wide font-light text-sm text-purple-900 '>Created by {activeChat?.groupAdmin?.name} on {format(new Date(activeChat?.createdAt), 'dd/MM/yy')}</p> :
                            <p className='font-nunito tracking-wide text-xs text-black '>Updated by {activeChat?.groupAdmin?.name} on {format(new Date(activeChat?.updatedAt), 'dd/MM/yy')}</p>
                        }
                    </div>}
                    {!changeGroupImageDisplay && <div className='w-full border-b border-[rgb(209 213 219)] flex my-6'></div>}

                    {(activeChat?.groupUpdates?.length > 0 && !changeGroupImageDisplay) && <div className='w-[90%] mx-auto my-1'>
                        <Accordion sx={{
                            backgroundColor: "#7954A1", boxShadow: "none", marginBottom: "2px", borderRadius: "15px", '&:before': {
                                display: 'none',
                            }
                        }} >
                            <AccordionSummary expandIcon={<ExpandMoreIcon color="disabled" />} aria-controls="pannel" id='pannel-header' >
                                <p className='!font-nunito text-white !font-semibold text-sm !my-0 capitalize'>Group Updates </p>
                            </AccordionSummary>
                            <AccordionDetails sx={{ backgroundColor: "white", borderRadius: "5px", width: "95%", marginX: "auto", marginBottom: "10px" }}>
                                {activeChat?.isGroupChat && activeChat?.groupUpdates?.map((update, index) => (
                                    <div className='flex items-center  w-full  mt-1 mb-1  py-[8px]  z-50 border-b border-[rgb(209 213 219)] ' key={index}>
                                        <p className=' font-nunito text-xs font-semibold text-black first-letter:capitalize flex-1 '>{`${update?.updateMessage}`}</p>
                                        <p className=' font-nunito text-[10px] font-medium text-gray-800'>{format(new Date(update?.updateTime), `MMMM d, yy h:mm a`)}</p>
                                    </div>
                                ))}
                            </AccordionDetails>
                        </Accordion>
                    </div>}

                    {(activeChat?.groupUpdates?.length > 0 && !changeGroupImageDisplay) && <div className='w-full border-b border-[rgb(209 213 219)] flex my-5'></div>}

                    {!changeGroupImageDisplay && <div className='flex w-[90%] mx-auto mt-2 mb-6 items-center'>
                        <PeopleOutlineIcon />
                        <p className='font-nunito font-semibold ml-3 flex-1'>{activeChat?.users.length > 1 ? "Participants" : "Participant"} ({activeChat?.users.length})</p>
                        {(user?._id === activeChat?.groupAdmin._id && !addGroupMembersDisplay) ? <Button variant='outlined' color="success" className={`!text-xs !capitalize`} onClick={() => setAddGroupMembersDisplay(!addGroupMembersDisplay)} >Add members +</Button> :
                            <div>
                                <IconButton size='small' disabled={isLoading || (selectedGroupUsers.length === 0)} color='success' onClick={() => addUsersToGroupMobile(activeChat?._id, selectedGroupUsers)} >
                                    <CheckCircleIcon fontSize=".7rem" color={(isLoading || (selectedGroupUsers?.length === 0)) ? "disabled" : "success"} />
                                </IconButton>
                                <IconButton size='small' color="error" onClick={() => setAddGroupMembersDisplay(!addGroupMembersDisplay)}>
                                    <CloseRoundedIcon fontSize=".7rem" color="error" />
                                </IconButton>
                            </div>
                        }
                    </div>}

                    {!addGroupMembersDisplay ? activeChat?.users?.map((auser) => (
                        <div key={auser?._id} className={` mb-1.5 py-2.5 px-3  w-[90%] mx-auto flex items-center bg-purple-50 rounded-lg shadow-sm drop-shadow-sm ${changeGroupImageDisplay && '!hidden'} `}>
                            <Avatar alt="individual_user" src={auser?.avatar} sx={{ height: "2.4rem", width: "2.4rem" }} />
                            <div className='flex flex-col justify-center flex-1'>
                                <p className='capitalize text-sm text-gray-800 font-nunito font-semibold  ml-4 '>{auser?.name}</p>
                                <p className=' text-xs text-gray-400 font-nunito   ml-4 '>{auser?.email}</p>
                            </div>
                            {activeChat?.groupAdmin?._id === auser?._id &&
                                <p className='font-nunito text-xs text-gray-400 font-medium'>Group Admin</p>
                            }
                        </div>
                    )) : <div className='flex flex-col justify-center w-[90%] mx-auto my-2'>
                        <TextField color='secondary' autoComplete='off' name='search' value={searchMembersInput} onChange={(e) => setSearchMembersInput(e.target.value)} size="small" sx={{ backgroundColor: "rgb(249 250 251)", marginBottom: ".3rem", flexGrow: "1" }} placeholder="Search users to add" InputProps={{ startAdornment: <InputAdornment position='start' ><FiSearch fontSize="1rem" /></InputAdornment>, endAdornment: <InputAdornment position='end'>{searchMembersInput.length > 0 && <IconButton color='error' onClick={() => setSearchMembersInput("")}>{!searching ? <IoCloseOutline fontSize="1rem" /> : <CircularProgress color="secondary" size={16} />}</IconButton>}</InputAdornment>, style: { fontSize: 14 } }} />

                        {searchMembersInput.length > 0 && <div className='!w-[100%] !mx-auto mt-2'>
                            <h2 className=' mb-4  p-2 font-nunito  text-purple-800 font-medium border-b text-sm'>Users ({searchedUsers.length})</h2>
                            {searchedUsers.length > 0 && searchedUsers?.map((searchedUser) => (
                                <div className='flex items-center w-full mx-auto transition-all' key={searchedUser._id}>
                                    <button className="flex flex-1 items-center  mb-1.5  p-2 rounded-lg transition-all cursor-pointer hover:bg-purple-200 bg-gray-50 w-[100%] disabled:pointer-events-none disabled:bg-lime-200 disabled:hover:bg-none disabled:w-[90%] disabled:flex-1 disabled:mr-2" onClick={() => setSelectedGroupUsers([...selectedGroupUsers, searchedUser])} disabled={selectedGroupUsers?.find((guser) => guser?._id === searchedUser?._id)}>
                                        <Avatar alt='user' src={searchedUser?.avatar} sx={{ marginRight: "1.3rem", width: 35, height: 35 }} />
                                        <div className='flex flex-col justify-center '>
                                            <p className='text-left font-nunito tracking-wide font-semibold text-sm '>{searchedUser?.name}</p>
                                            <p className='text-left font-nunito tracking-wide text-xs text-gray-500'>{searchedUser?.email}</p>
                                        </div>
                                    </button>
                                    {selectedGroupUsers?.find((guser) => guser._id === searchedUser?._id) && <IconButton color='error' className='!z-50' onClick={() => removeFromSeletedMembers(searchedUser._id)} >
                                        <IoCloseOutline fontSize="1.1rem" />
                                    </IconButton>}
                                </div>
                            ))}
                        </div>}
                    </div>}

                    {!changeGroupImageDisplay && <div className='w-full border-b border-[rgb(209 213 219)] flex my-5'></div>}
                    {!changeGroupImageDisplay && <button className='w-[90%] mx-auto mt-2 mb-6 flex items-center bg-red-50 rounded-lg px-3 py-3' onClick={() => leaveGroupUniversallyMobile(activeChat?._id)}>
                        <LogoutIcon color='error' fontSize='small' />
                        <p className='ml-3 text-sm font-nunito text-red-600 font-bold'>{activeChat?.users?.length === 1 ? "Exit and Delete Group" : "Leave Group"}</p>
                    </button>}
                    {changeGroupImageDisplay && !showConfirmButtons && <div className='w-[90%] mx-auto flex items-center justify-center space-x-5 absolute bottom-10'>
                        <Button variant='outlined' color='warning' className='!capitalize !font-nunito !text-xs !font-semibold'  onClick={cancelMobileUpload}>Cancel</Button>
                        <input accept="image/*" type="file" className='!hidden' onChange={uploadGroupImageMobile} ref={inputFileRef} />
                        <Button variant='outlined'  disabled={isImageLoading} color='success' className='!capitalize !font-nunito !text-xs !font-semibold' onClick={hanldeMobileUpload}>Choose photo</Button>
                        
                    </div>}
                    {showConfirmButtons && <div className='w-[70%] mx-auto flex items-center justify-around  absolute bottom-10'>
                        <IconButton variant='outlined' color='error' onClick={() => setShowConfirmButtons(!showConfirmButtons)}><IoCloseOutline color='error' fontSize="2rem" /></IconButton>
                        <IconButton variant='outlined' color='success' onClick={()=>updateImageUniversallyMobile(activeChat?._id, uploadedGroupImage)} ><CheckCircleIcon color="success" fontSize="2rem" /></IconButton>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default GroupChatInfoModal