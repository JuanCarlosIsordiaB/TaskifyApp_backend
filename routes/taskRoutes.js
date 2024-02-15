import express from 'express';
import { 
    addTask,
    getTask,
    updateTask,
    deleteTask,
    changeStateTask 
} from "../controllers/taskController.js";
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/',checkAuth, addTask);
router.get('/:id', checkAuth, getTask);
router.put('/:id', checkAuth, updateTask);
router.delete('/:id', checkAuth, deleteTask);


router.post('/state/:id',checkAuth, changeStateTask);


export default router

