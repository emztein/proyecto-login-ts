import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import User from '../models/User';
import { addUser, validateExistingUsername, authenticateUser } from '../dao/authDao';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();


export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Debes proporcionar nombre de usuario y contraseña' });
    }

    validateExistingUsername(username) && res.status(500).json({ error: 'El usuario ya existe' })

    const hashedPassword = await bcrypt.hash(password, 10)// 10 es el número de rondas de cifrado
    const newUser: User = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
    };

    addUser(newUser);

    // Generar un token JWT para el nuevo usuario
    const token = jwt.sign({ userId: username }, process.env.JWT_SECRET as string);

    res.status(201).json({ token });

  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Debes proporcionar nombre de usuario y contraseña' });
    }


    const isAuthenticated = await authenticateUser(username, password);

    if (isAuthenticated) {

      const token = jwt.sign({ userId: username }, process.env.JWT_SECRET as string);

      // Send the token in the response
      res.status(200).json({ token });
    } else {
      // Authentication failed
      res.status(401).json({ error: 'Authentication failed' });
    }

  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
}