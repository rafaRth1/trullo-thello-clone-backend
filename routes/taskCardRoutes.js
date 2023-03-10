import express from 'express';
import checkAuth from '../middleware/checkAuth.js';
import {
	createComment,
	createTaskCard,
	deleteCard,
	editComment,
	deleteComment,
	getCardsToIds,
	updateCard,
	updateTaskCardToList,
} from '../controllers/taskCardController.js';

const router = express.Router();

router.post('/', createTaskCard);
router.route('/:id').get(getCardsToIds).put(updateCard).delete(deleteCard);
router.put('/order-tasks/:id', updateTaskCardToList);

// Comments

router.post('/comment', createComment);
router.route('/comment/:id').delete(deleteComment).put(editComment);

export default router;
