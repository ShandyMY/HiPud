import { Request, Response } from 'express';
import prisma from '../config/database.js';

// Fitur Mengunggah Bukti Pembayaran
export const createPayment = async (req: Request, res: Response): Promise<any> => {
  try {
    // 1. Menerima data dari form (orderId dari frontend berisi Invoice "INV-XXX")
    const invoiceNumber = req.body.orderId; 
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "File bukti pembayaran tidak ditemukan!" });
    }

    // 2. Cari pesanan asli berdasarkan Invoice Number
    const order = await prisma.order.findFirst({
      where: { invoiceNumber: invoiceNumber }
    });

    if (!order) {
      return res.status(404).json({ message: "Pesanan dengan invoice tersebut tidak ditemukan." });
    }

    const imageUrl = `/uploads/${file.filename}`;

    // 3. Simpan bukti transfer ke tabel Payment menggunakan ID asli
    const newPayment = await prisma.payment.create({
      data: {
        orderId: order.id,
        proofImageUrl: imageUrl
      }
    });

    // 4. Update tabel Order agar frontend Admin bisa membaca foto dan statusnya
    await prisma.order.update({
      where: { id: order.id },
      data: { 
        proofImage: imageUrl // Simpan URL gambar di tabel Order agar mudah dibaca Admin
        // Catatan: Status tetap PENDING agar Admin bisa melakukan verifikasi manual
      }
    });

    res.status(201).json({ 
      success: true,
      message: "Bukti pembayaran berhasil dikirim!", 
      data: newPayment 
    });
  } catch (error) {
    console.error("Gagal memproses pembayaran:", error);
    res.status(500).json({ message: "Gagal memproses pembayaran", error });
  }
};

// Fitur Menampilkan Semua Bukti Pembayaran (Untuk Admin)
export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        order: true 
      },
      orderBy: { uploadedAt: 'desc' } 
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data pembayaran", error });
  }
};

// Fitur Menghapus Bukti Pembayaran (DELETE)
export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.payment.delete({
      where: { id: Number(id) }
    });
    res.status(200).json({ message: "Bukti pembayaran berhasil dihapus!" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus pembayaran", error });
  }
};