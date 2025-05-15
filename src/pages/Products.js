import useFetch from "../hooks/useFetch";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";

const Products = () => {
  const { data: products, loading, error } = useFetch("https://fakestoreapi.com/products");

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error fetching data</p>;

  
  return (
    <div className="text-center p-10">
    <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500 text-white p-10 rounded-lg shadow-lg">
        <div className="md:w-1/2 text-left">
          <h1 className="text-4xl font-bold mb-4">Selamat Datang di Toko Online</h1>
          <p className="text-lg">Temukan produk terbaik dengan harga terjangkau!</p><br>
           </br>
        </div>
        <div className="md:w-1/2 flex justify-center">
            {products.slice(0, 1).map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-md bg-white hover:shadow-xl transition-all duration-300">
              <img src={product.image} alt={product.title} className="h-32 mx-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div></div>
  );
};

export default Products;