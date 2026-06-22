import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Camera,
  ChevronDown,
  Clock,
  HelpCircle,
  MapPin,
  MessageCircle,
  Navigation,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
} from 'lucide-react';
import Catalog from './Catalog';
import CustomerReviews from '../components/CustomerReviews';
import ReviewForm from '../components/ReviewForm';
import { CartContext } from '../context/CartContext';
import api from '../api/axios';
import hipudLogo from '../assets/hipud-logo-cropped.png';
import stickerImage from '../assets/stikerID.png';
import storyMochiImage from '../assets/cream-no-background.png';

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

interface BatchSchedule {
  orderStartDate: string;
  orderEndDate: string;
  readyStartDate: string;
  readyEndDate: string;
  orderDateText: string;
  readyDateText: string;
  status: string;
  note: string;
  products?: Array<{ id: number; name: string }>;
}

const preorderSteps = [
  ['Cek tanggal ketersediaan', 'Pastikan tanggal ready masih tersedia dan pemesanan dilakukan minimal H-1.'],
  ['Pilih menu', 'Pilih menu mochi yang sedang tersedia untuk batch pemesanan.'],
  ['Isi data', 'Lengkapi nama, nomor WhatsApp, jumlah pesanan, dan catatan tambahan jika ada.'],
  ['Pilih pribadi atau danus', 'Pribadi hanya untuk pickup ke alamat rumah produksi. Danus bisa diantar khusus area UNPAD Jatinangor.'],
  ['Bayar DP 50% dan upload bukti', 'Pesanan diproses setelah bukti DP berhasil dikirim.'],
  ['Lanjut konfirmasi WhatsApp admin', 'Konfirmasi ke WhatsApp admin wajib dilakukan agar pesanan segera diverifikasi.'],
];

const navItems = [
  ['Home', 'home'],
  ['Menu', 'menu'],
  ['Pre-Order', 'preorder'],
  ['Jadwal', 'jadwal'],
  ['Review', 'review'],
  ['FAQ', 'faq'],
];

const adminWhatsAppNumber = '628123456789';
const productionPickupLocation = 'Komplek Duta Family C3, Parakanmuncang';

const Home = () => {
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [batchSchedule, setBatchSchedule] = useState<BatchSchedule | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setScheduleLoading(true);
        const response = await api.get('/products/schedule/active');
        setBatchSchedule(response.data.data);
      } catch (error) {
        console.error('Gagal mengambil jadwal batch:', error);
        setBatchSchedule(null);
      } finally {
        setScheduleLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const faqs = [
    ['Apa itu sistem pre-order Hipud?', 'Pre-order berarti produk dibuat sesuai batch agar produksi lebih rapi dan mochi tetap fresh.'],
    ['Kenapa harus bayar DP 50%?', 'DP membantu mengamankan slot produksi. Sisa pembayaran dilakukan saat pesanan diambil atau diantar.'],
    ['Apa bedanya Pribadi dan Danus?', 'Pribadi hanya pickup ke rumah produksi. Danus bisa diantar khusus area UNPAD Jatinangor.'],
    ['Kapan bisa memilih tanggal pengambilan?', 'Tanggal pengambilan mengikuti jadwal ready batch dan pemesanan wajib minimal H-24 jam.'],
    ['Apakah bisa pesan lebih dari satu menu?', 'Bisa. Keranjang mendukung beberapa menu dan jumlah masing-masing produk bisa diubah.'],
  ];

  const goStandSchedule = () => {
    setTimeout(() => scrollTo('jadwal'), 0);
  };

  return (
    <main className="min-h-screen overflow-hidden text-[#3f2e35]">
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/60 bg-white/72 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-10">
          <button onClick={() => scrollTo('home')} className="pressable flex items-center gap-3 text-left">
            <img src={hipudLogo} alt="Hipud Sweet and Fresh" className="h-12 w-auto object-contain sm:h-14" />
            <span className="hidden text-xs font-bold uppercase tracking-[.2em] text-[#8a7c82] sm:inline">Homemade Mochi</span>
          </button>
          <div className="hidden items-center gap-6 text-sm font-bold text-[#6d5963] lg:flex">
            {navItems.map(([label, target]) => (
              <button key={target} onClick={() => scrollTo(target)} className="transition hover:text-[#f48fb1]">
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/checkout')} className="pressable relative rounded-2xl bg-white/80 p-3 shadow-sm transition hover:bg-white">
              <ShoppingBag size={20} className="text-[#964261]" />
              {cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-2xl bg-[#f48fb1] text-[10px] font-black text-white">{cartCount}</span>}
            </button>
            <button onClick={() => scrollTo('preorder')} className="hipud-btn pressable hidden px-5 py-3 text-sm font-black md:inline-flex">Pesan Sekarang</button>
          </div>
        </div>
      </nav>

      <section id="home" className="relative min-h-[90vh] overflow-hidden px-5 pb-20 pt-32 md:px-12 md:pt-36 xl:px-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fff9fb] via-[#fff9fb]/92 to-[#f8dce8]/72" />
        <div className="absolute left-[-12%] top-24 h-72 w-72 rounded-full bg-[#ddefff]/45 blur-[85px]" />
        <div className="absolute bottom-12 right-[-10%] h-96 w-96 rounded-full bg-[#f8dce8]/70 blur-[100px]" />
        <div className="relative z-10 mx-auto grid min-h-[calc(90vh-8rem)] max-w-7xl items-center gap-10 lg:grid-cols-[.92fr_1fr]">
          <div className="order-2 flex justify-center lg:order-1 lg:justify-start">
            <div className="hero-sticker-stage">
              <div className="hero-sticker-glass" />
              <img src={stickerImage} alt="Varian mochi Hipud" className="hero-sticker-float relative z-10 w-full max-w-[360px] drop-shadow-[0_30px_42px_rgba(150,66,97,0.22)] sm:max-w-[430px]" />
            </div>
          </div>

          <div className="order-1 max-w-2xl reveal-up lg:order-2">
            <h1 className="font-display text-[2.8rem] font-black leading-[1.08] text-[#3f2e35] md:text-[4.25rem]">
              Welcome to Hipud
            </h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-[#6d5963] md:text-lg">
              Spesialis aneka mochi tersedia online, offline, dan danus.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <button onClick={() => scrollTo('preorder')} className="hipud-btn pressable inline-flex items-center gap-2 px-7 py-4 font-black"><ShoppingBag size={19} /> Quick Pre-Order</button>
              <button onClick={() => scrollTo('menu')} className="hipud-outline-btn pressable px-7 py-4 font-black">Lihat Menu</button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 md:px-12 xl:px-28">
        <div className="glass-card mx-auto grid max-w-5xl gap-4 rounded-[2rem] px-6 py-5 text-sm font-black text-[#6d5963] md:grid-cols-3 md:px-8">
          <span className="inline-flex items-center gap-2"><Sparkles size={18} className="text-[#f48fb1]" /> All made fresh daily</span>
          <span className="inline-flex items-center gap-2"><Truck size={18} className="text-[#f48fb1]" /> Bisa pilih pribadi / antar untuk Danus</span>
          <span className="inline-flex items-center gap-2"><MessageCircle size={18} className="text-[#f48fb1]" /> Trusted by Customers</span>
        </div>
      </section>

      <section id="about" className="hipud-section">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[.92fr_1.08fr]">
          <div className="relative min-h-[380px] lg:min-h-[520px]">
            <img
              src={storyMochiImage}
              alt="Box mochi Hipud tanpa latar belakang"
              className="story-product-float mx-auto w-full max-w-[560px] object-contain drop-shadow-[0_34px_46px_rgba(150,66,97,0.22)]"
            />
          </div>
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-black uppercase tracking-[.25em] text-[#f48fb1]">Brand Story</p>
            <h2 className="font-display text-3xl font-black md:text-4xl">Kenalan dengan Hipud</h2>
            <p className="mt-5 text-base leading-8 text-[#8a7c82]">
              Hipud adalah brand dessert mochi homemade yang berdiri sejak Maret 2023 dan melayani area Kabupaten Bandung serta Jatinangor. Kami menghadirkan mochi dengan sweet treats, fresh tiap waktu, serta proses pemesanan yang lebih tertata melalui sistem pre-order.
            </p>
            <p className="mt-4 text-base leading-8 text-[#8a7c82]">
              Kamu bisa menemukan Hipud melalui beberapa pilihan pemesanan. Untuk offline, Hipud hadir setiap Minggu pagi di stand Kencana. Untuk online dan danus, pelanggan dapat melakukan quick pre-order sesuai jadwal batch yang tersedia.
            </p>
            <div className="mt-6 grid gap-3 text-sm font-bold text-[#6d5963]">
              {[
                'Mochi dibuat homemade dengan tekstur lembut dan rasa fresh.',
                'Bisa pilih pembelian online, offline, atau danus area Jatinangor.',
                'Sistem PO dibuat jelas agar slot produksi dan pengambilan lebih tertata.',
              ].map((item) => (
                <span key={item} className="inline-flex items-start gap-3">
                  <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#f48fb1] text-[11px] font-black text-white">✓</span>
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={goStandSchedule} className="hipud-outline-btn pressable px-5 py-3 text-sm font-black">Lihat Jadwal Offline</button>
              <button onClick={() => scrollTo('steps')} className="hipud-btn pressable px-5 py-3 text-sm font-black">Quick Pre-Order</button>
            </div>
          </div>
        </div>
      </section>

      <section id="menu" className="hipud-section bg-white/35">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[.25em] text-[#f48fb1]">Katalog Brand</p>
            <h2 className="font-display text-3xl font-black md:text-4xl">Daftar Menu Hipud</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#8a7c82]">Lihat menu lengkap, detail rasa, dan pilihan mochi yang tersedia dari Hipud.</p>
          </div>
          <Catalog mode="all" />
        </div>
      </section>

      <section id="steps" className="hipud-section bg-white/40">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[.25em] text-[#f48fb1]">Order Flow</p>
            <h2 className="font-display text-3xl font-black md:text-4xl">Cara Pre-Order di Hipud</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {preorderSteps.map(([title, text], index) => (
              <div key={title} className="glass-card rounded-[1.8rem] p-5">
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-[#f48fb1] font-black text-white">{index + 1}</div>
                <h3 className="font-display text-base font-black">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8a7c82]">{text}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 rounded-[1.5rem] bg-white/65 px-5 py-4 text-center text-sm font-bold text-[#8a7c82]">
            Catatan: Pemesanan minimal H-24 jam sebelum tanggal pengambilan.
          </p>
        </div>
      </section>

      <section id="preorder" className="hipud-section">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-sm font-black uppercase tracking-[.25em] text-[#f48fb1]">Open Order</p>
              <h2 className="font-display text-3xl font-black md:text-4xl">Quick Pre-Order / Menu PO</h2>
              <p className="mt-4 max-w-2xl text-[#8a7c82]">Pilih cepat dari foto dan nama menu yang sedang open order. Detail lengkap ada di daftar menu utama.</p>
            </div>
            <button onClick={() => navigate('/checkout')} className="hipud-btn pressable px-6 py-3 font-black">Checkout Keranjang</button>
          </div>
          <Catalog mode="orderable" />
        </div>
      </section>

      <section id="jadwal" className="hipud-section">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[.25em] text-[#f48fb1]">Schedule</p>
            <h2 className="font-display text-3xl font-black md:text-4xl">Jadwal & Lokasi</h2>
          </div>
          <div className="glass-card overflow-hidden rounded-[2rem] p-4 sm:p-6">
            <div className="grid gap-4 lg:grid-cols-[.86fr_1.14fr]">
              <div className="grid gap-4">
                <article className="rounded-[1.5rem] bg-white/62 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-[16px] bg-[#f8dce8] text-[#964261]"><CalendarDays size={21} /></span>
                    <div>
                      <h3 className="font-display text-lg font-black">Jadwal PO & Danus</h3>
                      <p className="text-sm font-bold text-[#8a7c82]">Online order mengikuti batch aktif</p>
                    </div>
                  </div>
                  {scheduleLoading ? (
                    <p className="text-sm font-bold text-[#8a7c82]">Memuat jadwal batch...</p>
                  ) : batchSchedule ? (
                    <div className="space-y-3 text-sm leading-relaxed text-[#8a7c82]">
                      <p><span className="font-black text-[#3f2e35]">Order:</span> {batchSchedule.orderDateText}</p>
                      <p><span className="font-black text-[#3f2e35]">Ready:</span> {batchSchedule.readyDateText}</p>
                      <p><span className="font-black text-[#3f2e35]">Pickup:</span> {productionPickupLocation}</p>
                      <p className="inline-flex rounded-full bg-[#b9e5c9]/70 px-4 py-2 font-black text-[#37684a]">Status: {batchSchedule.status}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm leading-relaxed text-[#8a7c82]">
                      <p className="font-black text-[#3f2e35]">Belum ada jadwal PO dan danus yang aktif.</p>
                      <p>Cek Instagram Hipud untuk update batch terbaru.</p>
                      <p><span className="font-black text-[#3f2e35]">Pickup:</span> {productionPickupLocation}</p>
                    </div>
                  )}
                  <button onClick={() => scrollTo('preorder')} className="hipud-btn pressable mt-5 px-5 py-3 text-sm font-black">Quick Pre-Order</button>
                </article>

                <article className="rounded-[1.5rem] bg-white/62 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-[16px] bg-[#ddefff]/80 text-[#4f6c86]"><Store size={21} /></span>
                    <div>
                      <h3 className="font-display text-lg font-black">Open Stand</h3>
                      <p className="text-sm font-bold text-[#8a7c82]">Setiap Minggu pagi</p>
                    </div>
                  </div>
                  <div className="grid gap-3 text-sm font-bold text-[#6d5963]">
                    <span className="inline-flex items-center gap-2"><Clock size={17} className="text-[#f48fb1]" /> 06.30-08.30 WIB</span>
                    <span className="inline-flex items-start gap-2"><MapPin size={17} className="mt-0.5 shrink-0 text-[#f48fb1]" /> Jl. Teratai Raya Blok 9, depan Soto Rawon Kencana, Kabupaten Bandung, Rancaekek.</span>
                  </div>
                </article>
              </div>

              <div className="rounded-[1.5rem] bg-[#fff9fb]/80 p-4">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-lg font-black text-[#3f2e35]">Lokasi Hipud</p>
                    <p className="text-sm font-bold text-[#8a7c82]">Stand Kencana dan area layanan Jatinangor</p>
                  </div>
                  <a
                    href="https://www.instagram.com/reel/DTAh1okD3Sg/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hipud-outline-btn pressable inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-black"
                  >
                    <Navigation size={16} /> Info Lokasi
                  </a>
                </div>
                <iframe
                  title="Peta lokasi Hipud"
                  className="h-[330px] w-full rounded-[1.2rem] border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps?q=Jl.%20Teratai%20Raya%20Blok%209%20Rancaekek%20Kabupaten%20Bandung&output=embed"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="review" className="hipud-section bg-white/35"><div className="mx-auto max-w-7xl"><CustomerReviews /></div></section>
      <section className="hipud-section"><div className="mx-auto max-w-3xl text-center"><h2 className="font-display text-3xl font-black md:text-4xl">Gimana pengalaman manismu bersama Hipud?</h2><p className="mt-4 text-[#8a7c82]">Ulasan bisa dikirim tanpa invoice dan akan dimoderasi admin sebelum tampil.</p><div className="mt-8"><ReviewForm /></div></div></section>

      <section id="faq" className="hipud-section bg-white/35">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center"><HelpCircle className="mx-auto mb-4 text-[#f48fb1]" size={40} /><h2 className="font-display text-3xl font-black md:text-4xl">FAQ</h2></div>
          <div className="space-y-4">{faqs.map(([q, a], i) => <div key={q} className="glass-card overflow-hidden rounded-[1.5rem]"><button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-black"><span>{q}</span><ChevronDown className={`shrink-0 transition ${openFaq === i ? 'rotate-180' : ''}`} /></button>{openFaq === i && <p className="px-5 pb-5 text-sm leading-relaxed text-[#8a7c82]">{a}</p>}</div>)}</div>
        </div>
      </section>

      <footer id="kontak" className="bg-[#3f2e35] px-5 py-14 text-white md:px-12 xl:px-28">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="font-display text-2xl font-black text-[#f8dce8]">Hipud</p><p className="mt-3 text-sm leading-relaxed text-white/70">Spesialis aneka mochi online, offline, dan danus.</p></div>
          <div><p className="font-black">Navigasi</p><div className="mt-4 grid gap-2 text-sm text-white/70">{navItems.map(([label, target]) => <button key={target} onClick={() => scrollTo(target)} className="w-fit text-left hover:text-white">{label}</button>)}</div></div>
          <div>
            <p className="font-black">Kontak</p>
            <div className="mt-4 flex gap-3">
              <a href="https://www.instagram.com/hi.pud" target="_blank" rel="noopener noreferrer" aria-label="Instagram Hipud" className="footer-social-button">
                <Camera size={19} />
              </a>
              <a href={`https://wa.me/${adminWhatsAppNumber}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Hipud" className="footer-social-button">
                <MessageCircle size={19} />
              </a>
              <button onClick={goStandSchedule} aria-label="Jadwal open stand" className="footer-social-button">
                <MapPin size={19} />
              </button>
            </div>
          </div>
          <div><p className="font-black">Info</p><div className="mt-4 space-y-2 text-sm leading-relaxed text-white/70"><p>Kabupaten Bandung & Jatinangor</p><p>Open Stand: Minggu pagi 06.30-08.30</p><p>PO & Danus: mengikuti jadwal batch</p></div></div>
        </div>
      </footer>
    </main>
  );
};

export default Home;
