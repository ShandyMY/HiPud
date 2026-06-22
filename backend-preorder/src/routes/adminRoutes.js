import express from 'express';
import { loginAdmin, getDashboardStats, getAdminSession } from '../controllers/adminController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; // Satpam token
const router = express.Router();
// Rute Login (Pintu Terbuka, karena Admin butuh masuk pertama kali)
router.post('/login', loginAdmin);
// Rute Mengambil Data Statistik (Pintu Tergembok, wajib bawa token dari frontend)
router.get('/stats', verifyToken, getDashboardStats);
router.get('/session', verifyToken, getAdminSession);
export default router;
//# sourceMappingURL=adminRoutes.js.map