import { Menu, ShoppingBag, User, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWindowSize } from "../../hooks/use-mobile";
import SearchDialog from "../SearchDialog";
import SearchInput from "../SearchInput";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, getCartCount } = useCart();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  // Effect to handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = getCartCount();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-playfair font-semibold text-2xl text-sage-800 flex items-center gap-2"
          style={{ textDecoration: "none" }}
        >
          <img
            src="/lovable-uploads/logo.avif"
            alt="Onna Logo"
            className="h-10 w-auto"
            style={{ display: "inline-block" }}
          />
          <span className="sr-only">Onna</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link
            to="/"
            className="text-sage-700 hover:text-sage-500 font-medium"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-sage-700 hover:text-sage-500 font-medium"
          >
            Shop All
          </Link>
          <Link
            to="/category/necklaces"
            className="text-sage-700 hover:text-sage-500 font-medium"
          >
            Necklaces
          </Link>
          <Link
            to="/category/earrings"
            className="text-sage-700 hover:text-sage-500 font-medium"
          >
            Earrings
          </Link>
          <Link
            to="/category/bracelets"
            className="text-sage-700 hover:text-sage-500 font-medium"
          >
            Bracelets
          </Link>
          <Link
            to="/hot-deals"
            className="text-rose-500 hover:text-rose-600 font-medium"
          >
            Hot Deals
          </Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center space-x-4">
          {/* Search - Dialog on mobile, inline on desktop */}
          {isMobile ? (
            <SearchDialog />
          ) : (
            <div className="hidden md:block w-56">
              <SearchInput isCompact={true} />
            </div>
          )}

          <button className="text-sage-700 hover:text-sage-500">
            <User className="h-5 w-5" />
          </button>
          <button
            className="text-sage-700 hover:text-sage-500 relative"
            onClick={openCart}
            aria-label="Shopping cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-sage-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            className="md:hidden text-sage-700 hover:text-sage-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col">
            <Link
              to="/"
              className="py-3 text-sage-700 hover:text-sage-500 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="py-3 text-sage-700 hover:text-sage-500 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop All
            </Link>
            <Link
              to="/category/necklaces"
              className="py-3 text-sage-700 hover:text-sage-500 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Necklaces
            </Link>
            <Link
              to="/category/earrings"
              className="py-3 text-sage-700 hover:text-sage-500 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Earrings
            </Link>
            <Link
              to="/category/bracelets"
              className="py-3 text-sage-700 hover:text-sage-500 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Bracelets
            </Link>
            <Link
              to="/hot-deals"
              className="py-3 text-rose-500 hover:text-rose-600 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Hot Deals
            </Link>
            <Link
              to="/search"
              className="py-3 text-sage-700 hover:text-sage-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Search
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
