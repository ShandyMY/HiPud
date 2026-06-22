import PDFDocument from 'pdfkit';
// Fungsi ini bertugas menggambar isi PDF berdasarkan data Pesanan
export const buildReceiptPDF = (order) => {
    return new Promise((resolve) => {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];
        // Mengumpulkan pecahan data PDF
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
        // --- MULAI MENGGAMBAR ISI PDF ---
        doc.fontSize(20).text('INVOICE PRE-ORDER', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Nomor Invoice : ${order.invoiceNumber}`);
        doc.text(`Tanggal       : ${order.createdAt.toLocaleDateString('id-ID')}`);
        doc.text(`Pelanggan     : ${order.customerName}`);
        doc.text(`WhatsApp      : ${order.whatsappNumber}`);
        doc.text(`Status        : ${order.status}`);
        doc.moveDown();
        doc.text('------------------------------------------------------------------');
        doc.moveDown();
        doc.text('DETAIL PESANAN:');
        doc.moveDown(0.5);
        // Looping daftar barang yang dibeli
        order.items.forEach((item, index) => {
            doc.text(`${index + 1}. Produk ID: ${item.productId} | Jumlah: ${item.quantity} | Subtotal: Rp${item.subtotal}`);
        });
        doc.moveDown();
        doc.text('------------------------------------------------------------------');
        doc.moveDown();
        // Total Pembayaran
        doc.fontSize(14).text(`Total Belanja : Rp${order.totalAmount}`, { align: 'right' });
        doc.fontSize(12).text(`Total DP (50%) : Rp${order.dpAmount}`, { align: 'right' });
        doc.end(); // Selesai menggambar
    });
};
//# sourceMappingURL=pdfService.js.map