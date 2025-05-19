
import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { toast } from '../ui/sonner';

const Footer: React.FC = () => {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    toast('Thank you for subscribing!', {
      description: `${email} has been added to our newsletter.`,
    });
    
    e.currentTarget.reset();
  };
  
  return (
    <footer className="bg-sage-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-medium text-sage-800 mb-4">About Onna</h3>
            <p className="text-sage-600 mb-4">
              Onna Accessories crafts timeless, sophisticated jewelry pieces for the modern woman. 
              Each item is designed with simplicity and elegance in mind.
            </p>
          </div>
          
          {/* Shop Links */}
          <div>
            <h3 className="text-xl font-medium text-sage-800 mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-sage-600 hover:text-sage-500">All Products</Link>
              </li>
              <li>
                <Link to="/category/necklaces" className="text-sage-600 hover:text-sage-500">Necklaces</Link>
              </li>
              <li>
                <Link to="/category/earrings" className="text-sage-600 hover:text-sage-500">Earrings</Link>
              </li>
              <li>
                <Link to="/category/bracelets" className="text-sage-600 hover:text-sage-500">Bracelets</Link>
              </li>
              <li>
                <Link to="/hot-deals" className="text-sage-600 hover:text-sage-500">Hot Deals</Link>
              </li>
            </ul>
          </div>
          
          {/* Help Links */}
          <div>
            <h3 className="text-xl font-medium text-sage-800 mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sage-600 hover:text-sage-500">Contact Us</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sage-600 hover:text-sage-500">Shipping & Returns</Link>
              </li>
              <li>
                <Link to="/faq" className="text-sage-600 hover:text-sage-500">FAQ</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sage-600 hover:text-sage-500">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-sage-600 hover:text-sage-500">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-medium text-sage-800 mb-4">Stay in Touch</h3>
            <p className="text-sage-600 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-2">
              <Input 
                type="email" 
                name="email"
                placeholder="Your email address" 
                className="bg-white border-sage-200" 
                required
              />
              <Button type="submit" className="bg-sage-500 hover:bg-sage-600 text-white">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        {/* Social & Copyright */}
        <div className="pt-8 border-t border-sage-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sage-600 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Onna Accessories. All rights reserved.
          </p>
          
          <div className="flex space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sage-600 hover:text-sage-500">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-sage-600 hover:text-sage-500">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sage-600 hover:text-sage-500">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
