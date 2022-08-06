import axios from "axios";
import { registerUserRoute, loginUserRoute, uploadAvatarRoute, getMeRoute, updateUserName, updatePassword, removeAvatar, loadGroupNotificationsRoute } from "../../utils/apiRoutes";

// this function will recieve userData from the user
export const callRegisterUserApi = async (userData) => {
    const response = await axios.post(registerUserRoute, userData, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    // when we use axios , axios inserts a data key into the response object by default, check if that exists  means we got respose , if response.data exists , set the localstorage with the user data
    if (response.data) {
        localStorage.setItem('token', JSON.stringify(response.data.token))
       
    }
    // return the response
    return response.data;
};


export const callLoginUserApi = async (userData) => {
    const response = await axios.post(loginUserRoute, userData, {
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (response.data) {
        localStorage.setItem('token', JSON.stringify(response.data.token))
       
    }
    return response.data
};


export const callUploadAvatarApi = async (avatar, token) => {

    const response = await axios.put(uploadAvatarRoute, { avatar }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },

    });
    return response.data
};

export const callGetMeApi = async (token) => {
    const response = await axios.get(getMeRoute, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
   
    return response.data
};

export const callUpdateUsernameApi = async (name, token) => {
    const response = await axios.put(updateUserName, { name, token }, {
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    return response.data
};

export const callUpdatePasswordApi = async (oldPassword, newPassword, token) => {
    const response = await axios.put(updatePassword, { oldPassword, newPassword, token }, {
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    return response.data
};

export const callremoveProfilePictureApi = async (token) => {
    const response = await axios.put(removeAvatar, null, {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    return response.data
};

export const callLoadGroupNotificationsApi = async (token) => {
    const response = await axios.get(loadGroupNotificationsRoute, {
        headers: {
            authorization: `Bearer ${token}`
        }
    })
    return response.data
};