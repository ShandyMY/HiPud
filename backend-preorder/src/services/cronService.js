import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const initCronJobs = () => {
    // Berjalan setiap jam (menit ke-0)
    cron.schedule('0 * * * *', async () => {
        console.log('--- Menjalankan Tugas Pembersihan Pesanan Terbengkalai ---');
        const limitTime = new Date();
        limitTime.setHours(limitTime.getHours() - 24); // Mundur 24 jam ke belakang
        try {
            const result = await prisma.order.updateMany({
                where: {
                    status: 'PENDING',
                    createdAt: { lt: limitTime } // lt = less than (lebih lama dari 24 jam)
                },
                data: {
                    status: 'DIBATALKAN'
                }
            });
            if (result.count > 0) {
                console.log(`${result.count} pesanan otomatis dibatalkan karena melewati 24 jam.`);
            }
        }
        catch (error) {
            console.error('Gagal menjalankan auto-cancel:', error);
        }
    });
};
//# sourceMappingURL=cronService.js.map