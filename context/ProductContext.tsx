
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../types';
import { fetchProductsFromSheet } from '../services/googleSheet';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => void;
  isUsingLiveData: boolean;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  loading: true,
  error: null,
  refreshProducts: () => {},
  isUsingLiveData: false,
});

export const useProducts = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingLiveData, setIsUsingLiveData] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("ProductProvider: Loading data...");
      const sheetProducts = await fetchProductsFromSheet();
      
      if (sheetProducts.length > 0) {
        console.log(`ProductProvider: Using ${sheetProducts.length} items from Sheet.`);
        setProducts(sheetProducts); 
        setIsUsingLiveData(true);
      } else {
        // If sheet returns 0 items (or fails filtering), we return empty to let user know
        // instead of falling back to Mock Data which confuses the user.
        console.warn("ProductProvider: Sheet empty or no 'Done' items found.");
        setProducts([]);
        setIsUsingLiveData(true);
      }
    } catch (err) {
      console.error("ProductProvider Error:", err);
      setError('Could not load live data');
      setProducts([]); // Also set empty on error
      setIsUsingLiveData(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error, refreshProducts: loadData, isUsingLiveData }}>
      {children}
    </ProductContext.Provider>
  );
};
