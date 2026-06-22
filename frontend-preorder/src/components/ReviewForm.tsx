import { useEffect, useState } from 'react';
import { Send, Star } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../api/axios';

interface ProductOption { id: number; name: string; category?: string | null; }
interface ReviewFormProps { defaultProductId?: number; }

const ReviewForm = ({ defaultProductId }: ReviewFormProps) => {
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    invoiceNumber: '', // <-- Tambahan state
    customerName: '',
    isAnonymous: false,
    productId: defaultProductId ? String(defaultProductId) : '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products?target=public');
        setProducts(response.data);
      } catch (error) {
        console.error('Gagal mengambil produk:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.isAnonymous && !formData.customerName.trim()) return Swal.fire({ icon: 'warning', title: 'Nama belum diisi', text: 'Isi nama atau pilih tampil sebagai anonim.' });
    if (!formData.comment.trim()) return Swal.fire({ icon: 'warning', title: 'Review belum diisi', text: 'Tuliskan pengalamanmu terlebih dahulu.' });
    try {
      setLoading(true);
      const response = await api.post('/reviews', {
        invoiceNumber: formData.invoiceNumber, // <-- Tambahan payload API
        productId: Number(formData.productId),
        customerName: formData.customerName,
        isAnonymous: formData.isAnonymous,
        rating: formData.rating,
        comment: formData.comment
      });
      Swal.fire({ icon: 'success', title: 'Terima kasih!', text: response.data.message || 'Ulasanmu akan ditinjau admin sebelum ditampilkan.' });
      
      // Kosongkan form setelah berhasil
      setFormData({ invoiceNumber: '', customerName: '', isAnonymous: false, productId: defaultProductId ? String(defaultProductId) : '', rating: 5, comment: '' });
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Gagal mengirim', text: error.response?.data?.message || 'Coba lagi beberapa saat lagi.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card mx-auto rounded-[2rem] p-6 text-left md:p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* --- TAMBAHAN KOTAK INVOICE (Desain mengikuti aslinya) --- */}
        <div>
          <label className="hipud-label">Nomor Invoice *</label>
          <input 
            type="text" 
            required 
            placeholder="Contoh: INV-001" 
            className="hipud-input mt-2" 
            value={formData.invoiceNumber} 
            onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })} 
          />
          <p className="mt-1 text-xs text-[#8a7c82]">Anda hanya bisa mengulas produk yang sudah selesai dipesan.</p>
        </div>
        {/* -------------------------------------------------------- */}

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="hipud-label">Nama</label>
            <input disabled={formData.isAnonymous} className="hipud-input mt-2 disabled:bg-white/30" placeholder="Nama yang ingin ditampilkan" value={formData.customerName} onChange={(e) => setFormData({ ...formData, customerName: e.target.value })} />
          </div>
          <div>
            <label className="hipud-label">Menu yang direview (opsional)</label>
            <select className="hipud-input mt-2" value={formData.productId} onChange={(e) => setFormData({ ...formData, productId: e.target.value })}>
              <option value="">Tidak spesifik / umum</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              <option value="">Lainnya</option>
            </select>
          </div>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-3 rounded-full bg-white/65 px-4 py-2 text-sm font-bold text-[#6d5963]">
          <input type="checkbox" checked={formData.isAnonymous} onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })} className="accent-[#f48fb1]" />
          Tampilkan sebagai Anonymous
        </label>
        <div>
          <label className="hipud-label">Rating</label>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} className="transition hover:scale-110">
                <Star size={34} className={star <= formData.rating ? 'fill-amber-400 text-amber-400' : 'fill-pink-100 text-pink-100'} />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="hipud-label">Review</label>
          <textarea className="hipud-input mt-2 min-h-[130px]" placeholder="Ceritakan rasa, packaging, pelayanan, atau pengalaman manismu bersama Hipud." value={formData.comment} onChange={(e) => setFormData({ ...formData, comment: e.target.value })} />
        </div>
        <button disabled={loading} className="hipud-btn inline-flex w-full items-center justify-center gap-2 py-4 font-black disabled:opacity-60"><Send size={18} /> {loading ? 'Mengirim...' : 'Kirim Ulasan'}</button>
      </form>
    </div>
  );
};

export default ReviewForm;