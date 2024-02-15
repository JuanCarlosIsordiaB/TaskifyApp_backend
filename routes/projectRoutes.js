import express from 'express';


import { addCollaborator, deleteCollaborator, deleteProject, editProject, getProject, getProjects, newProject } from '../controllers/projectController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.get('/', checkAuth, getProjects);
router.post('/', checkAuth, newProject);

router
    .route('/:id')
    .get(checkAuth,getProject )
    .put(checkAuth, editProject)
    .delete(checkAuth, deleteProject)

router.post('/add-collaborator/:id', checkAuth, addCollaborator);
router.post('/delete-collaborator/:id', checkAuth, deleteCollaborator);



export default router;