import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path'; // <-- 1. Tambahkan ini di atas
import { fileURLToPath } from 'url'; // <-- 2. Tambahkan ini untuk ES Module

import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import { initCronJobs } from './services/cronService.js';

// Konfigurasi __dirname untuk ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000; // <-- Gunakan port dari server atau default 5000

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads')); 

// API ROUTES
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

// 3. SEJALKAN DENGAN FRONTEND REACT (VITE) Kamu
// Arahkan server untuk membaca folder 'dist' hasil build frontend kamu
app.use(express.static(path.join(__dirname, '../../frontend-preorder/dist')));

// 4. Tangani rute halaman utama agar membaca index.html milik frontend
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend-preorder/dist/index.html'));
});

initCronJobs();

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Server berjalan dengan aman!`);
  console.log(`=========================================`);
});