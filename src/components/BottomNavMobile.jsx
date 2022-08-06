import React from 'react'
import  MuiBottomNavigationAction  from "@mui/material/BottomNavigationAction"
import { FaRegUser } from "react-icons/fa"
import { BsChatText } from "react-icons/bs"
import { IoSettingsOutline } from "react-icons/io5"
import MuiBottomNavigation from "@mui/material/BottomNavigation"
import { styled } from "@mui/material/styles";

const BottomNavMobile = ({navigationValue,setNavigationValue}) => {


    const BottomNavigation = styled(MuiBottomNavigation)(`
    width:100%;
    height:9vh;
    position:absolute;
    bottom:0;
    border-top: 1px solid gray;
    z-index:50;
   
    `)

    const BottomNavigationAction = styled(MuiBottomNavigationAction)(`
        color:#696969;
        &.Mui-selected {
            color:#9900F0
        }

    `)

    return (
        <BottomNavigation  className=' !flex !items-center !justify-center md:!hidden !shadow-lg' value={navigationValue} onChange={(e, newValue) => { setNavigationValue(newValue) }}   >
            <BottomNavigationAction icon={<FaRegUser fontSize="1.3rem" />} />
            <BottomNavigationAction icon={<BsChatText fontSize="1.3rem" />} />
            <BottomNavigationAction icon={<IoSettingsOutline fontSize="1.3rem" />} />
        </BottomNavigation>
    )
}

export default BottomNavMobile