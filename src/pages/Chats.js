import React from 'react'
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import BottomNavMobile from '../components/BottomNavMobile';
import ChatBoxTopHeader from '../components/ChatBoxTopHeader';
import EmptyChatBox from '../components/EmptyChatBox';
import SideBarBig from '../components/SideBarBig';
import styles from "../components/ChatBox.module.css"
import { fetchAllChats, addToUnreadMessages } from '../redux/features/chatSlice';
import { getGroupNotifications } from "../redux/features/userSlice";
import ChatBox from '../components/ChatBox';
import { fetchAllMessagesRoute } from '../utils/apiRoutes';
import axios from "axios"
import ProfileMobile from './ProfileMobile';
import SettingsMobile from './SettingsMobile';
import { socket } from '../App';


export let activeChatCompare;
let inChatAudio = new Audio('/assets/inchat.mp3');
let outChatAudio = new Audio('/assets/outchat.mp3');


const Chats = () => {

  const { user } = useSelector((state) => state.user);
  const { chats, activeChat } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem('token'))
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [fetchAgain, setFetchAgain] = useState(false)
  const [singlechatMobileView, setSinglechatMobileView] = useState(false);
  const [navigationValue, setNavigationValue] = useState(1);



  useEffect(() => {
    activeChatCompare = activeChat
  }, [activeChat])



  async function fetchAllMessages() {
    if (!activeChat) return;
    setLoading(true)
    try {
      const response = await axios.get(`${fetchAllMessagesRoute}/${activeChat?._id}`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      const data = await response.data
      setAllMessages(data?.allMessages)
      setLoading(false)
      // emit activechat id to the backend socket when the messages have fetched
      socket.emit('join chat', activeChat?._id)
    } catch (error) {
      setErrorMessage(error.message)
    }
  };


  useEffect(() => {
    dispatch(fetchAllChats())
  }, [fetchAgain])



  useEffect(() => {
    // this will handle continuous recieving the messages from sockets , thats why dependancy array is not present
    // use the recieve message socket here
    socket.on('recieve message', (message) => {
      // check if their is no active chat or if the the ids of active chat and the chat of the message which we have recieved dosent match
      if (activeChatCompare === null || activeChatCompare === undefined || !activeChatCompare || activeChatCompare?._id !== message?.chat?._id) {
        // give notification of new message
        setFetchAgain(!fetchAgain)
      } else {
        // set the messages array  with message recieved 
        setAllMessages([...allMessages, message])
        setFetchAgain(!fetchAgain)
        inChatAudio.play()
      }
    })
  });

  useEffect(() => {
    socket.on('recieve notification', (message) => {
      if (activeChatCompare === null || activeChatCompare === undefined || !activeChatCompare || activeChatCompare?._id !== message?.chat?._id) {
        dispatch(addToUnreadMessages({ chat: message?.chat, message }))
        if (message?.chat?.isGroupChat) {
          dispatch(getGroupNotifications())
        } else {
          setFetchAgain(!fetchAgain)
        }
        outChatAudio.play()
      }
    })
  })

  if (navigationValue === 0) {
    return <ProfileMobile navigationValue={ navigationValue} setNavigationValue={setNavigationValue} />
  }
  if (navigationValue === 2) {
    return <SettingsMobile navigationValue={ navigationValue} setNavigationValue={setNavigationValue} />
  }


  return (
    <>
      {/* for desktop screen  */}
      <div className='hidden h-screen w-full md:flex items-center'>
        <SideBarBig chats={chats} setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} singlechatMobileView={singlechatMobileView} setSinglechatMobileView={setSinglechatMobileView} />
        {(activeChat === undefined) ? <EmptyChatBox /> :
          <div className='relative flex flex-col items-center h-full w-[65%] mx-auto overflow-hidden'>
            <ChatBoxTopHeader activeChat={activeChat} fetchMessages={fetchAllMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            {/* main chat content box  */}
            <div className={`hidden md:!flex md:flex-col md:h-full md:w-full ${styles.background} md:overflow-y-hidden  `}>
            </div>
            <ChatBox token={token} chats={chats} activechat={activeChat} fetchMessages={fetchAllMessages} allMessages={allMessages} loading={loading} errorMessage={errorMessage} setError={setErrorMessage} setMessages={setAllMessages} socketConnected={user?.socketConnected} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>
        }
      </div>

      {/* for mobile screen  */}
      <div className='flex h-screen w-full md:!hidden '>
        {!singlechatMobileView ? <>
          <SideBarBig chats={chats} setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} singlechatMobileView={singlechatMobileView} setSinglechatMobileView={setSinglechatMobileView} />
          <BottomNavMobile navigationValue={navigationValue} setNavigationValue={setNavigationValue} />
        </> :
          <div className='w-full h-screen flex md:!hidden flex-col'>
            <ChatBoxTopHeader activeChat={activeChat} fetchMessages={fetchAllMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} singlechatMobileView={singlechatMobileView} setSinglechatMobileView={setSinglechatMobileView} />
            <div className={`flex md:hidden flex-col h-[82vh] w-full  ${styles.background_mobile} overflow-y-hidden `}>
            </div>
            <ChatBox token={token} chats={chats} activechat={activeChat} fetchMessages={fetchAllMessages} allMessages={allMessages} loading={loading} errorMessage={errorMessage} setError={setErrorMessage} setMessages={setAllMessages} socketConnected={user?.socketConnected} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </div>}
      </div>


    </>
  )
}

export default Chats