import React, { useState, useRef } from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { format, differenceInCalendarDays } from "date-fns"
import { useSelector } from 'react-redux'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Avatar, IconButton } from '@mui/material'
import Lottie from "lottie-react";
import animationData from "../animations/typing.json";
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';



const ScrollChatBox = ({ messages, activechat, typing }) => {


    const { user } = useSelector((state) => state.user);
    const scrollRef = useRef(null);
    const scrollRef2 = useRef(null);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [isAtBottom2, setIsAtBottom2] = useState(true);

    function scrollToBottom() {
        scrollRef.current.scrollToBottom()
    }
    function scrollToBottom2() {
        scrollRef2.current.scrollToBottom()
    }


    function getDateAndTime(date) {
        const currentDate = new Date()
        const messageDate = new Date(date)
        const messageTime = format(new Date(date), 'h:mm a');
        const dayDifference = differenceInCalendarDays(currentDate, messageDate);
        if (dayDifference <= 0) {
            return `today, ${messageTime}`

        }
        if (dayDifference > 0 && dayDifference < 2) {
            return `yesterday, ${format(new Date(messageDate), 'h:mm a')}`

        }
        if (dayDifference >= 2) {
            return format(new Date(messageDate), `MMMM d, yyyy h:mm a`)

        }
    };



    return (
        <>
            {/* for desktop screen  */}
            <ScrollableFeed className='hidden md:!flex md:flex-col !h-full !w-full !scrollbar-none !transition-all !mt-3' ref={scrollRef} onScroll={(isAtBottom) => setIsAtBottom(isAtBottom)} >

                {/* // scroll to bottom button  */}
                {!isAtBottom && <div className='absolute bottom-5 right-10 z-[100] bg-gray-100 shadow-md transition-all rounded-full'>
                    <IconButton color='secondary' onClick={scrollToBottom}><KeyboardDoubleArrowDownIcon /></IconButton>
                </div>
                }

                {messages?.length === 0 && <div className='flex flex-col justify-center items-center text-center h-60 w-60 mx-auto  rounded-xl bg-gray-300 bg-opacity-40 shadow-md mt-12'>
                    <img src="/assets/robot.gif" alt="hif" className='-mt-6' />
                    <p className='font-nunito text-sm -mt-10 text-center w-[80%] mx-auto text-purple-700 font-medium '>Start typing below to send a message.</p>
                </div>}

                {/* status updates of the group  */}
                {activechat?.groupUpdates.length > 0 && <Accordion sx={{
                    backgroundColor: "whitesmoke", boxShadow: "none", marginBottom: "15px", borderRadius: "10px ", marginTop: "5px", '&:before': {
                        display: 'none',
                    }
                }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />} aria-controls="pannel" id='pannel-header' >
                        <p className='!font-nunito  !font-semibold !my-0 capitalize'>Group updates</p>
                    </AccordionSummary>
                    <AccordionDetails sx={{ display: "flex", flexWrap: "wrap", marginTop: "-15px" }}>
                        {activechat?.isGroupChat && activechat?.groupUpdates?.map((update, index) => (
                            <div className='flex flex-col justify-center items-center text-center w-[38%] max-w-fit mx-1  mt-2 mb-1 px-3 py-[10px] bg-yellow-400 bg-opacity-40 rounded-2xl shadow-sm z-50 ' key={index}>
                                <p className=' font-nunito text-[10px] font-medium text-gray-800 mb-1'>{format(new Date(update?.updateTime), `MMMM d, yy h:mm a`)}</p>
                                <p className=' font-nunito text-xs font-semibold text-black first-letter:capitalize '>{`${update?.updateMessage}`}</p>
                            </div>
                        ))}
                    </AccordionDetails>
                </Accordion>}


                {messages.length > 0 && messages?.map((message, index) => (
                    <div key={message._id} className={`flex flex-col z-40  opacity-100 transition-all justify-center ${user?._id === message?.sender._id ? "items-end" : "items-start"} ${messages[index]?.sender._id === messages[index + 1]?.sender._id ? "my-[2px]" : "mt-[3px] mb-8"} ${messages[index + 1]?.sender._id === message?.sender?._id && messages[index]?.sender._id !== user?._id && !message?.chat?.isGroupChat ? "ml-9" : ""} `}>

                        {message?.chat?.isGroupChat ? <div className={`${user?._id === message?.sender._id ? ' bg-purple-100 rounded-br-none text-purple-900' : ' bg-green-100 rounded-bl-none text-lime-800'} tracking-wide pt-[10px] pb-[5px] px-4 w-[30rem] max-w-fit rounded-2xl font-bold  text-[14px] font-nunito shadow-sm `}>
                            <span className='flex items-center -ml-[5px] -mt-[2px] mb-1' >
                                <Avatar alt='image' src={message?.sender?.avatar} sx={{ height: "1.8rem", width: "1.8rem", marginRight: "5px" }} />
                                <p className='!capitalize font-bold text-gray-900 text-sm'>{message?.sender?.name}</p>
                            </span>
                            {message?.content} <span className={`text-[10px] ${user?._id === message?.sender._id ? "text-right" : "text-left"} text-black block font-semibold tracking-tight `}>{getDateAndTime(message?.createdAt)}</span>
                        </div> :
                            <div className={`flex items-center `}>
                                {(message?.sender?._id !== user?._id && (messages[index + 1]?.sender._id !== message?.sender?._id || messages[index + 1]?.sender._id === undefined)) && <Avatar alt='image' src={message?.sender?.avatar} sx={{ height: "1.8rem", width: "1.8rem", marginRight: "5px" }} />}
                                <div className={`${user?._id === message?.sender._id ? ' bg-purple-100 rounded-br-none text-purple-900' : ' bg-green-100 rounded-bl-none text-lime-800'} tracking-wide pt-[10px] pb-[5px] px-4  max-w-[30rem] rounded-2xl font-bold text-[14px] font-nunito shadow-sm `}>
                                    {message?.content} <span className={`text-[10px] ${user?._id === message?.sender._id ? "text-right" : "text-left"} text-black block font-semibold tracking-tight `}>{getDateAndTime(message?.createdAt)}</span>
                                </div>

                            </div>
                        }

                    </div>

                ))}
                {(typing && !activechat?.isGroupChat) && <div className='!w-20 !h-28'>
                    <Lottie style={{ marginBottom: 5, height: "100%", width: "100%" }} loop={true} autoPlay={true} animationData={animationData} rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }} />
                </div>
                }

            </ScrollableFeed>

            {/* for mobile screen  */}
            <ScrollableFeed className='md:!hidden  !h-full !w-full !scrollbar-none !transition-all !mt-1' ref={scrollRef2} onScroll={(isAtBottom2) => setIsAtBottom2(isAtBottom2)} >

                {/* // scroll to bottom button  */}
                {!isAtBottom2 && <div className='absolute bottom-5 right-10 z-[100] bg-gray-100 shadow-md transition-all rounded-full'>
                    <IconButton color='secondary' size="medium" onClick={scrollToBottom2}><KeyboardDoubleArrowDownIcon fontSize='1.2rem' /></IconButton>
                </div>
                }

                {messages.length === 0 && <div className='flex flex-col justify-center items-center text-center h-48 w-48 mx-auto  rounded-xl bg-gray-300 bg-opacity-40 shadow-md mt-20'>
                    <img src="/assets/robot.gif" alt="hif" className='-mt-6' />
                    <p className='font-nunito text-xs -mt-10 text-center w-[80%] mx-auto text-purple-700 font-medium '>Start typing below to send a message.</p>
                </div>}

                {messages.length > 0 && messages?.map((message, index) => (
                    <div key={message._id} className={`flex flex-col z-40  opacity-100 transition-all justify-center ${user?._id === message?.sender._id ? "items-end" : "items-start"} ${messages[index]?.sender._id === messages[index + 1]?.sender._id ? "my-[4px]" : "mt-[3px] mb-8"} ${messages[index + 1]?.sender._id === message?.sender?._id && messages[index]?.sender._id !== user?._id && !message?.chat?.isGroupChat ? "ml-9" : ""} `}>

                        {message?.chat?.isGroupChat ? <div className={`${user?._id === message?.sender._id ? ' bg-purple-100 rounded-br-none text-purple-900' : ' bg-green-100 rounded-bl-none text-lime-800'} tracking-wide pt-[10px] pb-[5px] px-4 w-80 max-w-fit rounded-2xl font-bold  text-[12px] font-nunito shadow-sm `}>
                            <span className='flex items-center -ml-[5px] -mt-[2px] mb-1' >
                                <Avatar alt='image' src={message?.sender?.avatar} sx={{ height: "1.5rem", width: "1.5rem", marginRight: "5px" }} />
                                <p className='!capitalize font-bold text-gray-900 text-[12px]'>{message?.sender?.name}</p>
                            </span>
                            {message?.content} <span className={`text-[9px] ${user?._id === message?.sender._id ? "text-right" : "text-left"} text-black block font-semibold tracking-tight `}>{getDateAndTime(message?.createdAt)}</span>
                        </div> :
                            <div className={`flex items-center  `}>
                                {(message?.sender?._id !== user?._id && (messages[index + 1]?.sender._id !== message?.sender?._id || messages[index + 1]?.sender._id === undefined)) && <Avatar alt='image' src={message?.sender?.avatar} sx={{ height: "1.3rem", width: "1.3rem", marginRight: "5px" }} />}
                                <div className={`${user?._id === message?.sender._id ? ' bg-purple-100 rounded-br-none text-purple-900' : ' bg-green-100 rounded-bl-none text-lime-800'} tracking-wide pt-[10px] pb-[5px] px-4  w-80 max-w-max rounded-2xl font-bold text-[12px] font-nunito shadow-sm `}>
                                    {message?.content} <span className={`text-[9px] ${user?._id === message?.sender._id ? "text-right" : "text-left"} text-black block font-semibold tracking-tight `}>{getDateAndTime(message?.createdAt)}</span>
                                </div>

                            </div>
                        }

                    </div>

                ))}
                {(typing && !activechat?.isGroupChat) && <div className='w-20 h-20 md:!w-20 md:!h-28'>
                    <Lottie style={{ marginBottom: 5, height: "100%", width: "100%" }} loop={true} autoPlay={true} animationData={animationData} rendererSettings={{ preserveAspectRatio: "xMidYMid slice" }} />
                </div>
                }

            </ScrollableFeed>
        </>
    )
}

export default ScrollChatBox