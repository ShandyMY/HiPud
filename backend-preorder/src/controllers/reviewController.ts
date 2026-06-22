import { Request, Response } from 'express';
import prisma from '../config/database.js';

// Pembeli mengirim ulasan baru. Ulasan tidak wajib invoice/order.
export const createReview = async (req: Request, res: Response): Promise<any> => {
  try {
    const { productId, customerName, isAnonymous, rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating dan review wajib diisi.' });
    }

    const newReview = await prisma.review.create({
      data: {
        productId: productId ? Number(productId) : null,
        customerName: isAnonymous ? 'Anonymous' : (customerName || 'Anonymous'),
        isAnonymous: Boolean(isAnonymous),
        rating: Number(rating),
        comment: String(comment),
      },
      include: { product: true }
    });

    res.status(201).json({ success: true, message: 'Terima kasih! Ulasanmu akan ditinjau admin sebelum ditampilkan.', data: newReview });
  } catch (error) {
    console.error('Gagal mengirim ulasan:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server saat mengirim ulasan.' });
  }
};

export const getAllReviews = async (_req: Request, res: Response) => {
  try {
    const reviews = await prisma.review.findMany({ include: { product: true }, orderBy: { createdAt: 'desc' } });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data ulasan', error });
  }
};

export const publishReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;
    const updatedReview = await prisma.review.update({ where: { id: Number(id) }, data: { isPublished: Boolean(isPublished) } });
    res.status(200).json({ message: 'Status ulasan berhasil diperbarui!', data: updatedReview });
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengubah status ulasan', error });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({ where: { id: Number(id) } });
    res.status(200).json({ message: 'Ulasan berhasil dihapus!' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus ulasan', error });
  }
};

export const getPublishedReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.query;
    const whereClause: any = { isPublished: true };
    if (productId) whereClause.productId = Number(productId);
    const reviews = await prisma.review.findMany({ where: whereClause, include: { product: true }, orderBy: { createdAt: 'desc' } });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil ulasan publik', error });
  }
};
