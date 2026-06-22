import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

interface AuthRequest extends Request {
  user?: {
    role?: string;
    username?: string;
  };
}

// 1. FITUR LOGIN ADMIN
export const loginAdmin = async (req: Request, res: Response): Promise<any> => {
  try {
    const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password.trim() : '';

    // Memanggil username dan password dari "Brankas Rahasia" (.env)
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    // Jika .env belum dikonfigurasi, tolak akses demi keamanan
    if (!validUsername || !validPassword) {
      console.error("CRITICAL ERROR: ADMIN_USERNAME atau ADMIN_PASSWORD belum diatur di .env!");
      return res.status(500).json({ success: false, message: "Konfigurasi server tidak lengkap." });
    }

    const isEnvCredential = username === validUsername && password === validPassword;
    const isLocalDevCredential = process.env.NODE_ENV !== 'production' && username === 'admin' && password === 'admin123';

    // Mencocokkan inputan dengan data di .env. Fallback dev menjaga login lokal tetap bisa dipakai
    // ketika XAMPP/terminal membaca env yang berbeda dari file project.
    if (isEnvCredential || isLocalDevCredential) {
      // Jika cocok, buatkan Token Kunci yang berlaku selama 1 hari (24h)
      const token = jwt.sign(
        { role: 'superadmin', username: username }, 
        process.env.JWT_SECRET || 'rahasia_negara_123',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: "Login berhasil",
        token: token
      });
    }

    // Jika salah password/username
    return res.status(401).json({ success: false, message: "Username atau Password salah!" });

  } catch (error) {
    console.error("Error saat login:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
};

// 2. FITUR MENGAMBIL DATA STATISTIK DASHBOARD
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalProducts,
      totalOrders,
      pendingOrders,
      pendingPaymentOrders,
      pendingVerificationOrders,
      totalReviews,
      pendingReviewsCount,
      uniqueCustomers,
      successfulOrders,
      recentOrders,
      activeProducts,
      pendingReviews
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'PENDING', proofImage: null } }),
      prisma.order.count({ where: { status: 'PENDING', proofImage: { not: null } } }),
      prisma.review.count(),
      prisma.review.count({ where: { isPublished: false } }),
      prisma.order.groupBy({ by: ['whatsappNumber'] }),
      prisma.order.findMany({
        where: { status: { in: ['DIPROSES', 'SELESAI'] } },
        select: { totalAmount: true }
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          invoiceNumber: true,
          customerName: true,
          totalAmount: true,
          status: true,
          proofImage: true,
          createdAt: true
        }
      }),
      prisma.product.findMany({
        take: 5,
        where: { isActive: true, isOrderable: true },
        orderBy: [{ category: 'asc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          name: true,
          category: true,
          variant: true,
          isActive: true,
          isOrderable: true
        }
      }),
      prisma.review.findMany({
        take: 5,
        where: { isPublished: false },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          customerName: true,
          isAnonymous: true,
          rating: true,
          comment: true,
          isPublished: true,
          createdAt: true
        }
      })
    ]);

    const totalCustomers = uniqueCustomers.length;
    const totalRevenue = successfulOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        pendingOrders,
        pendingPaymentOrders,
        pendingVerificationOrders,
        totalCustomers,
        totalReviews,
        pendingReviews: pendingReviewsCount,
        totalRevenue,
        recentOrders,
        activeProducts,
        recentPendingReviews: pendingReviews
      }
    });

  } catch (error) {
    console.error("Gagal mengambil statistik:", error);
    res.status(500).json({ success: false, message: "Gagal memuat data dashboard" });
  }
};

export const getAdminSession = async (req: AuthRequest, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      role: req.user?.role || 'superadmin',
      username: req.user?.username || 'admin'
    }
  });
};
