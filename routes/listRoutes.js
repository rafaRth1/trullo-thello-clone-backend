import express from 'express';
import {
	createList,
	getLists,
	editList,
	deleteList,
	addCardIdToList,
	udpateCardToList,
} from '../controllers/listController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/', checkAuth, createList);
router.route('/:id').put(checkAuth, editList).delete(checkAuth, deleteList);
router.route('/:idProject').get(checkAuth, getLists);
router.put('/update-list/:id', udpateCardToList);

export default router;
