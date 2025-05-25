const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        
        {/* Main Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 mb-16 max-w-6xl mx-auto">
          
          {/* Left Content */}
          <div className="flex-1 max-w-lg">
            <p className="text-purple-500 font-medium mb-4">Hubungi Kami</p>
            <h1 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Mari Terhubung dan Berkolaborasi Bersama
            </h1>
            <p className="text-gray-600 leading-relaxed">
              Untuk pertanyaan, kolaborasi, atau sekadar ingin menyapa, kami senang mendengar dari Anda! Tim MachzaulMart selalu siap membantu dan memberikan pelayanan terbaik. Hubungi kami melalui berbagai saluran komunikasi yang tersedia, dan mari kita terhubung untuk menciptakan pengalaman berbelanja yang luar biasa bersama-sama.
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
                  src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  alt="Hubungi MachzaulMart"
                  className="w-full h-64 object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Methods Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-20">
          
          {/* Customer Service */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Service</h3>
            <p className="text-purple-600 font-semibold">+62 856 9450 8422</p>
            <p className="text-gray-600 text-sm">24/7 Available</p>
          </div>

          {/* Email Support */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
            <p className="text-purple-600 font-semibold">machzaul17@gmail.com</p>
            <p className="text-gray-600 text-sm">Response in 24h</p>
          </div>

          {/* WhatsApp */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-purple-600 font-semibold">+62 856 9450 8422</p>
            <p className="text-gray-600 text-sm">Fast Response</p>
          </div>

          {/* Office Address */}
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Head Office</h3>
            <p className="text-gray-600 text-sm">Padang, Indonesia</p>
            <p className="text-gray-600 text-sm">Visit by appointment</p>
          </div>

        </div>

        {/* Additional Features Section */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cara Terbaik Menghubungi Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami menyediakan berbagai saluran komunikasi untuk memberikan kemudahan dan kenyamanan dalam menghubungi tim MachzaulMart.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Quick Response */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Respon Cepat</h3>
              <p className="text-gray-600">
                Tim customer service kami merespon setiap pertanyaan Anda dengan cepat melalui WhatsApp dan email.
              </p>
            </div>

            {/* Professional Support */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dukungan Profesional</h3>
              <p className="text-gray-600">
                Staf terlatih dan berpengalaman siap membantu menyelesaikan setiap pertanyaan dan masalah Anda.
              </p>
            </div>

            {/* Multiple Channels */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Multi Channel</h3>
              <p className="text-gray-600">
                Pilih saluran komunikasi yang paling nyaman untuk Anda: telepon, WhatsApp, atau email.
              </p>
            </div>

          </div>
        </div>

        {/* Contact CTA Section */}
        <div className="mt-20 text-center bg-white p-12 rounded-3xl shadow-sm border border-gray-200 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Siap Membantu Anda</h3>
          <p className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto">
            Jangan ragu untuk menghubungi kami kapan saja. Tim MachzaulMart selalu siap memberikan pelayanan terbaik untuk Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://wa.me/6285694508422" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-purple-600 text-white px-8 py-3 rounded-full hover:bg-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
            >
              WhatsApp Sekarang
            </a>
            <a 
              href="mailto:machzaul17@gmail.com"
              className="bg-gray-100 text-gray-700 border border-gray-300 px-8 py-3 rounded-full hover:bg-gray-200 transition-all duration-300 font-medium"
            >
              Kirim Email
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;