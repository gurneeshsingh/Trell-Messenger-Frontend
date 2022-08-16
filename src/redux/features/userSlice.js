import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { callRegisterUserApi, callLoginUserApi, callUploadAvatarApi, callGetMeApi, callUpdateUsernameApi, callUpdatePasswordApi, callremoveProfilePictureApi, callLoadGroupNotificationsApi } from "./userThunkApiCalls";
import { socket } from "../../App";



// create thunk actions that will give the response from the backend and then we can update the state of the application
export const registerUser = createAsyncThunk('user/register', async (user, thunkAPI) => {
    try {

        return await callRegisterUserApi(user)

    } catch (error) {
        // create a message var that can hold all possible error messages from the backend 
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        // return message using thunkAPI
        return thunkAPI.rejectWithValue(message)
    }
});

// export const logoutUser = createAsyncThunk('user/logout', () => {
//     localStorage.removeItem('token')
// });

export const loginUser = createAsyncThunk('user/login', async (user, thunkAPI) => {
    try {
        return await callLoginUserApi(user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

        return thunkAPI.rejectWithValue(message)
    }
});

export const uploadAvatar = createAsyncThunk('user/upload/avatar', async (avatar, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'))
        if (token) {

            return await callUploadAvatarApi(avatar, token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

        return thunkAPI.rejectWithValue(message)
    }
});

export const getMe = createAsyncThunk('user/me', async (token) => {
    try {

        return await callGetMeApi(token)

    } catch (error) {
        console.log(error);
    }
});

export const updateUsername = createAsyncThunk('user/update/name', async (name, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            return await callUpdateUsernameApi(name, token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();

        return thunkAPI.rejectWithValue(message)
    }
});

export const updateUserPassword = createAsyncThunk('user/update/password', async ({ oldPassword, newPassword }, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            return await callUpdatePasswordApi(oldPassword, newPassword, token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const removeAvatar = createAsyncThunk('user/avatar/remove', async (undefined, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            return await callremoveProfilePictureApi(token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
});

export const getGroupNotifications = createAsyncThunk('user/group/notification/load', async (undefined, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            return await callLoadGroupNotificationsApi(token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message)
    }
})


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        // set the user var to null if no token froun in the localstorage else set the user as defined above
        user: null,
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: "",
        socketConnected: false
    },
    reducers: {
        // create a reset reducer that will reset all state data except user to default 
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
        removeError: (state) => {
            state.isError = false
        },
        logoutUser: (state) => {
            localStorage.removeItem('token')
            state.user = null
            state.socketConnected =false
        }
    },
    extraReducers: {
        [registerUser.pending]: (state) => {
            state.isLoading = true
        },
        [registerUser.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
            if (state.user != null) {
                socket.emit('usersetup', state.user?._id)
                state.socketConnected = true
            }
        },
        [registerUser.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        },
        [loginUser.pending]: (state) => {
            state.isLoading = true
        },
        [loginUser.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
            if (state.user != null) {
                socket.emit('usersetup', state.user?._id)
                state.socketConnected = true
            }
        },
        [loginUser.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
            state.user = null
        },
        [uploadAvatar.pending]: (state) => {
            state.isLoading = true
        },
        [uploadAvatar.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload.message
        },
        [uploadAvatar.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
        [getMe.pending]: (state) => {
            state.isLoading = true
        },
        [getMe.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user = action.payload
            if (state.user != null) {
                socket.emit('usersetup', state.user?._id)
                state.socketConnected = true
            }
        },
        [getMe.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
        [updateUsername.pending]: (state) => {
            state.isLoading = true

        },
        [updateUsername.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload.message
        },
        [updateUsername.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
        [updateUserPassword.pending]: (state) => {
            state.isLoading = true
        },
        [updateUserPassword.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload.message
        },
        [updateUserPassword.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
        [removeAvatar.pending]: (state) => {
            state.isLoading = true
        },
        [removeAvatar.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload.message
        },
        [removeAvatar.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
        [getGroupNotifications.pending]: (state) => {
            state.isLoading = true
        },
        [getGroupNotifications.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.user.groupNotifications = action.payload[0].groupNotifications
        },
        [getGroupNotifications.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        }

    }
})

export default userSlice.reducer
export const { reset, removeError, logoutUser } = userSlice.actions
