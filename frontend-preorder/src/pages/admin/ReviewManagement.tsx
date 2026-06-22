import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Star } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../api/axios';

interface Review {
  id: number;
  customerName: string;
  isAnonymous?: boolean;
  rating: number;
  comment: string;
  isPublished: boolean;
  createdAt: string;
  product?: { name: string } | null;
}

const FILTERS = [
  { key: 'all', label: 'Semua' },
  { key: 'pending', label: 'Pending' },
  { key: 'shown', label: 'Tampil' },
  { key: 'hidden', label: 'Tidak Tampil' },
];

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const token = localStorage.getItem('adminToken');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reviews', { headers: { Authorization: `Bearer ${token}` } });
      setReviews(response.data);
    } catch (error) {
      console.error('Gagal mengambil ulasan:', error);
      Swal.fire({ icon: 'error', title: 'Ulasan gagal dimuat' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const loadReviews = async () => {
      try {
        setLoading(true);
        const response = await api.get('/reviews', { headers: { Authorization: `Bearer ${token}` } });
        if (active) setReviews(response.data);
      } catch (error) {
        console.error('Gagal mengambil ulasan:', error);
        if (active) Swal.fire({ icon: 'error', title: 'Ulasan gagal dimuat' });
      } finally {
        if (active) setLoading(false);
      }
    };

    loadReviews();
    return () => {
      active = false;
    };
  }, [token]);

  const filteredReviews = useMemo(() => {
    if (activeFilter === 'shown') return reviews.filter((review) => review.isPublished);
    if (activeFilter === 'pending' || activeFilter === 'hidden') return reviews.filter((review) => !review.isPublished);
    return reviews;
  }, [activeFilter, reviews]);

  const filterCounts = useMemo(
    () => ({
      all: reviews.length,
      pending: reviews.filter((review) => !review.isPublished).length,
      shown: reviews.filter((review) => review.isPublished).length,
      hidden: reviews.filter((review) => !review.isPublished).length,
    }),
    [reviews]
  );

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return '0.0';
    const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const updateStatus = async (id: number, isPublished: boolean) => {
    try {
      await api.put(`/reviews/${id}/publish`, { isPublished }, { headers: { Authorization: `Bearer ${token}` } });
      fetchReviews();
      Swal.fire({
        icon: 'success',
        title: isPublished ? 'Ulasan ditampilkan' : 'Ulasan disembunyikan',
        timer: 1200,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({ icon: 'error', title: 'Gagal mengubah status' });
    }
  };

  // CATATAN REVISI: Fungsi deleteReview dan konfirmasi Swal-nya sudah dihilangkan sepenuhnya

  const renderStars = (rating: number) => (
    <div className="flex gap-1" aria-label={`${rating} dari 5 bintang`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={15}
          className={star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-[#f2d6e2] text-[#f2d6e2]'}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <section className="admin-soft-panel reveal-up p-5 sm:p-6">
        <div className="flex flex-wrap gap-3">
          {[
            ['Total ulasan', filterCounts.all],
            ['Menunggu', filterCounts.pending],
            ['Tampil', filterCounts.shown],
            ['Rating rata-rata', averageRating],
          ].map(([label, value]) => (
            <div key={label} className="admin-stat-chip pressable">
              <span>{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-filter-shell reveal-up p-2.5" style={{ animationDelay: '.06s' }}>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-black transition active:scale-[0.98] ${
                activeFilter === filter.key
                  ? 'bg-[#f48fb1] text-white shadow-md shadow-pink-200/70'
                  : 'bg-white/66 text-[#6d5963] hover:bg-white'
              }`}
            >
              {filter.label}
              <span className="ml-2 rounded-md bg-white/35 px-2 py-0.5 text-[11px]">{filterCounts[filter.key as keyof typeof filterCounts] || 0}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {loading ? (
          <div className="glass-admin-card col-span-full p-10 text-center font-bold text-[#8a7c82]">Memuat ulasan...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="glass-admin-card col-span-full p-10 text-center font-bold text-[#8a7c82]">Belum ada ulasan pada filter ini.</div>
        ) : (
          filteredReviews.map((review) => (
            <article key={review.id} className="glass-admin-card surface-hover reveal-up p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-black text-[#3f2e35]">{review.isAnonymous ? 'Anonymous' : review.customerName}</p>
                  <p className="mt-1 text-xs font-bold text-[#8a7c82]">{new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <span className={`admin-pill ${review.isPublished ? 'bg-[#b9e5c9]/70 text-[#37684a]' : 'bg-[#ffe8a3]/80 text-[#8b6816]'}`}>
                  {review.isPublished ? 'Tampil' : 'Pending'}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {renderStars(review.rating)}
                {review.product && (
                  <span className="admin-pill bg-[#ddefff] text-[#4f6c86]">{review.product.name}</span>
                )}
              </div>

              <p className="mt-4 text-sm font-medium leading-relaxed text-[#6d5963]">"{review.comment}"</p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                {!review.isPublished && (
                  <button onClick={() => updateStatus(review.id, true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b9e5c9]/70 px-4 py-2.5 text-sm font-black text-[#37684a]">
                    <Eye size={16} /> Tampilkan
                  </button>
                )}
                {review.isPublished && (
                  <button onClick={() => updateStatus(review.id, false)} className="inline-flex items-center justify-center gap-2 rounded-full bg-white/75 px-4 py-2.5 text-sm font-black text-[#8a7c82]">
                    <EyeOff size={16} /> Sembunyikan
                  </button>
                )}
                {/* CATATAN REVISI: Tombol hapus sudah dicabut dari sini */}
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
};

export default ReviewManagement;