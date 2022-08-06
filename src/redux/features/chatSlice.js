import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { callCreateSingleChatApi, callFetchChatsApi, callCreateGroupChatApi, callUpdateGroupImageApi, callRenameGroupApi, callRemoveSelfFromGroupApi, callDeleteGroupApi, callAddUsersToGroupApi, callAddUnreadMessagesApi, callRemoveUnreadMessagesApi } from "./chatThunkApiCalls";

export const accessSingleChat = createAsyncThunk('chat/single/accessOrCreate', async (id, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            return await callCreateSingleChatApi(id, token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const createGroupChat = createAsyncThunk('chat/group/create', async ({ users, groupName }, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            return await callCreateGroupChatApi(users, groupName, token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateGroupImage = createAsyncThunk('chat/group/image/update', async ({ chatId, groupImage }, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            return await callUpdateGroupImageApi(chatId, groupImage, token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})


export const fetchAllChats = createAsyncThunk('chat/findall', async (undefined, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            return await callFetchChatsApi(token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const renameGroup = createAsyncThunk('chat/group/rename', async ({ chatId, groupName }, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            return await callRenameGroupApi(chatId, groupName, token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const removeFromGroup = createAsyncThunk('chat/group/remove', async (chatId, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            return await callRemoveSelfFromGroupApi(chatId, token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteGroup = createAsyncThunk('chat/group/delete', async (chatId, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            return await callDeleteGroupApi(chatId, token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const addUsersInGroup = createAsyncThunk('chat/group/add', async ({ chatId, users }, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            return await callAddUsersToGroupApi(chatId, users, token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const addToUnreadMessages = createAsyncThunk('chat/unread/add', async ({ chat, message }, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            return await callAddUnreadMessagesApi(chat, message, token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const removeUnread = createAsyncThunk('chat/unread/remove', async ({ chat, userId }, thunkAPI) => {
    try {
        const token = JSON.parse(localStorage.getItem('token'));
        if (token) {
            return await callRemoveUnreadMessagesApi(chat, userId, token)
        }
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
})



export const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: [],
        activeChat: undefined,
        isError: false,
        isSuccess: false,
        isLoading: false,
        message: ""
    },
    reducers: {
        reset: (state) => {
            state.chats = []
            state.activeChat = undefined
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
            state.message = ''
        },
        toggleChat: (state, action) => {
            state.activeChat = action.payload
        },
        resetStatus: (state) => {
            state.isSuccess = false
            state.isError = false
        },
        deleteFromList: (state) => {
            state.activeChat = undefined
        },
        
    },
    extraReducers: {
        [accessSingleChat.pending]: (state) => {
            state.isLoading = true
        },
        [accessSingleChat.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            const existingChat = state.chats.find((chat) => chat._id === action.payload._id)
            if (existingChat) {
                state.chats = [...state.chats]
                state.activeChat = existingChat
            } else {
                state.chats = [action.payload, ...state.chats]
                state.activeChat = action.payload
            }

        },
        [accessSingleChat.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
        [fetchAllChats.pending]: (state) => {
            state.isLoading = true
        },
        [fetchAllChats.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.chats = action.payload
            state.activeChat = state?.activeChat === undefined ? undefined : state?.activeChat

        },
        [fetchAllChats.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
        [createGroupChat.pending]: (state) => {
            state.isLoading = true
        },
        [createGroupChat.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            const existingGroupChat = state.chats.find((chat) => chat._id === action.payload._id)
            if (existingGroupChat) {
                state.chats = [...state.chats]
                state.activeChat = existingGroupChat
            } else {
                state.chats = [action.payload, ...state.chats]
                state.activeChat = action.payload
            }
        },
        [createGroupChat.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
        [updateGroupImage.pending]: (state) => {
            state.isLoading = true
        },
        [updateGroupImage.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.activeChat = action.payload
        },
        [updateGroupImage.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
        [renameGroup.pending]: (state) => {
            state.isLoading = true
        },
        [renameGroup.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.activeChat = action.payload
        },
        [renameGroup.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
        [removeFromGroup.pending]: (state) => {
            state.isLoading = true
        },
        [removeFromGroup.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.activeChat = action.payload.updatedChat
        },
        [removeFromGroup.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
        [deleteGroup.pending]: (state) => {
            state.isLoading = true
        },
        [deleteGroup.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.message = action.payload.message
            state.activeChat = undefined
        },
        [deleteGroup.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
        [addUsersInGroup.pending]: (state) => {
            state.isLoading = true
        },
        [addUsersInGroup.fulfilled]: (state) => {
            state.isLoading = false
            state.isSuccess = true

        },
        [addUsersInGroup.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
        [addToUnreadMessages.pending]: (state) => {
            state.isLoading = true
        },
        [addToUnreadMessages.fulfilled]: (state, action) => {
            state.isLoading = false
            state.isSuccess = true
        },
        [addToUnreadMessages.rejected]: (state) => {
            state.isLoading = false
            state.isError =true
        },
        [removeUnread.pending]: (state) => {
            state.isLoading = true
        },
        [removeUnread.fulfilled]: (state) => {
            state.isLoading = false
            state.isSuccess = true
        },
        [removeUnread.rejected]: (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        },
        ['user/logoutUser']: (state) => {
            state.chats = []
            state.activeChat = undefined
        }
        

    }
});

export default chatSlice.reducer;
export const { reset, toggleChat, resetStatus, deleteFromList } = chatSlice.actions;

