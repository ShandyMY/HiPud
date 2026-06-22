import express from 'express';
import { createReview, getAllReviews, publishReview, deleteReview, getPublishedReviews } from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// PINTU TERBUKA (PUBLIK)
router.post('/', createReview); // Pembeli mengirim ulasan
router.get('/public', getPublishedReviews); // Pembeli melihat daftar ulasan yang sudah disetujui admin

// PINTU TERGEMBOK (KHUSUS ADMIN)
router.get('/', verifyToken, getAllReviews);
router.put('/:id/publish', verifyToken, publishReview);
router.delete('/:id', verifyToken, deleteReview);

export default router;