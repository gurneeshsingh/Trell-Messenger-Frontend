import React from 'react'
import Avatar from '@mui/material/Avatar';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { format, differenceInCalendarDays } from "date-fns";
import { getSender } from "../utils/chatLogic";


const ChatUsersSideBar = ({ chat }) => {


    const { user } = useSelector((state) => state.user);
    const { activeChat } = useSelector((state) => state.chat);
    const [updatedTime, setupdatedTime] = useState("");



    function getCorrectTime(date) {
        const updateddate = new Date(date)
        const currentDate = new Date()
        const updatedTime = format(new Date(date), 'h:mm a')
        const currentTime = format(new Date(), 'h:mm a')
        const dayDifference = differenceInCalendarDays(currentDate, updateddate)
        setupdatedTime(updatedTime)

        if (updatedTime === currentTime) {
            setupdatedTime(updatedTime)
        }
        if ((dayDifference > 0) && (dayDifference < 2)) {
            setupdatedTime('yesterday')
        }
        if (dayDifference >= 2) {
            setupdatedTime(format(new Date(updateddate), 'dd/MM/yy'))
        }
    }

    useEffect(() => {
        getCorrectTime(chat?.updatedAt)
    }, [chat?.updatedAt])

    useEffect(() => {
        user?.groupNotifications?.filter((gn) => gn?.chat?._id === chat?._id || gn?.chat === chat?._id)
    }, [chat, user?.groupNotifications])


    return (
        <>
            {/* desktop screen  */}
            <div className={`w-[95%] !hidden md:!flex items-center mt-2 mb-1  mr-5 cursor-pointer  p-2 rounded-xl transition-all hover:bg-purple-200  bg-gray-50 ${activeChat?._id === chat?._id ? "border-[1.5px] border-purple-600 hover:bg-purple-100 bg-purple-100" : ""}`}>
                {/* left avatar div  */}
                {<Avatar alt='user' src={chat?.isGroupChat ? chat?.groupImage : getSender(user, chat?.users)?.avatar} sx={{ marginRight: "1.3rem", width: 50, height: 50 }} />}
                <div className=' flex flex-col justify-center  flex-1'>
                    {<div className='flex items-center mb-1'>
                        <p className=' font-nunito font-bold capitalize flex-1'>{chat?.isGroupChat ? chat?.groupName : getSender(user, chat?.users).name}</p>
                        {/* unread message count for single chats */}
                        {(!chat?.isGroupChat && chat?.unreadMessages?.filter((unread) => unread?.sender?._id !== user?._id).length > 0) && <span className='font-nunito text-[11px] text-white bg-green-600 !font-bold mr-2 h-[20px] w-[20px] shadow-sm rounded-full flex justify-center items-center text-center'>{chat?.unreadMessages?.filter((unread) => unread?.sender?._id !== user?._id).length}</span>}
                        {/* unread message count for group chat  */}
                        {(chat?.isGroupChat && user?.groupNotifications?.filter((gn) => gn?.chat?._id === chat?._id || gn?.chat === chat?._id)?.length > 0) && <span className='font-nunito text-[11px] text-white bg-green-600 !font-bold mr-2 h-[20px] w-[20px] shadow-sm rounded-full flex justify-center items-center text-center'>{user?.groupNotifications?.filter((gn) => gn?.chat?._id === chat?._id || gn?.chat === chat?._id)?.length}</span>}


                    </div>}
                    {<div className='flex items-center'>
                        {!chat.latestMessage ? <p className='flex-1 font-nunito text-sm text-gray-500 tracking-wide'>You can now start a conversation...</p> :
                            !chat?.isGroupChat ? <p className='flex-1 font-nunito text-sm text-gray-500 tracking-wide'> {chat?.latestMessage?.content.length <= 30 ? chat?.latestMessage?.content : `${chat?.latestMessage?.content.slice(0, 30)} ...`}</p> :
                                <div className='flex-1 font-nunito text-sm text-gray-500 tracking-wide flex items-center'>
                                    <span className='!font-semibold text-gray-700 capitalize mr-1'>{chat?.latestMessage?.sender?.name}: </span>
                                    <p>  {chat?.latestMessage?.content.length <= 21 ? chat?.latestMessage?.content : `${chat?.latestMessage?.content.slice(0, 21)} ...`}</p>
                                </div>}
                        <p className='text-[10px] font-nunito text-green-600 font-semibold'>{updatedTime}</p>
                    </div>}
                </div>
            </div>

            {/* mobile screen  */}

            <div className={`w-[100%] md:!hidden !flex items-center mt-2 mb-1  cursor-pointer  px-2 py-3 rounded-xl transition-all hover:bg-purple-200  bg-gray-50 ${activeChat?._id === chat?._id ? "border-[1.5px] border-purple-600 hover:bg-purple-100 bg-purple-100" : ""}`}>
                {/* left avatar div  */}
                {<Avatar alt='user' src={chat?.isGroupChat ? chat?.groupImage : getSender(user, chat?.users)?.avatar} sx={{ marginRight: "1.2rem", width: 40, height: 40, marginLeft:".5rem" }} />}
                <div className=' flex flex-col justify-center  flex-1'>
                    {<div className='flex items-center mb-1'>
                        <p className=' font-nunito font-bold capitalize flex-1 text-sm'>{chat?.isGroupChat ? chat?.groupName : getSender(user, chat?.users).name}</p>
                        {/* unread message count for single chats */}
                        {(!chat?.isGroupChat && chat?.unreadMessages?.filter((unread) => unread?.sender?._id !== user?._id).length > 0) && <span className='font-nunito text-[10px] text-white bg-green-600 !font-bold mr-2 h-[18px] w-[18px] shadow-sm rounded-full flex justify-center items-center text-center'>{chat?.unreadMessages?.filter((unread) => unread?.sender?._id !== user?._id).length}</span>}
                        {/* unread message count for group chat  */}
                        {(chat?.isGroupChat && user?.groupNotifications?.filter((gn) => gn?.chat?._id === chat?._id || gn?.chat === chat?._id)?.length > 0) && <span className='font-nunito text-[10px] text-white bg-green-600 !font-bold mr-2 h-[18px] w-[18px] shadow-sm rounded-full flex justify-center items-center text-center'>{user?.groupNotifications?.filter((gn) => gn?.chat?._id === chat?._id || gn?.chat === chat?._id)?.length}</span>}

                    </div>}
                    {<div className='flex items-center'>
                        {!chat.latestMessage ? <p className='flex-1 font-nunito text-xs text-gray-500 tracking-wide'>You can now start a conversation...</p> :
                            !chat?.isGroupChat ? <p className='flex-1 font-nunito text-xs text-gray-500 tracking-wide'> {chat?.latestMessage?.content.length <= 30 ? chat?.latestMessage?.content : `${chat?.latestMessage?.content.slice(0, 30)} ...`}</p> :
                                <div className='flex-1 font-nunito text-sm text-gray-500 tracking-wide flex items-center'>
                                    <span className='!font-semibold text-gray-700 capitalize mr-1'>{chat?.latestMessage?.sender?.name}: </span>
                                    <p>  {chat?.latestMessage?.content.length <= 18 ? chat?.latestMessage?.content : `${chat?.latestMessage?.content.slice(0, 18)} ...`}</p>
                                </div>}
                        <p className='text-[9px] font-nunito text-green-600 font-semibold'>{updatedTime}</p>
                    </div>}
                </div>
            </div>


        </>
    )
}

export default ChatUsersSideBar