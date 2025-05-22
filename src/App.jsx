
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import TrackOrder from "./pages/TrackOrder";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminProducts from "./pages/Admin/AdminProducts";
import AdminOrders from "./pages/Admin/AdminOrders";
import NotFound from "./pages/NotFound";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Context Providers
import { CartProvider } from "./contexts/CartContext";
import { AdminProvider } from "./contexts/AdminContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/products" element={<AdminProducts />} />
                  <Route path="/admin/orders" element={<AdminOrders />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
