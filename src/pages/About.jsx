
import { ShoppingCart, Package, Truck, Clock, CreditCard, Phone } from 'lucide-react';

const About = () => {
  return (
    <div className="page-container">
      <h1 className="section-title">About MachzaulMart</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Founded in 2020, MachzaulMart began with a simple vision: to create an online marketplace that provides high-quality products at competitive prices while offering exceptional customer service. What started as a small venture has grown into a trusted online destination for shoppers worldwide.
          </p>
          <p className="text-gray-700 mb-4">
            Our name, MachzaulMart, represents our commitment to innovation ("Mach"), reliability ("zaul"), and accessibility ("Mart"). These principles guide every aspect of our business, from product selection to customer interactions.
          </p>
          <div className="mt-6">
            <img 
              src="https://images.unsplash.com/photo-1579532536935-619928decd08?w=800&q=80" 
              alt="MachzaulMart Office" 
              className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
            />
            <p className="text-sm text-gray-500 text-center">Our headquarters located in the heart of the city</p>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-blue-600">Our Mission</h2>
          <p className="text-gray-700 mb-6">
            At MachzaulMart, our mission is to empower consumers by providing access to a curated selection of premium products that enhance everyday life. We believe in transparent business practices, sustainable operations, and building lasting relationships with our customers and suppliers.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Core Values</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Customer satisfaction as our top priority</li>
                <li>• Quality and authenticity in every product</li>
                <li>• Innovation in shopping experience</li>
                <li>• Integrity in all business dealings</li>
                <li>• Community engagement and support</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Our Promise</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Carefully vetted, quality products</li>
                <li>• Competitive and transparent pricing</li>
                <li>• Fast and reliable shipping</li>
                <li>• Responsive customer support</li>
                <li>• Secure shopping environment</li>
              </ul>
            </div>
          </div>
        </section>
        
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-blue-600">What We Offer</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2">Diverse Selection</h3>
              <p className="text-gray-600">Carefully curated products across multiple categories to meet your everyday needs.</p>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <Package className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2">Quality Assurance</h3>
              <p className="text-gray-600">Every product undergoes rigorous quality checks before being listed on our platform.</p>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <Truck className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Efficient logistics to ensure your orders reach you in the shortest possible time.</p>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <Clock className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our customer service team is always ready to assist you with any queries.</p>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Multiple payment options with enhanced security for worry-free transactions.</p>
            </div>
            
            <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
              <Phone className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <h3 className="text-lg font-semibold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">Shop conveniently from your mobile device with our responsive design.</p>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-2xl font-bold mb-6 text-blue-600">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" 
                alt="CEO" 
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">John Smith</h3>
                <p className="text-blue-600 text-sm">CEO & Founder</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" 
                alt="COO" 
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">Sarah Johnson</h3>
                <p className="text-blue-600 text-sm">COO</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80" 
                alt="CTO" 
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">Michael Lee</h3>
                <p className="text-blue-600 text-sm">CTO</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&q=80" 
                alt="Marketing Director" 
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-gray-800">Emma Davis</h3>
                <p className="text-blue-600 text-sm">Marketing Director</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
