export type User={
id: number,
userName: string
};

let users: User[] = [{id: 1, userName: "Bond"}];

export const getAllUsers = () =>[...users];

export const getUser = (userId: number): User | null =>{
const user = users.find(user => user.id === userId);
return user || null;
};

export const addUser = (user: User): boolean =>{
if (users.findIndex(elem => elem.id === user.id) !== -1)
return false;
users.push(user);
return true;
};

export const updateUser = (newUserData: User): boolean =>{
const userIndex = users.findIndex(user => user.id === newUserData.id);
if (userIndex === -1){
return false;
}
users[userIndex] = newUserData;
return true;
};

export const removeUser = (id: number): User | null =>{
const userIndex = users.findIndex(user => user.id === id);
if (userIndex === -1) {
return null;
}
const [removedUser] = users.splice(userIndex, 1);
return removedUser;
};
