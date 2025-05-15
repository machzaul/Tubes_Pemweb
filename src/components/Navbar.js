import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white flex justify-between">
      <h1 className="text-lg font-bold">Toko Online</h1>
      <div>
        <Link to="/" className="mx-2">Home</Link>
        <Link to="/products" className="mx-2">Products</Link>
        <Link to="/about" className="mx-2">Tentang Toko</Link>
        <Link to="/contact" className="mx-2">Kontak Toko</Link>
        <Link to="/cart" className="mx-2">Keranjang</Link>
      </div>
    </nav>
  );
  
};
export default Navbar;