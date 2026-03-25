import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getCart)
    .post(protect, addToCart);

router.route('/:productId')
    .delete(protect, removeFromCart);

export default router;
