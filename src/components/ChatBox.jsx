import React, { useState, useEffect } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import SendIcon from '@mui/icons-material/Send';
import { IconButton } from '@mui/material';
import axios from "axios";
import { sendMessageRoute } from '../utils/apiRoutes';
import { Alert } from '@mui/material';
import ScrollChatBox from './ScrollChatBox';
import Picker from 'emoji-picker-react';
import { useSelector } from 'react-redux';
import { ImSad2 } from "react-icons/im"
import { socket } from "../App";
import { activeChatCompare } from '../pages/Chats';



const ChatBox = ({ token, activechat, fetchMessages, allMessages, loading, errorMessage, setError, setMessages, socketConnected, setFetchAgain, fetchAgain }) => {


    const [message, setMessage] = useState("")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { user } = useSelector((state) => state.user);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [increaseHeight, setIncreaseheight] = useState(false);



    useEffect(() => {
        fetchMessages()
        // make a copy of activechat object into this variable to check weather to send notification or message 
    }, [activechat]);


    useEffect(() => {
        socket.on('typing on', (chatId) => {
            if (activeChatCompare?._id === chatId) {
                setIsTyping(true)
            }
        });
        socket.on('typing done', () => {
            setIsTyping(false)
        })
    }, []);

    function checkHeight() {
        if (window.innerHeight < 450) {
            setIncreaseheight(true)
        } else {
            setIncreaseheight(false)
        }
    };

    useEffect(() => {
        window.addEventListener('resize', checkHeight)

        return () => window.removeEventListener('resize', checkHeight)
    }, [])


    const callApiToSendMessage = async () => {
        setMessage("")
        try {
            const response = await axios.post(sendMessageRoute, { content: message, chatId: activechat?._id }, {
                headers: {
                    authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            const data = await response.data;
            // use send message socket here 
            socket.emit('send message', data?.message)
            // if we get data back we append it to all messages array 
            setMessages([...allMessages, data?.message])
            setFetchAgain(!fetchAgain)

        } catch (error) {
            setError(error.message)
        }
    };


    function typingHandler(e) {
        setMessage(e.target.value)
        // check if socket is connected or not
        if (!socketConnected) return;
        //manually change our typing state
        if (!typing) {
            setTyping(true);
            socket.emit('typing', activechat?._id)
        }
        // craete a function that takes the time difference to shwo the typing indicator
        let typingStartTime = new Date().getTime();
        let timeToStop = 3000;
        setTimeout(() => {
            let currentTime = new Date().getTime();
            let timeDifference = currentTime - typingStartTime;
            if (timeDifference >= timeToStop && !typing) {
                // emit stop typing socket
                socket.emit('stop typing', activechat?._id)
                // manually change our typing state
                setTyping(false)
            }
        }, timeToStop);
    };

    function sendMessage(event) {
        if (event.key === "Enter" && message.length > 0) {
            // listin to stop typing socket here 
            socket.emit('stop typing', activechat?._id)
            callApiToSendMessage()
            setShowEmojiPicker(false)
        }
    }

    function sendMessageOnClick() {
        // listin to stop typing  socket
        socket.emit('stop typing', activechat?._id)
        callApiToSendMessage()
        setShowEmojiPicker(false)

    };

    function addEmojiToText(event, emojiObject) {
        let msg = message;
        msg += emojiObject.emoji
        setMessage(msg)

    };



    return (
        // for desktop screen 
        <>
            <>
                <div className='hidden md:!flex md:flex-col md:h-[77%]  w-full mx-auto md:overflow-y-auto md:absolute md:top-[4.5rem] z-30 px-[18px] transition-all  scrollbar-none  '>
                    {loading ?
                        <div className='w-full h-full flex justify-center items-center transition-all '>
                            <CircularProgress color='secondary' size={35} />
                            {errorMessage && !loading && <Alert severity='error' variant='filled' onClose={() => setError("")}>{errorMessage}</Alert>}
                        </div> :
                        <ScrollChatBox messages={allMessages} activechat={activechat} typing={isTyping} />

                    }

                    {showEmojiPicker && <div className='!shadow-lg !z-50'> <Picker disableSearchBar pickerStyle={{ position: "absolute", bottom: 2, height: "12rem", border: "1.5px solid #7E22CE" }} disableAutoFocus onEmojiClick={addEmojiToText} /></div>}
                </div>
                {/* message sending textfield  */}
                {activechat?.users?.find((auser) => auser._id === user?._id) ? <div className='hidden w-full h-[11%] mx-auto  bg-white p-2 drop-shadow-md border-t-[1.5px]  border-purple-700  absolute bottom-0 z-30 md:flex items-center'>
                    <IconButton sx={{ marginRight: "12px" }} onClick={() => setShowEmojiPicker(!showEmojiPicker)} ><EmojiEmotionsIcon color='success' /></IconButton>
                    <input id='message' autoComplete='off' name='message' value={message} placeholder="Message.." onChange={typingHandler} className="py-2 px-3 w-[80%]  outline-none border border-slate-300 flex-1 " onKeyDown={sendMessage} />
                    <IconButton sx={{ marginLeft: "14px", marginRight: "5px" }} size="large" onClick={sendMessageOnClick} disabled={message?.length === 0} ><SendIcon color={message?.length === 0 ? 'disabled' : 'secondary'} /></IconButton>
                </div> : <div className='w-full h-[11%] mx-auto  bg-yellow-200  p-2 drop-shadow-md absolute bottom-0 z-50 flex items-center '>
                    <p className='hidden font-nunito !font-semibold text-center mx-auto !text-gray-900 md:!flex items-center tracking-wide'><ImSad2 fontSize="1.4rem" className='mr-3' /> You are no longer a part of this conversation.</p>
                </div>}

            </>
            {/* for mobile screen  */}
            <>
                <div className='md:!hidden flex flex-col h-[81.6vh]  w-full mx-auto overflow-y-auto absolute top-[10.4vh] z-30 px-[13px] transition-all  scrollbar-none '>
                    {loading ?
                        <div className='w-full h-full flex justify-center items-center transition-all '>
                            <CircularProgress color='secondary' size={30} />
                            {errorMessage && !loading && <Alert severity='error' variant='filled' onClose={() => setError("")}>{errorMessage}</Alert>}
                        </div> :
                        <ScrollChatBox messages={allMessages} activechat={activechat} typing={isTyping} />
                    }

                   
                </div>
                {/* message sending textfield  */}
                {activechat?.users?.find((auser) => auser._id === user?._id) ? <div className={`md:hidden w-full  ${increaseHeight ? "[13vh]" : " h-[10vh]"} mx-auto  bg-white p-2 drop-shadow-md border-t-[1.5px]  border-purple-700  absolute bottom-2 z-50 flex items-center`}>
                    
                    <input id='message' autoComplete='off' name='message' value={message} placeholder="Message.." onChange={typingHandler} className="py-2.5 ml-4 px-3 w-[80%] text-sm font-nunito  outline-none border border-slate-300 flex-1 " onKeyDown={sendMessage} />
                    <IconButton sx={{ marginLeft: "14px", marginRight: "5px" }} size="medium" onClick={sendMessageOnClick} disabled={message?.length === 0} ><SendIcon color={message?.length === 0 ? 'disabled' : 'secondary'} fontSize="1.2rem" /></IconButton>
                </div> : <div className='w-full h-[11vh] mx-auto  bg-yellow-400 bg-opacity-50 p-2 drop-shadow-md absolute bottom-0 z-50 flex items-center '>
                    <p className='flex font-nunito !font-semibold text-center mx-auto text-gray-600 md:!hidden items-center text-sm tracking-wide'><ImSad2 fontSize="1.2rem" className='mr-3' /> You are no longer a part of this conversation.</p>
                </div>}

            </>
        </>
    )
}

export default ChatBox;

