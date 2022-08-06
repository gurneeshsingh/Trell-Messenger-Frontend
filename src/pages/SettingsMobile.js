import React from 'react'
import BottomNavMobile from '../components/BottomNavMobile'
import ModeNightIcon from '@mui/icons-material/ModeNight';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const SettingsMobile = ({ setNavigationValue, navigationValue }) => {
    return (
        <>
            <div className='w-full h-[91vh] flex md:!hidden flex-col items-center overflow-y-auto  relative scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 transition-all'>
                <h1 className='text-center font-dancingScript text-3xl my-7 font-semibold'>Settings</h1>
                <div className='w-full z-10 absolute opacity-10 top-[20%] overflow-hidden object-contain'>
                    <img src="/assets/groupsettings.svg" alt="settings" height={500} width={500}  />
                    </div>
                <div className='w-[85%] mx-auto flex flex-col h-[65%] justify-center '>
                    <div className='w-full flex items-center rounded-lg shadow-sm bg-purple-800 px-3 py-3 my-1.5 z-20'>
                        <ModeNightIcon fontSize='small' color='warning' />
                        <p className='font-nunito  tracking-wide text-white font-medium flex-1 ml-2'>Dark mode</p>
                        <p className='font-nunito font-semibold text-gray-400 text-sm'>Coming soon</p>
                    </div>
                    <div className='w-full flex items-center rounded-lg shadow-sm bg-purple-800 px-3 py-3 my-1.5 z-20'>
                        <AttachFileIcon fontSize='small'/>
                        <p className='font-nunito  tracking-wide font-medium text-white flex-1  ml-2'>Photos, videos, gifs</p>
                        <p className='font-nunito font-semibold text-gray-400 text-sm'>Coming soon</p>
                    </div>
                </div>
                <p className=' mb-2 mt-4 mx-auto text-center font-dancingScript text-purple-600 text-4xl'>Trell</p>
                <p className=' my-1 mx-auto text-center font-nunito font-light text-xs text-gray-500'>App version: 1.01</p>

            </div>
            <BottomNavMobile navigationValue={navigationValue} setNavigationValue={setNavigationValue} />
        </>
    )
}

export default SettingsMobile