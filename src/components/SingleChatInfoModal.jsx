import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import { Avatar, IconButton } from '@mui/material';
import { getSender } from '../utils/chatLogic';
import { MdEmail } from "react-icons/md"
import { BsFillPersonFill } from "react-icons/bs"
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { format } from 'date-fns';
import StarsIcon from '@mui/icons-material/Stars';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';



const SingleChatInfoModal = ({ chat, showSingleChatDrawer, setShowSingleChatDrawer }) => {

    const { chats } = useSelector((state) => state.chat);
    const { user } = useSelector((state) => state.user);
    const [commonGroups, setCommonGroups] = useState([]);

    function findCommonGroups(userChats, otheruser) {
        let commonGroupsArray = [];
        commonGroupsArray = userChats?.filter((chat) => (chat.isGroupChat === true && chat.users?.find((suser) => suser._id === otheruser?._id)))
        if (commonGroupsArray.length > 0) {
            setCommonGroups(commonGroupsArray)
        }
    };

    useEffect(() => {
        findCommonGroups(chats, getSender(user, chat?.users))
    }, [user, chats, chat?.users])



    return (
        <>
            {/* for desktop screeen  */}
            <div className='hidden md:w-[35vw] md:h-screen md:flex md:flex-col justify-center md:overflow-y-auto bg-white  relative scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 transition-all'>
                {/* top avatar section  */}
                <div className='w-full h-[30vh]  flex justify-center items-center my-3 z-30 '>
                    <div className='flex justify-center items-center w-[9rem] h-[9rem] rounded-full border-[2px] border-purple-400'>
                        <Avatar src={getSender(user, chat?.users)?.avatar} alt="sender" sx={{ height: "8.5rem", width: "8.5rem" }} />
                    </div>
                </div>
                {/* main lower div  */}
                <div className='w-[90%] mx-auto rounded-t-3xl bg-[#f3f3f2] h-full flex flex-col shadow-md -mt-20'>
                    <div className='w-full mx-auto  flex flex-col items-center mt-[4.5rem] '>
                        <p className='text-gray-700 font-nunito capitalize font-bold text-xl flex items-center justify-center'><BsFillPersonFill className='!mr-2' color="#9333EA" />{getSender(user, chat?.users).name}</p>
                        <p className='text-gray-700 font-nunito font-light flex items-center justify-center tracking-wide'><MdEmail color='#9333EA' className='!mr-2' /> {getSender(user, chat?.users).email}</p>
                    </div>
                    {/* inner div */}
                    <div className='w-[90%] mx-auto h-full flex flex-col rounded-t-3xl shadow-sm drop-shadow-sm bg-white mt-4'>
                        {commonGroups?.length > 0 && <div className='w-[85%] mt-7 mx-auto transition-all scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 overflow-y-auto '>
                            <Accordion sx={{ backgroundColor: "#7954A1", boxShadow: "none", marginBottom: "5px", borderRadius: "15px" }}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon color="white" />} aria-controls="pannel" id='pannel-header' >
                                    <p className='!font-nunito text-white !font-semibold text-sm !my-0 capitalize'>Groups in common ({commonGroups.length})</p>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {commonGroups?.map((cg) => (
                                        <div key={cg._id} className="w-[100%] mx-auto rounded-lg mb-2 bg-white shadow-md flex items-center p-2">
                                            <Avatar src={cg.groupImage} alt='groupimage' />
                                            <p className='text-black font-nunito font-semibold ml-3 flex-1 text-sm'>{cg.groupName}</p>
                                            <p className='text-[10px] font-nunito font-semibold bg-yellow-200 p-1.5 rounded-md'>Member since: {format(new Date(cg.createdAt), 'dd/MM/yy')}</p>
                                        </div>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        </div>}
                        <div className='flex w-full mt-7  border-b border-gray-300'></div>
                        <p className='font-nunito text-black text-lg font-bold w-[85%] mx-auto mt-7 mb-2 capitalize'>Recent media and files</p>
                        <p className='font-nunito  text-gray-700 text-sm font-bold w-[85%] mx-auto my-1'>No Files Shared.</p>
                        <div className='flex w-full mt-7  border-b border-gray-300'></div>
                        <p className='font-nunito text-black text-lg font-bold w-[85%] mx-auto mt-7 mb-2 capitalize'>Settings</p>
                        <div className='my-1 w-[85%] mx-auto flex items-center'>
                            <IconButton color='warning'><StarsIcon /></IconButton>
                            <p className='font-nunito  font-bold ml-2'>Starred Messages</p>
                        </div>

                    </div>
                </div>

            </div>

            {/* for mobile screen  */}
            <div className='md:hidden  w-[100vw] h-screen flex flex-col overflow-y-auto bg-white  relative scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 transition-all'>
                {/* top avatar section  */}
                {/* back button for mobile  */}
                <div className='flex w-[90%] mx-auto mt-5 mb-2'>
                    <IconButton size="medium" color="secondary" onClick={()=>setShowSingleChatDrawer(!showSingleChatDrawer)}>
                        <ArrowBackIosIcon fontSize='1rem' color="secondary"/>
                    </IconButton>
                </div>
                <div className='w-full h-[22vh]  flex justify-center items-center  z-30 '>
                    <div className='flex justify-center items-center w-[7rem] h-[7rem] rounded-full border-[2px] border-purple-400'>
                        <Avatar src={getSender(user, chat?.users)?.avatar} alt="sender" sx={{ height: "6.5rem", width: "6.5rem" }} />
                    </div>
                </div>
                {/* main lower div  */}
                <div className='w-[90%] mx-auto rounded-t-2xl bg-[#f3f3f2] h-full flex flex-col shadow-md -mt-16'>
                    <div className='w-full mx-auto  flex flex-col items-center mt-[4.5rem] '>
                        <p className='text-gray-700 font-nunito capitalize font-bold text-base flex items-center justify-center'><BsFillPersonFill className='!mr-2' color="#9333EA" />{getSender(user, chat?.users).name}</p>
                        <p className='text-gray-700 font-nunito font-light flex text-sm items-center justify-center tracking-wide'><MdEmail color='#9333EA' className='!mr-2' /> {getSender(user, chat?.users).email}</p>
                    </div>
                    {/* inner div */}
                    <div className='w-[90%] mx-auto h-full flex flex-col rounded-t-2xl shadow-sm drop-shadow-sm bg-white mt-4'>
                        {commonGroups?.length > 0 && <div className='w-[85%] mt-7 mx-auto transition-all scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 overflow-y-auto '>
                            <Accordion sx={{ backgroundColor: "#7954A1", boxShadow: "none", marginBottom: "5px", borderRadius: "15px" }} >
                                <AccordionSummary expandIcon={<ExpandMoreIcon color="white" />} aria-controls="pannel" id='pannel-header' >
                                    <p className='!font-nunito text-white !font-semibold text-sm !my-0 capitalize'>Groups in common ({commonGroups.length})</p>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {commonGroups?.map((cg) => (
                                        <div key={cg._id} className="w-[100%] mx-auto rounded-lg mb-2 bg-white shadow-md flex items-center p-2">
                                            <Avatar src={cg.groupImage} alt='groupimage' />
                                            <div className='flex flex-col flex-1 ml-3 justify-center '>
                                                <p className='text-black font-nunito font-semibold ml-3 flex-1 text-center text-sm mb-1'>{cg.groupName}</p>
                                                <p className='text-[10px] font-nunito text-center font-semibold bg-yellow-200 p-1.5  rounded-md'>Member since: {format(new Date(cg.createdAt), 'dd/MM/yy')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        </div>}
                        <div className='flex w-full mt-7  border-b border-gray-300'></div>
                        <p className='font-nunito text-black text-base font-bold w-[85%] mx-auto mt-7 mb-2 capitalize'>Recent media and files</p>
                        <p className='font-nunito  text-gray-700 text-sm font-bold w-[85%] mx-auto my-1'>No Files Shared.</p>
                        <div className='flex w-full mt-7  border-b border-gray-300'></div>
                        <p className='font-nunito text-black text-base font-bold w-[85%] mx-auto mt-7 mb-2 capitalize'>Settings</p>
                        <div className='my-1 w-[85%] mx-auto flex items-center'>
                            <IconButton color='warning'><StarsIcon fontSize='1.1rem' /></IconButton>
                            <p className='font-nunito text-sm font-bold ml-2'>Starred Messages</p>
                        </div>

                    </div>
                </div>

            </div>
        </>
    )
}

export default SingleChatInfoModal