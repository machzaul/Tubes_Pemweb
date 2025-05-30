import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAlert from "../hooks/useAlert";
import AlertContainer from "../components/ui/AlertContainer";

const AddEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  
  // Initialize alert hook
  const { alerts, removeAlert, showSuccess, showError, showWarning } = useAlert();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    image: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchingProduct, setFetchingProduct] = useState(false);

  // Backend API base URL - adjust this according to your backend configuration
  const API_BASE_URL = "http://localhost:6543/api";

  const formatRupiah = (angka, prefix = "Rp") => {
    if (!angka) return prefix + "0";
    let number_string = angka.toString().replace(/[^,\d]/g, ""),
      split = number_string.split(","),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/g);

    if (ribuan) {
      rupiah += (sisa ? "." : "") + ribuan.join(".");
    }

    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return prefix + rupiah;
  };

  const parseRupiahToNumber = (rupiahString) => {
    return parseFloat(rupiahString.replace(/[^\d]/g, "")) || 0;
  };

  const handlePriceChange = (e) => {
    const raw = e.target.value;
    const numeric = parseRupiahToNumber(raw);
    setFormData(prev => ({
      ...prev,
      price: numeric
    }));
    if (errors.price) {
      setErrors(prev => ({
        ...prev,
        price: ""
      }));
    }
  };

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id, isEdit]);

  const fetchProduct = async () => {
    setFetchingProduct(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          showError("Product not found", "Error");
          setTimeout(() => navigate("/adminDashboard"), 2000);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const product = await response.json();
      setFormData({
        title: product.title || "",
        description: product.description || "",
        price: product.price ? product.price.toString() : "",
        stock: product.stock ? product.stock.toString() : "",
        image: product.image || ""
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      showError("Error loading product data. Please try again.", "Loading Error");
      setTimeout(() => navigate("/adminDashboard"), 2000);
    } finally {
      setFetchingProduct(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Product title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Product description is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.stock) {
      newErrors.stock = "Stock is required";
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = "Stock must be a non-negative integer";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Product image URL is required";
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = "Please enter a valid image URL";
    }

    setErrors(newErrors);
    
    // Show validation errors using custom alert
    if (Object.keys(newErrors).length > 0) {
      showError("Please fix the validation errors before submitting.", "Validation Error");
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const productData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      image: formData.image.trim()
    };

    console.log('Submitting product data:', productData);
    console.log('API URL:', isEdit ? `${API_BASE_URL}/products/${id}` : `${API_BASE_URL}/products`);

    try {
      let response;
      
      const requestOptions = {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(productData),
      };

      console.log('Request options:', requestOptions);
      
      if (isEdit) {
        // Update existing product
        response = await fetch(`${API_BASE_URL}/products/${id}`, requestOptions);
      } else {
        // Create new product
        response = await fetch(`${API_BASE_URL}/products`, requestOptions);
      }

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (jsonError) {
          console.error('Error parsing error response:', jsonError);
          const errorText = await response.text();
          console.error('Error response text:', errorText);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Product saved successfully:', result);
      
      // Show success message using custom alert
      showSuccess(
        `Product ${isEdit ? 'updated' : 'created'} successfully! Redirecting to dashboard...`,
        "Success!"
      );
      
      // Navigate back to admin dashboard with delay
      setTimeout(() => {
        navigate("/adminDashboard");
      }, 2000);
      
    } catch (error) {
      console.error("Error saving product:", error);
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Show error using custom alert
      showError(
        `Error ${isEdit ? 'updating' : 'creating'} product: ${error.message}`,
        "Operation Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading spinner while fetching product data
  if (fetchingProduct) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-solid border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/adminDashboard")}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Edit Product" : "Tambahkan Produk Baru"}
          </h1>
        </div>

        {/* Form */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Product Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Produk *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.title ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Masukkan nama produk"
                disabled={loading}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Product Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Produk *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.description ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Masukkan deskripsi produk"
                disabled={loading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Harga dan Stok */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Harga (Rp) *
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={formatRupiah(formData.price)}
                  onChange={handlePriceChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.price ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="Rp0"
                  disabled={loading}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Stok *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.stock ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="0"
                  disabled={loading}
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                )}
              </div>
            </div>

            {/* Product Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Link Gambar Produk *
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.image ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="https://example.com/image.jpg"
                disabled={loading}
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}
              
              {/* Image Preview */}
              {formData.image && isValidUrl(formData.image) && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                  <div className="flex justify-center">
                    <img 
                      src={formData.image} 
                      alt="Product preview" 
                      className="h-40 w-40 object-contain border rounded-lg bg-gray-50"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/adminDashboard")}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Batalkan
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-solid border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isEdit ? "Updating..." : "Creating..."}
                  </div>
                ) : (
                  isEdit ? "Update Product" : "Buat Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Alert Container */}
      <AlertContainer alerts={alerts} onRemoveAlert={removeAlert} />
    </div>
  );
};

export default AddEditProduct;