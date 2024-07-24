import User from '../types/User';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { getDb } from '../database/database';
import { Collections } from './authDao.constants';

/* export const addUser = (user: User) => {
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
} */

export const addUser = async (user: User) => {
  const db = getDb();
  const collection = db.collection(Collections.Users);
  try {
    const result = await collection.insertOne(user);
    return result;
  } catch (error) {
    console.error('Error al insertar el usuario:', error);
    throw error;
  }
};

/* export const getUsers = (): User[] => {
  const filePath = path.join(__dirname, '../data/Users.json');
  const data = fs.readFileSync(filePath, 'utf-8');
  const users: User[] = JSON.parse(data).users;
  return users
} */

export const getUsers = async (): Promise<User[]> => {
  const db = getDb();
  const collection = db.collection(Collections.Users);
  try {
    const users = await collection.find().toArray();
    // Mapea los documentos de MongoDB a tu tipo User
    const mappedUsers: User[] = users.map(user => ({
      id: user._id.toString(), // Si tu modelo User tiene una propiedad 'id'
      username: user.username,
      email: user.email,
      password: user.password,
      likedMovies: user.likedMovies, // Asegúrate de que todos los campos coincidan con tu modelo User
    }));
    return mappedUsers;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw error;
  }
};

export const validateExistingUsername = async (username: string): Promise<User | undefined> => {
  const users: User[] = await getUsers()
  return users.find((user: User) => user.username === username);
}


export const authenticateUser = async (username: string, password: string): Promise<string | boolean> => {
  const users = await getUsers();
  const user = users.find((user) => user.username === username);

  if (!user) {
    return false;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  return passwordMatch ? user.id : '';
}