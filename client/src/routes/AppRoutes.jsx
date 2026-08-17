import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProductList from '../pages/ProductList';
import Cart from '../pages/Cart';
import Login from '../pages/Login';
import AdminProducts from '../pages/AdminProducts';
import AdminOrders from '../pages/AdminOrders';
import AdminRoute from './AdminRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        }
      />
    </Routes>
  );
}