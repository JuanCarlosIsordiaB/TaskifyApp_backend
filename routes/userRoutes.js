import express from 'express';
import { authenticate, register, confirm,forgetPassword, checkToken, changePassword, profile } from '../controllers/userController.js';
import checkAuth from '../middleware/checkAuth.js';



const router = express.Router();


//Register, Confirmation of users
router.post('/', register);
router.post('/login', authenticate);
router.get('/confirm/:token', confirm);
router.post('/forget-password', forgetPassword);
router.get('/forget-password/:token', checkToken);
router.post('/forget-password/:token', changePassword);

router.get('/profile', checkAuth, profile);

export default router;