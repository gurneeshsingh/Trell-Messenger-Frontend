import React from 'react';
import styles from './EmptyChatBox.module.css';


const EmptyChatBox = () => {


    return (
        <div className='md:!w-[65%] !hidden !mx-auto md:!flex md:!flex-col md:!justify-center !h-[100%]'>
            
                    {/* for big screen image  */}
                    <div className={`hidden md:flex flex-col justify-center items-center text-center h-full w-full ${styles.main}`}>
                        <img src="/assets/chatbox.svg" alt="chat default" className='h-80 w-80 z-50 ' />
                        <p className='w-[70%] mx-auto text-sm font-nunito text-gray-500 tracking-wide mb-1 -mt-5 font-medium'>Select a chat from the list or search to start a new chat.</p>
                        <p className='w-[70%] mx-auto text-sm font-nunito text-gray-500 tracking-wide  font-medium'>Now you can also start a group chat with your friends, tap on the group icon on the left and start a group conversation.</p>
                        <div className='w-full bg-purple-700 mx-auto h-2.5 absolute bottom-0 '></div>
                    </div>
                    {/* for mobile screen  */}
                    <div className={`flex flex-col md:hidden justify-center items-center h-full w-full `}>
                        <img src="/assets/chatbox.svg" alt="chat default" className='h-36 w-h-36 z-50' />
                        <p className='w-[85%] mx-auto text-xs font-nunito text-gray-500 tracking-wide mb-1 mt-4 text-center  font-medium'>Select a chat from the list or search to start a new chat.</p>
                        <p className='w-[85%] mx-auto text-xs font-nunito text-gray-500 tracking-wide  font-medium text-center'>Now you can start a group chat with your friends, tap on the group icon on the left and start a group conversation.</p>
                    </div>
                
        </div>
    )
}

export default EmptyChatBox;