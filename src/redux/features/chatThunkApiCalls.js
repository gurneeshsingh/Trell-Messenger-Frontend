import axios from "axios";
import { createSingleChat, fetchAllChats, createGroupChat, updateGroupImage, renameGroup, removeSelfFromGroup, exitAndDeleteGroup ,addUsersToGroup, addUnreadMessagesRoute, removeUnreadMessagesRoute} from "../../utils/apiRoutes";

export const callCreateSingleChatApi = async (userId, token) => {
    const response = await axios.post(createSingleChat, { userId }, {
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    return response.data
};

export const callFetchChatsApi = async (token) => {
    const response = await axios.get(fetchAllChats, {
        headers: {
            authorization: `Bearer ${token}`
        }
    });
    return response.data
};

export const callCreateGroupChatApi = async (users, groupName, token) => {
    const response = await axios.post(createGroupChat, { users, groupName }, {
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    return response.data
};

export const callUpdateGroupImageApi = async (chatId, groupImage, token) => {
    const response = await axios.put(updateGroupImage, { chatId, groupImage }, {
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    return response.data
};

export const callRenameGroupApi = async (chatId, groupName, token) => {
    const response = await axios.put(renameGroup, { chatId, groupName }, {
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    return response.data
};

export const callRemoveSelfFromGroupApi = async (chatId,  token) => {
    const response = await axios.put(removeSelfFromGroup, { chatId }, {
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    return response.data
};

export const callDeleteGroupApi = async (chatId, token) => {
    const response = await axios.delete(exitAndDeleteGroup, {
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        data: {
            chatId
        }
    })
    return response.data
};

export const callAddUsersToGroupApi = async (chatId, users, token) => {
    const response = await axios.put(addUsersToGroup, { chatId, users }, {
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    return response.data
};

export const callAddUnreadMessagesApi = async (chat, message, token) => {
    const response = await axios.put(addUnreadMessagesRoute, { chat, message }, {
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    return response.data
};

export const callRemoveUnreadMessagesApi = async (chat, userId, token) => {
    const response = await axios.put(removeUnreadMessagesRoute, { chat, userId }, {
        headers: {
            authorization: `Bearer ${token}`,
            "Content-Type":"application/json"
        }
    })
    return response.data
}
