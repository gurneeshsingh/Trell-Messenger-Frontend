import React, { useEffect } from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { BsChatDots } from 'react-icons/bs';
import { VscBell, VscBellDot } from "react-icons/vsc";
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import { useSelector, useDispatch } from 'react-redux';
import { TextField } from '@mui/material';
import { AiOutlineUsergroupAdd } from "react-icons/ai"
import { IconButton } from "@mui/material"
import { FiSearch } from "react-icons/fi"
import { useState } from 'react';
import { InputAdornment } from "@mui/material"
import { IoCloseOutline } from "react-icons/io5"
import ChatUsersSideBar from './ChatUsersSideBar';
import { searchUsersForChat } from "../utils/apiRoutes"
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress'
import { accessSingleChat, createGroupChat } from '../redux/features/chatSlice';
import { toggleChat, resetStatus, removeUnread } from '../redux/features/chatSlice';
import { Dialog, DialogActions, DialogTitle } from "@mui/material"
import { Button } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import ProfileBigScreen from './ProfileBigScreen';
import { getMe } from '../redux/features/userSlice';
import NotificationPopper from './NotificationPopper';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { getSender } from '../utils/chatLogic';




const SideBarBig = ({ chats, fetchAgain, setFetchAgain, singlechatMobileView, setSinglechatMobileView }) => {

    const { user, isLoading } = useSelector((state) => state.user);
    const [searchInput, setSearchInput] = useState("");
    const [groupSearchInput, setGroupSearchInput] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchedChats, setSearchedChats] = useState([]);
    const [searchedFinal, setSearchedFinal] = useState([]);
    const [searchedUsers, setSearchedUsers] = useState([])
    const token = JSON.parse(localStorage.getItem('token'));
    const [groupChatModal, setGroupChatModal] = useState(false);
    const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const { isSuccess, isError } = useSelector((state) => state.chat);
    const [drawerSide, setDrawerSide] = useState(false);
    const [viewNotifications, setViewNotifications] = useState(false)
    const dispatch = useDispatch();


    function checkForExistingChatsInSearch(chats) {
        chats.length > 0 && chats?.forEach((chat) => {
            if (chat.isGroupChat) {
                const gName = chat.groupName.toLowerCase();
                if (searchInput.toLowerCase() === gName.substring(0, searchInput.length)) {
                    setSearchedChats((prev) => [...prev, chat])
                }
            } else {
                // get the senders name
                const sender = getSender(user, chat.users)?.name.toLowerCase();
                if (searchInput.toLowerCase() === sender.substring(0, searchInput.length)) {
                    setSearchedChats((prev) => [...prev, chat])
                }
            }
        })
        // to make the array unique
        const ids = searchedChats?.map(c => c._id)
        const filtered = searchedChats?.filter(({ _id }, index) => !ids.includes(_id, index + 1))
        setSearchedFinal(filtered)
    };

    useEffect(() => {
        if (isSuccess || isError) {
            setGroupName("")
            setSelectedGroupUsers([])

        }
    }, [isSuccess, isError])

    useEffect(() => {
        async function handleSearch() {
            // set the search state first
            // set searching to true to show loading in the search bar
            setSearching(true)
            if ((searchInput.length > 2) || (groupSearchInput.length > 2)) {
                // check if the chat or group already exists
                checkForExistingChatsInSearch(chats)
                const response = await axios.get(`${searchUsersForChat}?search=${searchInput.length > 2 ? searchInput.toLowerCase() : groupSearchInput.toLowerCase()}`, {
                    headers: {
                        authorization: `Bearer ${token}`
                    }
                });
                const searchResults = await response.data.users
                setSearchedUsers(searchResults)
            }
            if ((searchInput.length === 0) && (groupSearchInput.length === 0)) {
                setSearchedUsers([])
                setSearchedChats([])
                setSearchedFinal([])
            }
            setSearching(false)
            dispatch(resetStatus())
        }

        // call the function
        token && handleSearch()
    }, [searchInput, token, groupSearchInput, dispatch])

    async function accessOrCreateSingleChat(id) {
        dispatch(accessSingleChat(id));
        setSearchInput("")
        setGroupSearchInput("")
        dispatch(resetStatus())

    };

    function checkForUnreadMessages(chat) {
        if (!chat?.isGroupChat) {
            return chat?.unreadMessages?.filter((message) => message?.sender?._id !== user?._id).length > 0 ? true : false
        }
    };

    function toogleGroupChatModal() {
        setGroupSearchInput("")
        setSearchInput("")
        setGroupName("")
        setGroupChatModal(true)
    }

    function closegroupModal() {
        setGroupSearchInput("")
        setSearchInput("")
        setSelectedGroupUsers([])
        setGroupName("")
        setGroupChatModal(false)

    }

    function removeFromGroup(id) {
        let modifiedGroupUsers = []
        modifiedGroupUsers = selectedGroupUsers?.filter((guser) => guser._id !== id)
        setSelectedGroupUsers(modifiedGroupUsers)
    }

    async function startGroupChat() {
        dispatch(createGroupChat({ users: selectedGroupUsers, groupName }))
        setGroupSearchInput("")
        setSearchInput("")
        setGroupChatModal(false)
    }
    async function startGroupChatMobile() {
        dispatch(createGroupChat({ users: selectedGroupUsers, groupName }))
        closegroupModal()
    }

    function closeDrawer() {
        setDrawerSide(!drawerSide)
        dispatch(getMe(token))
    }


    async function toggleChatAndRemoveUnread(chat, userId) {
        dispatch(toggleChat(chat))
        if (chat?.unreadMessages?.length > 0 || user?.groupNotifications.length > 0) {
            await dispatch(removeUnread({ chat, userId }))
            !chat?.isGroupChat && setFetchAgain(!fetchAgain)
            chat?.isGroupChat && dispatch(getMe(token))
        }
        setSinglechatMobileView(!singlechatMobileView);
    };

    function modifyData(list1, list2) {
        return list1.filter((l1) => !list2.find((l2) => getSender(user, l2.users)?._id === l1._id))
    }


    return (
        // for desktop screen 
        <>
            <div className='!w-[35%] !hidden  md:!flex !flex-col !mr-auto !border-r !border-gray-300 !h-screen !transition-all'>
                <AppBar position='static' color='transparent' sx={{ boxShadow: "none" }}>
                    <Toolbar sx={{ borderBottom: "1px solid rgb(209 213 219)", display: "flex", alignItems: "center", marginTop: "10px" }}>
                        <BsChatDots fontSize="1.5rem" color='#9900F0' style={{ marginRight: "1rem" }} />
                        <p className='font-nunito  text-gray-600 text-2xl font-semibold flex-1 '>Trell</p>
                        {user?.groupNotifications?.length > 0 || chats?.some((chat) => checkForUnreadMessages(chat)) ? <IconButton sx={{ marginRight: "10px" }} color="secondary" onClick={() => setViewNotifications(!viewNotifications)}  ><VscBellDot fontSize="1.3rem" color='#9900F0' /></IconButton> :
                            <IconButton sx={{ marginRight: "10px" }} onClick={() => setViewNotifications(!viewNotifications)}  ><VscBell fontSize="1.3rem" color='rgb(75 85 99/.8)' /></IconButton>
                        }
                        {!user ? <Skeleton variant="circular" width={40} height={40} /> : <button onClick={() => setDrawerSide(!drawerSide)}>
                            <Avatar alt='user' src={user?.avatar} sx={{ height: "3rem", width: "3rem" }} />
                        </button>}
                    </Toolbar>
                </AppBar>
                {viewNotifications && <NotificationPopper setViewNotifications={setViewNotifications} viewNotifications={viewNotifications} chats={chats} checkMessage={checkForUnreadMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}

                <div className='flex items-center w-[90%] mx-auto my-3 transition-all'>
                    <p className='font-nunito flex-1 text-gray-800 font-medium text-lg flex items-center'>Chats <span className='font-nunito text-sm text-white bg-purple-600 !font-bold ml-2 h-6 w-6 p-1 rounded-full flex justify-center items-center text-center'>{chats?.length}</span></p>
                    <IconButton onClick={toogleGroupChatModal}>
                        <AiOutlineUsergroupAdd fontSize="1.3rem" color='green' />
                    </IconButton>
                </div>
                <div className='!w-[90%] !mx-auto  !transition-all '>
                    <TextField color='secondary' autoComplete='off' name='search' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} size="small" sx={{ width: "100%", backgroundColor: "rgb(249 250 251)" }} placeholder="Search or start a new chat" InputProps={{ startAdornment: <InputAdornment position='start' ><FiSearch fontSize="1.1rem" /></InputAdornment>, endAdornment: <InputAdornment position='end'>{searchInput.length > 0 && <IconButton color='error' onClick={() => setSearchInput("")}>{!searching ? <IoCloseOutline fontSize="1.1rem" /> : <CircularProgress color="secondary" size={20} />}</IconButton>}</InputAdornment> }} />
                </div>
                <div className='border-b my-5 border-gray-300'></div>

                {/* left side draawer  */}
                <Drawer anchor='left' open={drawerSide} onClose={closeDrawer} className="!hidden md:!flex">
                    <ProfileBigScreen user={user} loading={isLoading} />
                </Drawer>


                {/* display searching div on top of chats div if we are searching  */}

                {searchInput.length > 0 ? <div className='!w-[90%] !mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-purple-50  '>
                    {searchedFinal?.length > 0 && <div className='mb-4'>
                        <h2 className=' mb-5 p-2 font-nunito mr-5 text-purple-700 font-semibold border-b tracking-wide'>Chats ({searchedFinal.length})</h2>
                        {searchedFinal?.map((finalChat) => (
                            <div className='!w-[100%] !mx-auto ' key={finalChat._id} onClick={() => toggleChatAndRemoveUnread(finalChat, user?._id)}>
                                <ChatUsersSideBar chat={finalChat} />
                            </div>
                        ))}
                    </div>}
                    <>
                        <h2 className=' mb-5 p-2 font-nunito mr-5 text-purple-700 font-semibold border-b tracking-wide'>Users ({modifyData(searchedUsers, searchedFinal).length})</h2>
                        {searchedUsers.length > 0 && modifyData(searchedUsers, searchedFinal)?.map((searchedUser) => (
                            <div key={searchedUser._id} className="flex items-center mt-2 mb-2 mr-5 p-2 rounded-xl transition-all cursor-pointer hover:bg-purple-200 bg-gray-50 " onClick={() => accessOrCreateSingleChat(searchedUser._id)} >
                                <Avatar alt='user' src={searchedUser?.avatar} sx={{ marginRight: "1.3rem", width: 50, height: 50 }} />
                                <div className='flex flex-col justify-center'>
                                    <p className='text-left font-nunito tracking-wide '>{searchedUser?.name}</p>
                                    <p className='text-left font-nunito tracking-wide text-sm text-gray-500'>{searchedUser?.email}</p>
                                </div>
                            </div>

                        ))}
                    </>

                </div>
                    :
                    <div className='!w-[90%] !mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-purple-50 my-1 h-full transition-all'>
                        {chats?.length > 0 ? chats?.map((chat) => (
                            <div className='!w-[100%] !mx-auto ' key={chat._id} onClick={() => toggleChatAndRemoveUnread(chat, user?._id)}>
                                <ChatUsersSideBar chat={chat} />
                            </div>
                        )) :
                            <div className='w-full flex flex-col justify-center items-center text-center h-full my-auto'>
                                <img src="/assets/nomessage.svg" alt="no_conversations" className='h-52 w-52 -mt-5' />
                                <p className='font-nunito text-sm my-2 text-center w-[90%] mx-auto tracking-wide text-gray-600'>Uh-oh, You don't have any conversations.</p>
                            </div>
                        }
                    </div>
                }

                {/* jsx for gorup chat modal using dialog mui component  */}
                {groupChatModal &&
                    <Dialog open={groupChatModal} onClose={() => setGroupChatModal(false)} aria-labelledby="dialog-title" fullWidth={true} maxWidth="sm" className='!hidden md:!block' >
                        <DialogTitle id='dialog-title' className='!font-nunito !tracking-wide !font-medium '>Add Group Participants </DialogTitle>

                        <div className='flex items-center justify-center w-[93%] mx-auto'>

                            <TextField color='secondary' autoComplete='off' name='groupName' value={groupName} onChange={(e) => setGroupName(e.target.value)} size="small" sx={{ backgroundColor: "rgb(249 250 251)", marginBottom: "1rem", flexGrow: "1", marginRight: "1rem" }} placeholder="Group Name" />

                            <TextField color='secondary' autoComplete='off' name='search' value={groupSearchInput} onChange={(e) => setGroupSearchInput(e.target.value)} size="small" sx={{ backgroundColor: "rgb(249 250 251)", marginBottom: "1rem", flexGrow: "1" }} placeholder="Search users" InputProps={{ startAdornment: <InputAdornment position='start' ><FiSearch fontSize="1.1rem" /></InputAdornment>, endAdornment: <InputAdornment position='end'>{groupSearchInput.length > 0 && <IconButton color='error' onClick={() => setGroupSearchInput("")}>{!searching ? <IoCloseOutline fontSize="1.1rem" /> : <CircularProgress color="secondary" size={20} />}</IconButton>}</InputAdornment> }} />

                        </div>
                        {/* show round avatar of selected users of group  */}
                        {selectedGroupUsers.length > 0 &&
                            <div className=' flex flex-wrap items-center w-[90%] mx-auto transition-all mt-1  mb-2'>
                                {selectedGroupUsers?.map((guser) => (
                                    <div className='relative flex flex-col items-center mr-3 mb-2 transition-all ' key={guser._id}>
                                        <Avatar alt='guser' src={guser?.avatar} sx={{ width: "53px", height: "53px" }} />
                                        <button className='absolute -top-1 right-0 h-5 w-5 flex justify-center items-center rounded-full bg-red-500' onClick={() => removeFromGroup(guser?._id)}>{<IoCloseOutline fontSize="15px" color="white" />}</button>
                                        <p className='font-nunito text-[11px] text-gray-700 capitalize'>{guser?.name}</p>
                                    </div>
                                ))}
                            </div>
                        }

                        {groupSearchInput.length > 0 && <div className='!w-[90%] !mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-purple-50 !max-h-64 '>
                            <h2 className=' mb-7 p-2 font-nunito mr-5 text-purple-700 font-medium border-b tracking-wide'>Users ({searchedFinal.length})</h2>
                            {searchedUsers.length > 0 && searchedUsers?.map((searchedUser) => (

                                <button key={searchedUser._id} className="flex items-center mt-3 mb-3 mr-5 p-2 rounded-xl transition-all cursor-pointer hover:bg-purple-300 bg-gray-50 w-[96%] disabled:pointer-events-none disabled:bg-green-300 disabled:hover:bg-none" onClick={() => setSelectedGroupUsers([...selectedGroupUsers, searchedUser])} disabled={selectedGroupUsers.find((guser) => guser?._id === searchedUser?._id)}>
                                    <Avatar alt='user' src={searchedUser?.avatar} sx={{ marginRight: "1.3rem", width: 55, height: 55 }} />
                                    <div className='flex flex-col justify-center'>
                                        <p className='text-left font-nunito tracking-wide '>{searchedUser?.name}</p>
                                        <p className='text-left font-nunito tracking-wide text-sm text-gray-500'>{searchedUser?.email}</p>
                                    </div>
                                </button>
                            ))}
                        </div>}
                        <DialogActions sx={{ marginBottom: ".5rem", marginTop: ".5rem" }}>
                            <Button onClick={closegroupModal} color="error" >Cancel</Button>
                            <Button autoFocus onClick={startGroupChat} color="success" disabled={(selectedGroupUsers.length < 2) || (groupName.length === 0)} >Create Group</Button>
                        </DialogActions>

                    </Dialog>
                }
            </div>

            {/* for mobile screen */}
            <div className={`!w-[100%] !flex  md:!hidden !flex-col h-[100vh] mb-auto !transition-all  ${groupChatModal ? "z-[100]" : "z-20"} bg-white  `}>
                <AppBar position='static' color='transparent' sx={{ boxShadow: "none" }}>
                    <Toolbar sx={{ borderBottom: "1px solid rgb(209 213 219)", display: "flex", alignItems: "center", marginTop: "12px", marginBottom: "5px" }}>
                        <BsChatDots fontSize="1.8rem" color='#9900F0' style={{ marginRight: "1rem" }} />
                        <p className='font-nunito  text-gray-600 text-xl font-semibold flex-1 '>Trell</p>
                        {user?.groupNotifications?.length > 0 || chats?.some((chat) => checkForUnreadMessages(chat)) ? <IconButton color="secondary" onClick={() => setViewNotifications(!viewNotifications)}  ><VscBellDot fontSize="1.3rem" color='#9900F0' /></IconButton> :
                            <IconButton onClick={() => setViewNotifications(!viewNotifications)}  ><VscBell fontSize="1.3rem" color='rgb(75 85 99/.8)' /></IconButton>
                        }
                    </Toolbar>
                </AppBar>

                <Drawer anchor='right' open={viewNotifications} onClose={() => setViewNotifications(!viewNotifications)} className="!flex w-[100%] md:!hidden ">
                    <NotificationPopper setViewNotifications={setViewNotifications} viewNotifications={viewNotifications} chats={chats} checkMessage={checkForUnreadMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} singlechatMobileView={singlechatMobileView} setSinglechatMobileView={setSinglechatMobileView} />
                </Drawer>

                <div className='flex items-center w-[90%] mx-auto my-3 transition-all'>
                    <p className='font-nunito flex-1 text-gray-800 font-medium  flex items-center'>Chats <span className='font-nunito text-xs text-white bg-purple-600 !font-bold ml-2 h-5 w-5 p-1 rounded-full flex justify-center items-center text-center'>{chats?.length}</span></p>
                    <IconButton onClick={toogleGroupChatModal}>
                        <AiOutlineUsergroupAdd fontSize="1.4rem" color='green' />
                    </IconButton>
                </div>
                <div className='!w-[90%] !mx-auto  !transition-all '>
                    <TextField color='secondary' autoComplete='off' name='search' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} size="small" sx={{ width: "100%", backgroundColor: "rgb(249 250 251)", fontSize: "10px" }} placeholder="Search or start a new chat" InputProps={{ startAdornment: <InputAdornment position='start' ><FiSearch fontSize="1rem" /></InputAdornment>, endAdornment: <InputAdornment position='end'>{searchInput.length > 0 && <IconButton color='error' onClick={() => setSearchInput("")}>{!searching ? <IoCloseOutline fontSize="1rem" /> : <CircularProgress color="secondary" size={18} />}</IconButton>}</InputAdornment>, style: { fontSize: 14 } }} />
                </div>
                <div className='border-b mb-5 mt-7 border-gray-300'></div>

                {/* left side draawer  */}
                <Drawer anchor='left' open={drawerSide} onClose={closeDrawer} className="!hidden md:!flex">
                    <ProfileBigScreen user={user} loading={isLoading} />
                </Drawer>


                {/* display searching div on top of chats div if we are searching  */}


                {searchInput.length > 0 ? <div className='!w-[90%] !mx-auto overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-purple-50  '>
                    {searchedFinal?.length > 0 && <div className='mb-3'>
                        <h2 className=' mb-4 p-2 font-nunito mr-1 text-purple-700 font-medium border-b text-sm'>Chats ({searchedFinal.length})</h2>
                        {searchedFinal?.map((finalChat) => (
                            <div className='!w-[100%] !mx-auto ' key={finalChat._id} onClick={() => toggleChatAndRemoveUnread(finalChat, user?._id)}>
                                <ChatUsersSideBar chat={finalChat} />
                            </div>
                        ))}
                    </div>}
                    <>
                        <h2 className='mb-4 p-2 font-nunito mr-1 text-purple-700 font-medium border-b text-sm'>Users ({modifyData(searchedUsers, searchedFinal).length})</h2>
                        {searchedUsers.length > 0 && modifyData(searchedUsers, searchedFinal)?.map((searchedUser) => (
                            <div key={searchedUser._id} className="flex items-center mt-2 mb-2 mr-1 p-2 rounded-xl transition-all cursor-pointer hover:bg-purple-200 bg-gray-50 " onClick={() => accessOrCreateSingleChat(searchedUser._id)} >
                                <Avatar alt='user' src={searchedUser?.avatar} sx={{ marginRight: "1.2rem", width: 40, height: 40 }} />
                                <div className='flex flex-col justify-center'>
                                    <p className='text-left font-nunito tracking-wide test-sm '>{searchedUser?.name}</p>
                                    <p className='text-left font-nunito tracking-wide text-xs text-gray-500'>{searchedUser?.email}</p>
                                </div>
                            </div>

                        ))}
                    </>

                </div>
                    :
                    <div className='w-full h-full mb-[10.5vh]  overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-purple-50  transition-all -mt-2'>
                        <div className='!w-[90%] !mx-auto '>
                            {chats?.length > 0 ? chats?.map((chat) => (
                                <div className='!w-[100%] !mx-auto ' key={chat._id} onClick={() => toggleChatAndRemoveUnread(chat, user?._id)}>
                                    <ChatUsersSideBar chat={chat} />
                                </div>
                            )) :
                                <div className='w-full flex flex-col justify-center items-center text-center h-full my-auto'>
                                    <img src="/assets/nomessage.svg" alt="no_conversations" className='h-36 w-h-36 mt-[20%] ' />
                                    <p className='font-nunito text-sm my-5 text-center w-[90%] mx-auto tracking-wide text-gray-800'>Uh-oh, You don't have any conversations.</p>
                                    <p className='font-nunito text-xs -mt-3 text-center w-[90%] mx-auto tracking-wide text-gray-600 font-light'>Search to start chatting with people. Now you can start a group conversation, tap on the group icon above to create a group with your friends.</p>
                                </div>
                            }
                        </div>
                    </div>
                }

                {/* jsx for gorup chat modal using dialog mui component  */}
                {groupChatModal &&
                    <div className='!flex !flex-col md:!hidden w-full h-screen absolute bg-white !transition-all' >
                        <div className='flex items-center my-6 w-[93%] mx-auto '>
                            <IconButton size='medium'  color='secondary' onClick={closegroupModal}>
                                <ArrowBackIosIcon fontSize='1rem' color='secondary' />
                            </IconButton>
                            <h1 className='!font-nunito !tracking-wide !font-semibold ml-5 flex-1'>Add Group Participants </h1>
                            <Button autoFocus onClick={startGroupChatMobile} color="success" disabled={(selectedGroupUsers.length < 2) || (groupName.length === 0)} variant="outlined" size='small' className='!capitalize !font-nunito'>Create Group</Button>
                        </div>
                        <div className='border-t border-gray-400 mb-7'></div>
                        <div className='flex flex-col  w-[92%] mx-auto'>

                            <TextField color='secondary' autoComplete='off' name='groupName' value={groupName} onChange={(e) => setGroupName(e.target.value)} size="small" sx={{ backgroundColor: "rgb(249 250 251)", marginBottom: "1rem", flexGrow: "1" }} placeholder="Group Name" InputProps={{ style: { fontSize: 14 } }} />

                            <TextField color='secondary' autoComplete='off' name='search' value={groupSearchInput} onChange={(e) => setGroupSearchInput(e.target.value)} size="small" sx={{ backgroundColor: "rgb(249 250 251)", marginBottom: "1rem", flexGrow: "1" }} placeholder="Search users" InputProps={{ startAdornment: <InputAdornment position='start' ><FiSearch fontSize="1rem" /></InputAdornment>, endAdornment: <InputAdornment position='end' >{groupSearchInput.length > 0 && <IconButton color='error' onClick={() => setGroupSearchInput("")}>{!searching ? <IoCloseOutline fontSize="1rem" /> : <CircularProgress color="secondary" size={15} />}</IconButton>}</InputAdornment>, style: { fontSize: 14 } }} />

                        </div>
                        {/* show round avatar of selected users of group  */}
                        {selectedGroupUsers.length > 0 &&
                            <div className=' flex flex-wrap items-center w-[90%] mx-auto transition-all mt-2  mb-2'>
                                {selectedGroupUsers?.map((guser) => (
                                    <div className='relative flex flex-col items-center mr-4 mb-2 transition-all ' key={guser._id}>
                                        <Avatar alt='guser' src={guser?.avatar} sx={{ width: "43px", height: "43px" }} />
                                        <button className='absolute -top-1 right-0 h-4 w-4 flex justify-center items-center rounded-full bg-red-500' onClick={() => removeFromGroup(guser?._id)}>{<IoCloseOutline fontSize="13px" color="white" />}</button>
                                        <p className='font-nunito text-[11px] text-gray-700 capitalize'>{guser?.name}</p>
                                    </div>
                                ))}
                            </div>
                        }

                        {groupSearchInput.length > 0 && <div className='!w-[92%] !mx-auto overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-purple-50 !max-h-72 '>
                            <h2 className=' mb-7 p-2 font-nunito mr-5 text-purple-700 font-semibold text-sm border-b tracking-wide'>Users ({searchedUsers.length})</h2>
                            {searchedUsers.length > 0 && searchedUsers?.map((searchedUser) => (

                                <button key={searchedUser._id} className="flex items-center mt-2 mb-2 mr-5 p-2 rounded-xl transition-all cursor-pointer hover:bg-purple-200 bg-gray-50 w-[96%] disabled:pointer-events-none disabled:bg-lime-200 disabled:hover:bg-none" onClick={() => setSelectedGroupUsers([...selectedGroupUsers, searchedUser])} disabled={selectedGroupUsers.find((guser) => guser?._id === searchedUser?._id)}>
                                    <Avatar alt='user' src={searchedUser?.avatar} sx={{ marginRight: "1.3rem", width: 45, height: 45 }} />
                                    <div className='flex flex-col justify-center'>
                                        <p className='text-left font-nunito tracking-wide text-sm'>{searchedUser?.name}</p>
                                        <p className='text-left font-nunito tracking-wide text-xs text-gray-500'>{searchedUser?.email}</p>
                                    </div>
                                </button>
                            ))}
                        </div>}

                        {groupSearchInput.length === 0 && selectedGroupUsers.length === 0 && <div className='flex justify-center items-center w-full h-full'>
                            <img src="/assets/groupadd.svg" alt="addgroup" height={250} width={250} />
                        </div>}

                    </div>
                }
            </div>
        </>
    )
}

export default SideBarBig;
