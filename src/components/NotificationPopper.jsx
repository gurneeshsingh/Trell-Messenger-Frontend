import React from 'react'
import { useSelector } from 'react-redux'
import { IconButton, Avatar } from '@mui/material';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { format, differenceInCalendarDays } from "date-fns";
import { toggleChat } from '../redux/features/chatSlice';
import { useDispatch } from 'react-redux';
import { getMe } from '../redux/features/userSlice';
import { removeUnread } from '../redux/features/chatSlice';
import CloseIcon from '@mui/icons-material/Close';


const NotificationPopper = ({ viewNotifications, setViewNotifications, chats, checkMessage, fetchAgain, setFetchAgain, setSinglechatMobileView, singlechatMobileView }) => {

  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch()


  function getCorrectTime(date) {
    const updateddate = new Date(date)
    const currentDate = new Date()
    const updatedTime = format(new Date(date), 'h:mm a')
    const currentTime = format(new Date(), 'h:mm a')
    const dayDifference = differenceInCalendarDays(currentDate, updateddate)
    if (updatedTime <= currentTime) {
      return `today, at ${updatedTime}`
    }
    if ((dayDifference > 0) && (dayDifference < 2)) {
      return `yesterday, at ${updatedTime}`
    }
    if (dayDifference >= 2) {
      return format(new Date(updateddate), `MMMM d, yyyy h:mm a`)
    }
  };


  function giveCombinedNotifications(user, chats) {
    let output = [];
    let filteredChats = [];
    if (user?.groupNotifications?.length > 0) {
      user.groupNotifications?.forEach((notification) => output.push(notification));
    }
    filteredChats = chats?.map((chat) => chat?.unreadMessages?.filter((message) => message?.sender?._id !== user?._id));
    output = output.concat(filteredChats).flat().sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    return output;
  };

  async function handleNotification(notification, chats) {
    const token = JSON.parse(localStorage.getItem('token'))
    let notificationToDelete;
    if (notification?.chat?.isGroupChat) {
      notificationToDelete = chats?.filter((chat) => chat?._id === notification?.chat?._id)
    } else {
      notificationToDelete = chats?.filter((chat) => chat?._id === notification?.chat)
    }
    dispatch(toggleChat(notificationToDelete[0]))
    await dispatch(removeUnread({ chat: notificationToDelete[0], userId: user?._id }))
    if (notification?.chat?.isGroupChat) {
      token && dispatch(getMe(token))
      setSinglechatMobileView(!singlechatMobileView)
    } else {
      setFetchAgain(!fetchAgain)
      setSinglechatMobileView(!singlechatMobileView)

    }
  };



  return (
    // for desktop screen 
    <>

      <div className='hidden w-96 md:!flex flex-col shadow-sm drop-shadow-md transition-all bg-white absolute z-[50] top-20 left-8 rounded-md overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-purple-50 max-h-[50%] ' onClick={() => setViewNotifications(!viewNotifications)} >
        <div className='flex items-center  border-b-[1.5px] border-gray-100 px-4 py-3 mb-2  drop-shadow-sm'>
          <h2 className='font-nunito text-lg font-semibold text-gray-700 flex-1'>Notifications</h2>
        </div>
        {(user?.groupNotifications.length > 0 || chats?.some((chat) => checkMessage(chat))) ?
          giveCombinedNotifications(user, chats)?.map((notification, index) => (
            <>
              <div key={index} className="w-[22.5rem] mx-auto flex items-center rounded-md px-3 py-3 my-1 hover:bg-gray-100 cursor-pointer transition-all hover:drop-shadow-sm " onClick={() => handleNotification(notification, chats)}>
                <FiberManualRecordIcon color='secondary' fontSize='1rem' sx={{ marginRight: "14px" }} />
                {notification?.chat?.isGroupChat ? <p className='font-nunito text-sm w-full max-w-[75%] '>New message recieved in <span className='capitalize font-bold text-purple-800'>{notification?.chat?.groupName}</span> {getCorrectTime(notification?.updatedAt)}</p> :
                  <p className='font-nunito text-sm w-full max-w-[75%]'><span className='capitalize font-bold text-purple-800'>{notification?.sender?.name}</span> sent you a new message {getCorrectTime(notification?.updatedAt)}</p>
                }
                {notification?.chat?.isGroupChat ? <div className='w-8 h-8 rounded-full ml-5'>
                  <Avatar src={notification?.chat?.groupImage} alt="avatar" sx={{ width: "2rem", height: "2rem" }} />
                </div> : <div className='w-8 h-8 rounded-full ml-5'>
                  <Avatar src={notification?.sender?.avatar} alt="avatar" sx={{ width: "2rem", height: "2rem" }} />
                </div>}
              </div>
              <div className='border-b-[1.5px] w-[22rem] mx-auto my-1 last:border-none'></div>
            </>
          ))
          :
          <div className=' my-3 px-4 py-3 bg-purple-200 w-[93%] mx-auto rounded-md'>
            <p className='font-nunito text-center text-sm  ' >You have no new notifications.</p>
          </div>}
      </div>

      {/* for mobile screen  */}
      <div className=' md:!hidden  !flex flex-col h-screen  transition-all bg-white  overflow-y-auto scrollbar-thin scrollbar-thumb-purple-200 scrollbar-track-purple-50 w-[75vw]' onClick={() => setViewNotifications(!viewNotifications)} >
        <div className='flex items-center  border-b border-[ rgb(209 213 219)] px-2 py-4 mb-2  drop-shadow-sm'>
          <IconButton size='medium' color='error' onClick={() => setViewNotifications(!viewNotifications)}>
            <CloseIcon color='error' fontSize='1.2rem' />
          </IconButton>
          <h2 className='font-nunito tracking-wide text-lg font-semibold text-gray-700 flex-1 ml-3'>Notifications</h2>
        </div>
        {(user?.groupNotifications.length > 0 || chats?.some((chat) => checkMessage(chat))) ?
          giveCombinedNotifications(user, chats)?.map((notification, index) => (
            <>
              <div key={index} className="w-[90%] mx-auto flex items-center rounded-md px-2 py-3 my-1.5 hover:bg-gray-100 cursor-pointer transition-all hover:drop-shadow-sm " onClick={() => handleNotification(notification, chats)}>
                <FiberManualRecordIcon color='secondary' fontSize='.8rem' sx={{ marginRight: "14px" }} />
                {notification?.chat?.isGroupChat ? <p className='font-nunito text-xs w-full max-w-[75%] '>New message recieved in <span className='capitalize font-bold text-purple-800'>{notification?.chat?.groupName}</span> {getCorrectTime(notification?.updatedAt)}</p> :
                  <p className='font-nunito text-xs w-full max-w-[75%]'><span className='capitalize font-bold text-purple-800'>{notification?.sender?.name}</span> sent you a new message {getCorrectTime(notification?.updatedAt)}</p>
                }
                {notification?.chat?.isGroupChat ? <div className='w-7 h-7 rounded-full ml-5'>
                  <Avatar src={notification?.chat?.groupImage} alt="avatar" sx={{ width: "1.7rem", height: "1.7rem" }} />
                </div> : <div className='w-7 h-7 rounded-full ml-5'>
                  <Avatar src={notification?.sender?.avatar} alt="avatar" sx={{ width: "1.7rem", height: "1.7rem" }} />
                </div>}
              </div>
              <div className='border-b-[1.5px] w-[22rem] mx-auto my-1 last:border-none'></div>
            </>
          ))
          :
          <div className='w-full h-screen -mt-5 flex flex-col justify-center items-center '>
            <img src="/assets/empty.svg" alt="sad" height={230} width={230} />
            <div className=' mt-6 py-3 bg-purple-200 w-[90%] mx-auto rounded-md  flex justify-center items-center'>
              <p className='font-nunito text-center  font-semibold  ' >You have no new notifications.</p>
            </div>
          </div>
        }
      </div>
    </>
  )
}

export default NotificationPopper