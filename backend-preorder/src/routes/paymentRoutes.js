import express from 'express';
import multer from 'multer';
import { createPayment, getPayments, deletePayment } from '../controllers/paymentController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = express.Router();
// KONFIGURASI MULTER (PENERJEMAH FILE)
const storage = multer.diskStorage({
    // Tentukan folder tempat foto disimpan
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Pastikan folder 'uploads' sudah dibuat secara manual!
    },
    // Buat nama file unik agar tidak saling timpa
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + ext);
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Batas 5MB
});
// PINTU TERBUKA (Publik / Pembeli)
// Gunakan upload.single('proofImage') untuk menangkap file
router.post('/', upload.single('proofImage'), createPayment);
// PINTU TERGEMBOK (Hanya Admin)
router.get('/', verifyToken, getPayments);
router.delete('/:id', verifyToken, deletePayment);
export default router;
//# sourceMappingURL=paymentRoutes.js.map