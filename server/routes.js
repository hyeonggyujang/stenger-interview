import { Router } from 'express';
import { getUsers, createUser, updateUser, deleteUser } from './handler/handlers.js';

const router = Router();

router.get('/users', getUsers);
router.post('/user', createUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

export default router;