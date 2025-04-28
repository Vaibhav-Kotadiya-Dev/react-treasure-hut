import { Router } from 'express';
import UserController from './UserController';

const userHandler= Router();

userHandler.post('/create',UserController.create);
// userHandler.post('/login',UserController.login);

export default userHandler;