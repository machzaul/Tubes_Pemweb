import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 hover:shadow-xl">
      <img src={product.image} alt={product.title} className="h-40 w-40 object-contain mb-4" />
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.title}</h3>
      <p className="text-xl font-bold text-blue-600 mb-4">${product.price}</p>
      <Link 
        to={`/products/${product.id}`} 
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all">
        View Details
      </Link>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductCard;