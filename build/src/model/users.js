let users = [{ id: 1, userName: "Bond" }];
export const getAllUsers = () => [...users];
export const addUser = (user) => {
    if (users.findIndex(elem => elem.id === user.id) !== -1)
        return false;
    users.push(user);
    return true;
};
export const removeUser = (id) => {
    return null;
};
