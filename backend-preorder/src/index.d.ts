import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path'; // <-- Membaca jalur folder
import { fileURLToPath } from 'url'; // <-- Diperlukan untuk ES Module

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { initCronJobs } from './services/cronService.js';

// Konfigurasi __dirname khusus ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Akses gambar uploads
app.use('/uploads', express.static('uploads')); 

// ========================================================
// 1. DAFTAR ROUTE API BACKEND (Tetap Berjalan di Belakang Layar)
// ========================================================
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

// ========================================================
// 2. JEMBATAN UNTUK MEMBACA FRONTEND (REACT / VITE)
// ========================================================
// Memberitahu Express untuk menyajikan file statis dari folder dist milik frontend
app.use(express.static(path.join(__dirname, '../../frontend-preorder/dist')));

// Jika ada orang mengakses halaman apa pun selain API, arahkan ke index.html milik React
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend-preorder/dist/index.html'));
});

initCronJobs();

app.listen(PORT, () => {
  console.log(`🚀 Server Production Aktif dan Menampilkan Frontend!`);
});