import { useEffect, useMemo, useState } from 'react';
import { Quote, Star, UserCircle } from 'lucide-react';
import api from '../api/axios';

interface Review {
  id: number;
  customerName: string;
  isAnonymous?: boolean;
  rating: number;
  comment: string;
  createdAt: string;
  product?: { name: string } | null;
}

const CustomerReviews = ({ productId }: { productId?: number }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicReviews = async () => {
      try {
        setLoading(true);
        const url = productId ? `/reviews/public?productId=${productId}` : '/reviews/public';
        const response = await api.get(url);
        setReviews(response.data);
      } catch (error) {
        console.error('Gagal mengambil ulasan:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicReviews();
  }, [productId]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const renderStars = (rating: number) => <div className="flex gap-1">{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={16} className={star <= rating ? 'fill-amber-400 text-amber-400' : 'fill-pink-100 text-pink-100'} />)}</div>;

  return (
    <div>
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="mb-3 text-sm font-black uppercase tracking-[.25em] text-[#f48fb1]">Social Proof</p>
          <h2 className="font-display text-3xl font-black md:text-4xl">Apa Kata Mereka Tentang Hipud?</h2>
          <p className="mt-4 max-w-2xl text-[#8a7c82]">Cerita manis dari pelanggan yang sudah mencoba menu Hipud.</p>
        </div>
        <div className="glass-card rounded-[1.5rem] px-6 py-4"><p className="font-display text-3xl font-black text-[#f48fb1]">{reviews.length > 0 ? `${avgRating.toFixed(1)}/5` : '-'}</p><p className="text-sm font-bold text-[#8a7c82]">Rating pelanggan</p></div>
      </div>
      {loading ? <div className="py-10 text-center text-[#8a7c82]">Memuat ulasan...</div> : null}
      {!loading && reviews.length === 0 ? (
        <div className="rounded-[2rem] bg-white/70 p-10 text-center text-[#8a7c82]">Belum ada ulasan yang dipublikasikan.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((review) => (
          <article key={review.id} className="glass-card relative overflow-hidden rounded-[2rem] p-6">
            <Quote className="absolute -right-2 -top-2 text-[#f8dce8]" size={78} />
            {renderStars(review.rating)}
            <p className="mt-5 min-h-[96px] text-sm italic leading-relaxed text-[#6d5963]">“{review.comment}”</p>
            {review.product && <span className="mt-4 inline-block rounded-full bg-[#ddefff] px-3 py-1 text-xs font-black text-[#50606e]">Review: {review.product.name}</span>}
            <div className="mt-5 flex items-center gap-3 border-t border-pink-100 pt-4">
              <UserCircle className="text-[#f48fb1]" size={38} />
              <div><p className="font-black text-[#3f2e35]">{review.isAnonymous ? 'Anonymous' : review.customerName}</p><p className="text-xs text-[#8a7c82]">{new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
            </div>
          </article>
        ))}
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
