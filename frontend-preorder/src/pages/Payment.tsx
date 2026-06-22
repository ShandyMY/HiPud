import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, MessageCircle, Receipt, Upload } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { invoiceNumber, dpAmount, customerName } = location.state || {};
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!invoiceNumber) {
    return (
      <div className="grid min-h-screen place-items-center px-5 text-center">
        <div className="glass-card max-w-lg rounded-[2rem] p-10">
          <AlertCircle className="mx-auto mb-5 text-amber-500" size={62} />
          <h1 className="font-display text-3xl font-black">Data pembayaran tidak ditemukan</h1>
          <p className="mt-3 text-[#8a7c82]">Sesi pembayaran kedaluwarsa atau tidak valid.</p>
          <button onClick={() => navigate('/')} className="hipud-btn mt-7 px-7 py-3 font-black">Kembali ke Home</button>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFile(null);
      e.target.value = '';
      Swal.fire({ icon: 'warning', title: 'File terlalu besar', text: 'Maksimal ukuran bukti pembayaran adalah 5MB.' });
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return Swal.fire({ icon: 'warning', title: 'Pilih bukti pembayaran', text: 'Upload file JPG/PNG terlebih dahulu.' });
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('orderId', invoiceNumber);
      formData.append('proofImage', file);
      await api.post('/payments', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setIsSuccess(true);
    } catch (error) {
      console.error('Gagal upload bukti:', error);
      Swal.fire({ icon: 'error', title: 'Gagal mengunggah', text: 'Terjadi kesalahan sistem. Coba lagi atau hubungi admin.' });
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsApp = () => {
    const adminWA = '628123456789';
    const message = `Halo Admin Hi Pud, saya ${customerName}. Saya sudah kirim bukti transfer DP untuk Invoice: *${invoiceNumber}*. Mohon dicek ya.`;
    window.open(`https://wa.me/${adminWA}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const cancelOrder = async () => {
    const result = await Swal.fire({ title: 'Batalkan pesanan?', text: 'Pesanan akan ditandai batal.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya, batalkan', cancelButtonText: 'Kembali' });
    if (!result.isConfirmed) return;
    try {
      await api.put(`/orders/${invoiceNumber}/cancel`);
      Swal.fire({ icon: 'success', title: 'Pesanan dibatalkan' });
      navigate('/');
    } catch {
      Swal.fire({ icon: 'error', title: 'Gagal membatalkan', text: 'Silakan hubungi admin.' });
    }
  };

  return (
    <div className="min-h-screen px-5 py-12 md:px-10">
      <div className="mx-auto max-w-xl">
        <div className="glass-card overflow-hidden rounded-[2rem]">
          <div className="bg-[#fff9fb]/80 p-8 text-center">
            {isSuccess ? <CheckCircle className="mx-auto mb-4 text-[#f48fb1]" size={58} /> : <Receipt className="mx-auto mb-4 text-[#f48fb1]" size={58} />}
            <h1 className="font-display text-3xl font-black">{isSuccess ? 'Bukti Pembayaran Terkirim' : 'Konfirmasi Pembayaran'}</h1>
            <p className="mt-2 text-[#8a7c82]">Invoice <b>{invoiceNumber}</b></p>
          </div>

          {isSuccess ? (
            <div className="p-8 text-center">
              <p className="text-[#8a7c82]">Bukti pembayaran berhasil dikirim. Pesananmu sedang menunggu verifikasi admin melalui WhatsApp.</p>
              <div className="mt-8 flex flex-col gap-3">
                <button onClick={sendWhatsApp} className="hipud-btn inline-flex items-center justify-center gap-2 px-6 py-4 font-black"><MessageCircle size={20} /> Chat Admin</button>
                <button onClick={() => navigate('/')} className="hipud-outline-btn px-6 py-4 font-black">Kembali ke Home</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 p-8">
              <div className="rounded-[1.5rem] bg-[#f8dce8]/50 p-5 text-center">
                <p className="text-sm font-bold text-[#8a7c82]">Total DP yang harus dibayar</p>
                <p className="mt-1 font-display text-4xl font-black text-[#964261]">Rp {Number(dpAmount).toLocaleString('id-ID')}</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/70 p-6 text-center">
                <p className="mb-4 text-xs font-black uppercase tracking-[.2em] text-[#8a7c82]">Scan QRIS Berikut</p>
                <div className="mx-auto grid h-40 w-40 place-items-center rounded-2xl bg-white shadow-inner">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=HIPUD-PREORDER-DP" alt="QRIS Hi Pud" className="h-32 w-32" />
                </div>
                <p className="mt-5 text-sm text-[#8a7c82]">Atau transfer manual ke:</p>
                <p className="font-black text-[#3f2e35]">BCA 123-456-7890</p>
                <p className="text-sm text-[#8a7c82]">A/N: Hi Pud</p>
              </div>
              <div>
                <label className="hipud-label">Upload Bukti Transfer *</label>
                <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleFileChange} className="hipud-input mt-2" />
                <p className="mt-2 text-xs text-[#8a7c82]">Format JPG/PNG. Maksimal ukuran file 5MB.</p>
              </div>
              <button disabled={loading} className="hipud-btn inline-flex w-full items-center justify-center gap-2 py-4 font-black disabled:opacity-60"><Upload size={20} /> {loading ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}</button>
              <button type="button" onClick={sendWhatsApp} className="hipud-outline-btn inline-flex w-full items-center justify-center gap-2 py-4 font-black"><MessageCircle size={20} /> Chat Admin</button>
              <button type="button" onClick={cancelOrder} className="w-full py-2 text-sm font-bold text-[#8a7c82] hover:text-red-500">Batalkan Pesanan Ini</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
