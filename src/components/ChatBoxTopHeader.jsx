import React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import { useSelector, useDispatch } from 'react-redux';
import { BsInfoCircle } from "react-icons/bs"
import { IconButton } from "@mui/material"
import { Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from "@mui/material"
import { AiOutlineDelete } from "react-icons/ai"
import { useState } from "react";
import { Button } from '@mui/material';
import { getSender } from '../utils/chatLogic';
import GroupChatInfoModal from "../components/GroupChatInfoModal";
import SingleChatInfoModal from './SingleChatInfoModal';
import Drawer from '@mui/material/Drawer';
import { deleteFromList } from '../redux/features/chatSlice';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';




const ChatBoxTopHeader = ({ activeChat, fetchMessages, fetchAgain, setFetchAgain, singlechatMobileView, setSinglechatMobileView }) => {

    const { user } = useSelector((state) => state.user)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showChatInfo, setShowChatInfo] = useState(false);
    const [showSingleChatDrawer, setShowSingleChatDrawer] = useState(false)
    const dispatch = useDispatch()


    function closeDrawer() {
        setShowSingleChatDrawer(!showSingleChatDrawer)
    }
    function closeDrawer2() {
        setShowChatInfo(!showChatInfo)
    }

    function deleteChatFromList() {
        dispatch(deleteFromList())
        setFetchAgain(!fetchAgain)
        setShowDeleteDialog(!showDeleteDialog)
    };

    const isLoggedUserInGroup = activeChat?.users?.find((auser) => auser._id === user?._id) ? true : false;

    function goBackToChats() {
        setSinglechatMobileView(!singlechatMobileView)
        dispatch(deleteFromList())
    };
    function deleteAndGoBackToChats() {
        setSinglechatMobileView(!singlechatMobileView)
        dispatch(deleteFromList())
        setFetchAgain(!fetchAgain)

    };

    return (
        // for desktop screen 
        <>
            <div className='hidden md:!flex  w-full'>
                <AppBar position='static' color='transparent' sx={{ boxShadow: "none", width: "100%" }}>
                    <Toolbar sx={{ borderBottom: "1px solid rgb(209 213 219)", display: "flex", alignItems: "center", marginTop: "10px" }}>
                        {!activeChat ? <Skeleton variant="circular" width={40} height={40} /> : <Avatar alt='chat_user' src={activeChat?.isGroupChat ? activeChat?.groupImage : getSender(user, activeChat?.users).avatar} sx={{ height: "3rem", width: "3rem" }} />}
                        {!activeChat ? <Skeleton variant='text' /> :
                            <div className='flex flex-col flex-1'>
                                <p className=' font-nunito font-semibold text-center tracking-wide capitalize'>{activeChat?.isGroupChat ? activeChat?.groupName : getSender(user, activeChat?.users).name}</p>
                                <p className=' font-nunito text-sm text-center text-gray-500 flex items-center justify-center '>{activeChat?.isGroupChat ? <span>Group - {activeChat?.users.length} {activeChat?.users.length > 1 ? "participants" : "participant"}</span> : getSender(user, activeChat?.users).email}</p>
                            </div>}
                        <IconButton color='success' sx={{ marginRight: "3px" }} onClick={activeChat?.isGroupChat ? () => setShowChatInfo(!showChatInfo) : () => setShowSingleChatDrawer(!showSingleChatDrawer)} disabled={activeChat?.isGroupChat && !isLoggedUserInGroup} >
                            <BsInfoCircle fontSize="1.2rem" />
                        </IconButton>
                        <IconButton color='error' onClick={() => setShowDeleteDialog(true)} disabled={activeChat?.isGroupChat && isLoggedUserInGroup} >
                            <AiOutlineDelete fontSize="1.2rem" />
                        </IconButton>

                        {/* delete dialog box  */}
                        {showDeleteDialog &&
                            <Dialog aria-labelledby='dialog-title' aria-describedby='dialog-description' open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
                                <DialogTitle id='dialog-title'>Delete conversation ?</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id='dialog-description' >Are you sure you want to delete this conversation ? This will delete all the messages as well.</DialogContentText>
                                </DialogContent>
                                <DialogActions sx={{ marginRight: "12px" }}>
                                    {!activeChat?.isGroupChat && <Button onClick={() => setShowDeleteDialog(false)} >Cancel</Button>}
                                    <Button autoFocus onClick={deleteChatFromList} color="error" >Delete</Button>
                                </DialogActions>

                            </Dialog>}
                        {(showChatInfo && activeChat?.isGroupChat) && <GroupChatInfoModal toggleShow={setShowChatInfo} show={showChatInfo} fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} showChatInfo={showChatInfo} setShowChatInfo={setShowChatInfo} />}

                        {/* side drawer  */}
                        <Drawer anchor='right' open={showSingleChatDrawer} onClose={closeDrawer} className="!hidden md:!flex" >
                            <SingleChatInfoModal chat={activeChat} />
                        </Drawer>

                    </Toolbar>
                </AppBar>
            </div>

            {/* // for mobile screen */}
            <div className='flex md:!hidden w-full !z-[100] bg-white'>
                <AppBar position='static' color='inherit' sx={{ boxShadow: "none", width: "100%" }}>
                    <Toolbar sx={{ borderBottom: "1px solid rgb(209 213 219)", display: "flex", alignItems: "center", marginTop: "15px", paddingBottom: "10px" }}>
                        <IconButton size='medium' color='secondary' sx={{ marginRight: "14px" }} onClick={goBackToChats}>
                            <ArrowBackIosIcon fontSize='1rem' color='secondary' />
                        </IconButton>
                        {!activeChat ? <Skeleton variant="circular" width={34} height={34} /> : <Avatar alt='chat_user' src={activeChat?.isGroupChat ? activeChat?.groupImage : getSender(user, activeChat?.users).avatar} sx={{ height: "2.6rem", width: "2.6rem" }} />}
                        {!activeChat ? <Skeleton variant='text' /> :
                            <div className='flex flex-col flex-1 ml-5 '>
                                <p className=' font-nunito font-semibold text-[15px] tracking-wide capitalize'>{activeChat?.isGroupChat ? activeChat?.groupName : getSender(user, activeChat?.users).name}</p>
                                <p className=' font-nunito text-xs  text-gray-500 flex items-center  '>{activeChat?.isGroupChat ? <span>Group - {activeChat?.users.length} {activeChat?.users.length > 1 ? "participants" : "participant"}</span> : getSender(user, activeChat?.users).email}</p>
                            </div>}
                        <IconButton color='success' sx={{ marginRight: "3px" }} onClick={activeChat?.isGroupChat ? () => setShowChatInfo(!showChatInfo) : () => setShowSingleChatDrawer(!showSingleChatDrawer)} disabled={activeChat?.isGroupChat && !isLoggedUserInGroup} >
                            <BsInfoCircle fontSize="1rem" />
                        </IconButton>
                        <IconButton color='error' onClick={deleteAndGoBackToChats} disabled={activeChat?.isGroupChat && isLoggedUserInGroup} >
                            <AiOutlineDelete fontSize="1rem" />
                        </IconButton>

                        {/* side drawer  */}
                        <Drawer anchor='right' open={showSingleChatDrawer} onClose={closeDrawer} className="!flex" >
                            <SingleChatInfoModal chat={activeChat} showSingleChatDrawer={showSingleChatDrawer} setShowSingleChatDrawer={setShowSingleChatDrawer} />
                        </Drawer>
                        <Drawer anchor='right' open={showChatInfo} onClose={closeDrawer2} className="!flex" >
                            <GroupChatInfoModal chat={activeChat} showChatInfo={showChatInfo} setShowChatInfo={setShowChatInfo} toggleShow={setShowChatInfo} show={showChatInfo} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages} goBackToChats={goBackToChats} />
                        </Drawer>

                    </Toolbar>
                </AppBar>
            </div>
        </>
    )
}

export default ChatBoxTopHeader