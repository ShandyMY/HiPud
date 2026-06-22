import express from 'express';
import multer from 'multer';
import { createProduct, deleteProduct, getActiveBatchSchedule, getProducts, updateProduct, uploadProductImage } from '../controllers/productController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = express.Router();
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, 'uploads/'),
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = file.originalname.split('.').pop();
        cb(null, `productImage-${uniqueSuffix}.${ext}`);
    }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
router.get('/', getProducts);
router.get('/schedule/active', getActiveBatchSchedule);
router.post('/upload-image', verifyToken, upload.single('productImage'), uploadProductImage);
router.post('/', verifyToken, createProduct);
router.put('/:id', verifyToken, updateProduct);
router.delete('/:id', verifyToken, deleteProduct);
export default router;
//# sourceMappingURL=productRoutes.js.map