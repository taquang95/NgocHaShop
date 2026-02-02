
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

const CACHE_KEY = 'ngochashop_products_cache';
const CACHE_TIME = 1000 * 60 * 60; // 1 giờ

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

  // Thử khôi phục từ Cache ngay khi khởi tạo (Đồng bộ - giúp render nhanh nhất có thể)
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_TIME;
        if (data && data.length > 0) {
          console.log("ProductProvider: Restored from Cache.");
          setProducts(data);
          setLoading(false); // Ngắt loading sớm cho Bot
          setIsUsingLiveData(true);
          
          // Nếu cache quá cũ, vẫn tải mới ở background
          if (isExpired) {
            loadData(false);
          }
        } else {
          loadData(true);
        }
      } catch (e) {
        loadData(true);
      }
    } else {
      loadData(true);
    }
  }, []);

  const loadData = async (showLoading: boolean = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const sheetProducts = await fetchProductsFromSheet();
      
      if (sheetProducts.length > 0) {
        setProducts(sheetProducts);
        setIsUsingLiveData(true);
        // Lưu vào cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: sheetProducts,
          timestamp: Date.now()
        }));
      }
    } catch (err) {
      console.error("ProductProvider Error:", err);
      setError('Could not load live data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProductContext.Provider value={{ products, loading, error, refreshProducts: () => loadData(true), isUsingLiveData }}>
      {children}
    </ProductContext.Provider>
  );
};
