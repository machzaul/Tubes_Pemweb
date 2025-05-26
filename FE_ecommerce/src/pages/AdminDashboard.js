import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LogoutButton from '../components/LogoutButton';
import AlertContainer from '../components/ui/AlertContainer';
import useAlert from '../hooks/useAlert';
import Rupiah from "../components/Rupiah";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // Menggunakan custom alert hook
  const { alerts, removeAlert, showSuccess, showError, showWarning, showInfo } = useAlert();

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:6543';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data.products || []);
      
      // Tampilkan alert sukses memuat produk
      if (data.products && data.products.length > 0) {
        showInfo(
          `Berhasil memuat ${data.products.length} produk`,
          "Data Dimuat"
        );
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      const errorMessage = 'Gagal memuat produk. Silakan periksa koneksi internet dan coba lagi.';
      setError(errorMessage);
      
      // Tampilkan alert error
      showError(
        errorMessage,
        "Gagal Memuat Data"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteProduct = async (id) => {
    // Cari nama produk untuk konfirmasi
    const product = products.find(p => p.id === id);
    const productName = product ? product.title : 'produk ini';
    
    if (window.confirm(`Apakah Anda yakin ingin menghapus "${productName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Remove the product from local state
        setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
        
        // Tampilkan alert sukses
        showSuccess(
          `Produk "${productName}" berhasil dihapus dari sistem`,
          "Produk Dihapus"
        );
      } catch (err) {
        console.error('Error deleting product:', err);
        
        // Tampilkan alert error
        showError(
          `Gagal menghapus produk "${productName}". Silakan coba lagi.`,
          "Gagal Menghapus"
        );
      }
    }
  };

  const getStockColor = (stock) => {
    if (stock <= 10) return "text-red-500";
    if (stock <= 20) return "text-yellow-500";
    return "text-green-500";
  };

  // Fungsi untuk retry memuat data
  const handleRetry = () => {
    showInfo("Mencoba memuat ulang data produk...", "Memuat Ulang");
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-solid border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Terjadi Kesalahan</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleRetry}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 transition-colors"
                  >
                    Coba Lagi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Alert Container untuk error state juga */}
        <AlertContainer alerts={alerts} onRemoveAlert={removeAlert} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
              <p className="text-sm text-gray-500 mt-1">
                Kelola produk dan inventori Anda
              </p>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/adminorder"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                onClick={() => showInfo("Membuka halaman kelola pesanan", "Navigasi")}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Kelola Pesanan
              </Link>
              <Link
                to="/admin/add-product"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors"
                onClick={() => showInfo("Membuka halaman tambah produk", "Navigasi")}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tambah Produk
              </Link>
              <LogoutButton className="bg-red-900 hover:bg-red-600 text-white px-4 py-2 rounded">
                Keluar
              </LogoutButton>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Produk</dt>
                    <dd className="text-lg font-medium text-gray-900">{products.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Tersedia</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {products.filter(p => p.stock > 0).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.632 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Stok Rendah</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {products.filter(p => p.stock <= 10 && p.stock > 0).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Stok Habis</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {products.filter(p => p.stock === 0).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Inventori Produk</h2>
              <div className="relative max-w-xs w-md mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-1.5 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600 uppercase tracking-wider mt-4">
              <div className="col-span-5">PRODUK</div>
              <div className="col-span-2 text-center">HARGA</div>
              <div className="col-span-2 text-center">STOK</div>
              <div className="col-span-3 text-center">AKSI</div>
            </div>
          </div>

          {/* Product List */}
          <div className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-2-2m0 0l-2 2m2-2v6m-4 6l2 2m0 0l2-2m-2 2V15" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada produk ditemukan</h3>
                <p className="mt-1 text-sm text-gray-500">Mulai dengan membuat produk pertama Anda.</p>
                <div className="mt-6">
                  <Link
                    to="/admin/add-product"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                    onClick={() => showInfo("Membuka halaman tambah produk pertama", "Mulai")}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Tambah Produk Pertama
                  </Link>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ditemukan</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Tidak ada produk yang cocok dengan pencarian "{searchTerm}".
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <div key={product.id} className="px-6 py-6 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Product Info */}
                    <div className="col-span-5 flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="h-16 w-16 object-contain rounded-lg border bg-white p-2"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-center">
                      <span className="text-lg font-semibold text-gray-900">
                        <Rupiah value={product.price.toLocaleString('id-ID')}/>
                      </span>
                    </div>

                    {/* Stock */}
                    <div className="col-span-2 text-center">
                      <span className={`text-lg font-semibold ${getStockColor(product.stock)}`}>
                        {product.stock}
                      </span>
                      {product.stock <= 10 && product.stock > 0 && (
                        <div className="text-xs text-red-500 mt-1">Stok Rendah</div>
                      )}
                      {product.stock === 0 && (
                        <div className="text-xs text-red-500 mt-1">Stok Habis</div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-3 flex items-center justify-center space-x-3">
                      <Link
                        to={`/admin/edit-product/${product.id}`}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        title="Edit Produk"
                        onClick={() => showInfo(`Membuka editor untuk "${product.title}"`, "Edit Produk")}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="inline-flex items-center p-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                        title="Hapus Produk"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Alert Container - Posisi tetap di kanan bawah */}
      <AlertContainer alerts={alerts} onRemoveAlert={removeAlert} />
    </div>
  );
};

export default AdminDashboard;