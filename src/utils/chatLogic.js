export const getSender = (loggedUser, users) => {
    // a function that takes the logged user and the array of users in one to one chat and returns the opposite user in the chat 
    if (loggedUser?._id === users[0]?._id) {
        return users[1]
    }
    else {
        return users[0]
    }
};

