
import React from 'react'
import BottomNavMobile from '../components/BottomNavMobile'
import { useSelector } from "react-redux"
import ProfileBigScreen from '../components/ProfileBigScreen';



const ProfileMobile = ({ setNavigationValue, navigationValue }) => {

    const { user, isLoading } = useSelector((state) => state.user);

    return (
        <>
            <ProfileBigScreen user={user} loading={isLoading} />
            <BottomNavMobile navigationValue={navigationValue} setNavigationValue={setNavigationValue} />
        </>

    )
}

export default ProfileMobile