import User from '../models/User';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';


export const addUser = (user: User) => {
  const users: User[] = getUsers();
  users.push(user)
  const filePath = path.join(__dirname, '../data/Users.json');
  console.log(filePath)

  try {
    fs.writeFileSync(filePath, JSON.stringify({ users }));
    console.log('File written successfully.');
  } catch (error) {
    console.error('Error writing file:', error);
  }
}

export const getUsers = (): User[] => {
  const filePath = path.join(__dirname, '../data/Users.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  const users: User[] = JSON.parse(data).users;
  return users
}

export const validateExistingUsername = (username: string) => {
  const users: User[] = getUsers()
  return users.find((user: User) => user.username === username)
}


export const authenticateUser = async (username: string, password: string) => {
  const users = getUsers();
  const user = users.find((user) => user.username === username);

  if (!user) {
    return false;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  return passwordMatch;
}