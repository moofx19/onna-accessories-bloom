
import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, Product } from '../types';
import { toast } from '../components/ui/sonner';

interface CartContextType {
  cartItems: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  updateQuantity: (productId: number, quantity: number) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  applyBuyXGetYPromotions: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart data from localStorage', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const applyBuyXGetYPromotions = () => {
    setCartItems(prevItems => {
      let updatedItems = [...prevItems];
      let addedBonusItems = false;

      // Remove existing bonus items first
      updatedItems = updatedItems.filter(item => !item.isBonusItem);

      // Check each product's Buy X Get Y promotions
      updatedItems.forEach(cartItem => {
        if (cartItem.buyXGetY && cartItem.buyXGetY.length > 0) {
          cartItem.buyXGetY.forEach(promo => {
            if (new Date(promo.expiration) > new Date()) {
              const xQuantity = parseInt(promo.X);
              const yQuantity = parseInt(promo.Y);

              // Check if this specific item qualifies
              if (cartItem.quantity >= xQuantity) {
                const qualifyingPairs = Math.floor(cartItem.quantity / xQuantity);
                const bonusItemsToAdd = qualifyingPairs * yQuantity;

                if (bonusItemsToAdd > 0) {
                  const bonusItem: CartItem = {
                    ...cartItem,
                    quantity: bonusItemsToAdd,
                    isBonusItem: true,
                    price: 0, // Bonus items are free
                    id: cartItem.id + 10000 // Unique ID for bonus item
                  };
                  
                  updatedItems.push(bonusItem);
                  addedBonusItems = true;
                }
              }
            }
          });
        }
      });

      if (addedBonusItems) {
        toast('Bonus items added!', {
          description: 'You qualified for our Buy X Get Y promotion!',
        });
      }

      return updatedItems;
    });
  };

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => 
        item.id === product.id && 
        item.variant === product.variant &&
        item.charms === product.charms &&
        !item.isBonusItem
      );
      
      let updatedItems;
      
      if (existingItem) {
        const charmText = product.charms ? ` with ${product.charms} charms` : '';
        toast('Item quantity updated', {
          description: `${product.name}${charmText} quantity increased to ${existingItem.quantity + 1}`,
        });
        
        updatedItems = prevItems.map(item => 
          item.id === product.id && 
          item.variant === product.variant &&
          item.charms === product.charms &&
          !item.isBonusItem
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        const charmText = product.charms ? ` with ${product.charms} charms` : '';
        toast('Item added to cart', {
          description: `${product.name}${charmText} has been added to your cart`,
        });
        
        updatedItems = [...prevItems, { ...product, quantity: 1, isBonusItem: false }];
      }

      return updatedItems;
    });
    
    // Apply promotions after adding item
    setTimeout(() => {
      applyBuyXGetYPromotions();
    }, 100);
    
    openCart();
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      
      if (itemToRemove) {
        toast('Item removed', {
          description: `${itemToRemove.name} has been removed from your cart`,
        });
      }
      
      const updatedItems = prevItems.filter(item => item.id !== productId);
      
      // Re-apply promotions after removing item
      setTimeout(() => {
        applyBuyXGetYPromotions();
      }, 100);
      
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    toast('Cart cleared', {
      description: 'All items have been removed from your cart',
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      );
      
      // Re-apply promotions after updating quantity
      setTimeout(() => {
        applyBuyXGetYPromotions();
      }, 100);
      
      return updatedItems;
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.isBonusItem) return total; // Bonus items are free
      const price = item.salePrice || item.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        isCartOpen, 
        openCart, 
        closeCart, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        updateQuantity, 
        getCartTotal, 
        getCartCount,
        applyBuyXGetYPromotions
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
