import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from '../components/ui/sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { usePromoCodes, validatePromoCode } from '../hooks/usePromoCodes';

const Checkout: React.FC = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { promoCodes } = usePromoCodes();
  const navigate = useNavigate();
  
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<any>(null);
  const [promoError, setPromoError] = useState('');
  
  const subtotal = getCartTotal();
  const promoDiscount = appliedPromoCode ? (subtotal * appliedPromoCode.discount / 100) : 0;
  const shipping = (appliedPromoCode?.isFreeShip || subtotal > 50) ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal - promoDiscount + shipping + tax;
  
  const handleApplyPromoCode = () => {
    if (!promoCodeInput.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }
    
    const validation = validatePromoCode(promoCodeInput, promoCodes);
    
    if (validation.valid) {
      setAppliedPromoCode(validation);
      setPromoError('');
      toast('Promo code applied successfully!');
    } else {
      setPromoError(validation.error || 'Invalid promo code');
      setAppliedPromoCode(null);
    }
  };
  
  const handleRemovePromoCode = () => {
    setAppliedPromoCode(null);
    setPromoCodeInput('');
    setPromoError('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast('Order placed successfully!', {
      description: 'Thank you for your purchase.',
    });
    
    // Clear cart and redirect to confirmation
    clearCart();
    navigate('/');
  };
  
  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-medium text-gray-900 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Add some products to your cart before checking out.</p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-medium text-gray-900 mb-8 text-center">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Customer Information Form */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-6">Shipping Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" required />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select>
                    <SelectTrigger id="state" className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">Alabama</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      {/* Add other states as needed */}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input id="zipCode" required />
                </div>
              </div>
              
              <Separator />
              
              <h2 className="text-xl font-medium text-gray-900 mb-4">Payment Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expDate">Expiration Date</Label>
                  <Input id="expDate" placeholder="MM/YY" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" required />
                </div>
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-sage-500 hover:bg-sage-600 text-white py-6"
              >
                Place Order (EGP {total.toFixed(2)})
              </Button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-6">Order Summary</h2>
            
            <div className="bg-sage-50 p-6 rounded-lg">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center py-4 border-b border-sage-200">
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md mr-4">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="h-full w-full object-cover object-center" 
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      {item.isBonusItem && (
                        <p className="text-sm text-green-600">Free (Buy X Get Y)</p>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {item.isBonusItem ? 'Free' : `EGP ${((item.salePrice || item.price) * item.quantity).toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Promo Code Section */}
              <div className="mt-6 pt-6 border-t border-sage-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Promo Code</h3>
                {!appliedPromoCode ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCodeInput}
                        onChange={(e) => setPromoCodeInput(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleApplyPromoCode}
                        className="text-sage-700 border-sage-300"
                      >
                        Apply
                      </Button>
                    </div>
                    {promoError && (
                      <p className="text-sm text-red-500">{promoError}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                    <span className="text-sm text-green-700 font-medium">
                      {appliedPromoCode.code.name} ({appliedPromoCode.discount}% off)
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemovePromoCode}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-2 mt-6 pt-6 border-t border-sage-200">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="text-sm font-medium text-gray-900">EGP {subtotal.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-green-600">Promo Discount</span>
                    <span className="text-sm font-medium text-green-600">-EGP {promoDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Shipping</span>
                  <span className="text-sm font-medium text-gray-900">
                    {shipping === 0 ? 'Free' : `EGP ${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tax</span>
                  <span className="text-sm font-medium text-gray-900">EGP {tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-sage-200">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-medium text-gray-900">EGP {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Checkout;
