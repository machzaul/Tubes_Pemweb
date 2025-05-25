const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        
        {/* Main Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 mb-16 max-w-6xl mx-auto">
          
          {/* Left Content */}
          <div className="flex-1 max-w-lg">
            <p className="text-purple-500 font-medium mb-4">Bagaimana Kami Memulai</p>
            <h1 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Impian Kami adalah Transformasi Belanja Global
            </h1>
            <p className="text-gray-600 leading-relaxed">
              MachzaulMart didirikan oleh para entrepreneur yang bersemangat dan percaya pada aksesibilitas produk berkualitas untuk semua orang. Impian bersama mereka adalah menciptakan marketplace digital yang menghubungkan orang dengan produk yang mereka cintai. Disatukan oleh keyakinan mereka pada kekuatan transformatif e-commerce, mereka memulai perjalanan untuk membangun MachzaulMart. Dengan dedikasi tanpa henti, mereka mengumpulkan tim ahli dan meluncurkan platform inovatif ini, menciptakan komunitas global pembeli yang bersemangat, semuanya terhubung oleh keinginan untuk menjelajahi, menemukan, dan menikmati produk berkualitas.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute bg-purple-600 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-purple-600 rounded-3xl p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-16 -translate-y-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full transform -translate-x-12 translate-y-12"></div>
                <img
                  src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Kolaborasi Tim"
                  className="w-full h-64 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          
          {/* Years Experience */}
          <div className="text-center">
            <h3 className="text-4xl font-bold text-gray-900 mb-2">3.5</h3>
            <p className="text-gray-600 font-medium">Tahun Pengalaman</p>
          </div>

          {/* Product Categories */}
          <div className="text-center">
            <h3 className="text-4xl font-bold text-gray-900 mb-2">23</h3>
            <p className="text-gray-600 font-medium">Kategori Produk</p>
          </div>

          {/* Positive Reviews */}
          <div className="text-center">
            <h3 className="text-4xl font-bold text-gray-900 mb-2">830+</h3>
            <p className="text-gray-600 font-medium">Ulasan Positif</p>
          </div>

          {/* Trusted Customers */}
          <div className="text-center">
            <h3 className="text-4xl font-bold text-gray-900 mb-2">100K</h3>
            <p className="text-gray-600 font-medium">Pelanggan Terpercaya</p>
          </div>

        </div>

        {/* Additional Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Mengapa Memilih MachzaulMart?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami berkomitmen memberikan pengalaman berbelanja terbaik dengan solusi inovatif dan pendekatan yang berpusat pada pelanggan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Quality Assurance */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Jaminan Kualitas</h3>
              <p className="text-gray-600">
                Setiap produk melalui pemeriksaan kualitas yang ketat untuk memastikan Anda menerima hanya barang terbaik.
              </p>
            </div>

            {/* Fast Delivery */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Pengiriman Cepat</h3>
              <p className="text-gray-600">
                Pengiriman ekspres dengan pelacakan real-time untuk mendapatkan pesanan Anda dengan cepat dan aman.
              </p>
            </div>

            {/* 24/7 Support */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dukungan 24/7</h3>
              <p className="text-gray-600">
                Tim layanan pelanggan kami yang berdedikasi tersedia sepanjang waktu untuk membantu Anda.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default About;