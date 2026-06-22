import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import { CartProvider } from './context/CartContext';
import ProductManagement from './pages/admin/ProductManagement';

// Import Komponen Admin
import AdminLayout from './layouts/AdminLayout';
import DashboardOverview from './pages/admin/DashboardOverview';
import Login from './pages/admin/Login'; // <-- Import halaman login
import ProtectedRoute from './components/ProtectedRoute'; // <-- Import si Gembok
import OrderManagement from './pages/admin/OrderManagement';
import ReviewManagement from './pages/admin/ReviewManagement';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* RUTE PELANGGAN */}
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />

          {/* RUTE LOGIN ADMIN (Tidak dikunci) */}
          <Route path="/admin/login" element={<Login />} />

          {/* RUTE DASHBOARD ADMIN (Dikunci dengan ProtectedRoute) */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout>
                <DashboardOverview />
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* RUTE PENGELOLAAN PRODUK (Dikunci) */}
          <Route path="/admin/products" element={
            <ProtectedRoute>
              <AdminLayout>
                <ProductManagement />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/orders" element={
         <ProtectedRoute>
           <AdminLayout>
             <OrderManagement />
           </AdminLayout>
         </ProtectedRoute>
       } />

       <Route path="/admin/reviews" element={
         <ProtectedRoute>
           <AdminLayout>
             <ReviewManagement />
           </AdminLayout>
         </ProtectedRoute>
       } />
          
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;