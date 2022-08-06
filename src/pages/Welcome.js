import React from 'react'
import { useNavigate } from 'react-router-dom'

const Welcome = () => {
    const navigate = useNavigate();
    
    return (
        <div className='w-screen h-screen flex flex-col items-center justify-center'>
            <div className='flex flex-col'>
                <div className='w-[100%] h-[100%] flex flex-col'>
                    <div className="w-[100%] md:w-[80%] md:mx-auto flex space-x-10 md:space-x-20 justify-center items-center md:mt-1 mt-1 ">
                        <img src="/assets/welcomeleft.svg" alt="left" className='h-28 md:h-52 opacity-70' />
                        <img src="/assets/welcomeright.svg" alt="right" className='h-28 md:h-52 opacity-70' />
                    </div>
                    <div className='mx-auto md:-mt-10 -mt-5 z-40'>
                        <img src="/assets/trell.jpeg" alt="logo" className='md:h-24 md:w-32 h-16 w-24 ' />
                    </div>
                </div>

                <h1 className='font-dancingScript font-bold md:text-4xl text-2xl tracking-wide text-gray-600 text-center md:mt-5 mt-12  '>Hey! Welome</h1>
                <p className='font-nunito text-gray-400 my-2 tracking-wide text-center w-[90%] mx-auto md:w-[100%] text-sm md:text-lg font-light md:mb-10 mb-16'>Trell is a fun messaging app that works online, chat one-to-one or in groups, just register and start chatting.</p>
                <button className='md:w-[40%] w-[90%] hover:shadow-sm px-5 py-3 rounded-lg mx-auto mb-2 bg-gradient-to-tr from-rose-400 via-fuchsia-500 to-indigo-500 text-sm md:text-base tracking-wide opacity-[.70] md:opacity-[.80] text-white' onClick={()=>navigate('/register')}>Get Started</button>
                <button className='md:w-[40%] w-[90%]  px-5 py-3 rounded-lg mx-auto border-[1.5px] border-purple-400 mt-2 text-sm md:text-base tracking-wide hover:shadow-sm' onClick={()=>navigate('/login')}>I already have an account</button>
            </div>

        </div>
    )
}

export default Welcome