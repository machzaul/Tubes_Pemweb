
import { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { initializeStorage } from '../lib/utils';

const Home = () => {
  const { products, refreshProducts } = useAdmin();
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Initialize local storage with default data if needed
    initializeStorage();
    refreshProducts();
    setIsLoading(false);
  }, [refreshProducts]);
  
  const showMoreProducts = () => {
    setVisibleProducts(prevCount => prevCount + 6);
  };
  
  return (
    <div className="page-container">
      <section className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to MachzaulMart</h1>
          <p className="text-lg md:text-xl mb-6">Your premier shopping destination for quality products.</p>
          <p className="text-md mb-2">Explore our collection of premium products at competitive prices.</p>
        </div>
      </section>
      
      <section>
        <h2 className="section-title">Featured Products</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products available</h3>
            <p className="text-gray-500">Check back soon for new items!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.slice(0, visibleProducts).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {visibleProducts < products.length && (
              <div className="mt-8 text-center">
                <Button onClick={showMoreProducts}>
                  Load More Products
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Home;
