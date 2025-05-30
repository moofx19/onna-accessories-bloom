
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";

// Pages
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import CategoryPage from "./pages/Category";
import HotDeals from "./pages/HotDeals";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import SearchResults from "./pages/Search";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <SearchProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/hot-deals" element={<HotDeals />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SearchProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
