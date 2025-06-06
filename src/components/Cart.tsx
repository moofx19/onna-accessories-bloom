
import React from 'react';
import { X, Plus, Minus, ShoppingBag, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart: React.FC = () => {
  const { 
    cartItems, 
    isCartOpen, 
    closeCart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    clearCart 
  } = useCart();

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40" 
          onClick={closeCart}
        />
      )}
      
      {/* Cart drawer */}
      <div 
        className={`fixed top-0 right-0 w-full sm:w-96 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Your Cart</h2>
          <button 
            onClick={closeCart}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-grow overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-6">Your cart is empty</p>
              <Button 
                onClick={closeCart}
                variant="outline" 
                className="border-sage-500 text-sage-500 hover:bg-sage-50"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.variant || 'default'}-${item.charms || 0}-${item.isBonusItem ? 'bonus' : 'regular'}`} className="py-4 border-b border-gray-200 flex">
                  {/* Product image */}
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-md mr-4 relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="h-full w-full object-cover object-center" 
                    />
                    {item.isBonusItem && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                        <Gift className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.name}
                      {item.isBonusItem && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          FREE
                        </span>
                      )}
                    </h3>
                    
                    {/* Variant and charms info */}
                    {(item.variant || item.charms) && (
                      <div className="text-xs text-gray-500 mt-1">
                        {item.variant && <span>{item.variant}</span>}
                        {item.variant && item.charms && <span> • </span>}
                        {item.charms && <span>{item.charms} charms</span>}
                      </div>
                    )}
                    
                    <div className="flex items-center mt-1">
                      {item.isBonusItem ? (
                        <span className="text-sm font-medium text-green-600">FREE</span>
                      ) : item.salePrice ? (
                        <>
                          <span className="text-sm font-medium text-rose-500">EGP {item.salePrice.toFixed(2)}</span>
                          <span className="ml-2 text-xs text-gray-500 line-through">EGP {item.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">EGP {item.price.toFixed(2)}</span>
                      )}
                    </div>
                    
                    {/* Quantity */}
                    <div className="flex items-center mt-2">
                      {!item.isBonusItem ? (
                        <>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="mx-2 text-gray-600 w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-500 hover:text-gray-700"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-green-600">Bonus: {item.quantity}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Remove button */}
                  {!item.isBonusItem && (
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-gray-600"
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              
              {/* Clear cart button */}
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={clearCart}
                  variant="link" 
                  className="text-gray-500 hover:text-gray-700"
                >
                  Clear Cart
                </Button>
              </div>
            </>
          )}
        </div>
        
        {/* Footer with total and checkout */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">EGP {getCartTotal().toFixed(2)}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Shipping and taxes calculated at checkout
            </p>
            <Button 
              className="w-full bg-sage-500 hover:bg-sage-600 text-white"
              asChild
              onClick={closeCart}
            >
              <Link to="/checkout">
                Proceed to Checkout
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
