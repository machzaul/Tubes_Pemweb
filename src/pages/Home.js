import useFetch from "../hooks/useFetch";

const Home = () => {
  const { data: products, loading } = useFetch("https://fakestoreapi.com/products");

  return (
    <div className="text-center p-10">
      {/* Hero Section */}
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

      {/* Produk Unggulan */}
      <h2 className="text-3xl font-semibold mt-10">Produk Unggulan</h2>
      {loading ? (
        <p className="text-xl font-semibold text-gray-700 mt-4">Loading...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-md bg-white hover:shadow-xl transition-all duration-300">
              <img src={product.image} alt={product.title} className="h-32 mx-auto object-contain" />
              <h3 className="text-lg font-bold mt-2">{product.title}</h3>
              <p className="text-green-600 font-semibold text-lg">${product.price}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pemilik Toko */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-500 to-purple-500 text-white p-10 rounded-lg shadow-lg mt-10">
      <div className="md:w-1/2 flex justify-center">
            {products.slice(0, 1).map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-md bg-white hover:shadow-xl transition-all duration-300">
              <img src="https://media.licdn.com/dms/image/v2/D4D03AQE-OqL162sVgw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1696488893139?e=1748476800&v=beta&t=QdGcQe8P6tG93JbdXKiOGn6uHymU_igqGP26gT19Ybs" alt={product.title} className="h-32 mx-auto object-contain rounded" />
            </div>
          ))}
        </div><br></br>
        <div className="md:w-1/2 text-left">
          <h1 className="text-4xl font-bold mb-4">Pemilik Toko</h1>
          <p className="text-lg">Saya adalah pemilik toko ini, dengan pengalaman bertahun-tahun di dunia e-commerce.</p>
        </div>
      </div>
    </div>
  );
};
export default Home;
