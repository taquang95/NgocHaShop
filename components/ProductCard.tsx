
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Zap } from 'lucide-react';
import { Product } from '../types';
import { Button } from './ui/Button';

interface ProductCardProps {
  product: Product;
  isLoading?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isLoading }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse h-[340px]">
        <div className="h-48 bg-gray-200" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-200 rounded mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 relative flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges Container */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
        {product.discountPercent > 0 && (
          <div className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">
            -{product.discountPercent}%
          </div>
        )}
        {product.isDeal && (
          <div className="bg-yellow-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm flex items-center gap-0.5">
            <Zap size={10} fill="currentColor" /> DEAL
          </div>
        )}
      </div>

      {/* Image Section */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square bg-gray-50 p-2">
        <img 
          src={product.imageUrl} 
          alt={product.title}
          className="w-full h-full object-contain mix-blend-multiply transform group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        {/* Mall Tag overlay */}
        <div className="absolute bottom-2 left-2 flex gap-1">
           <span className="bg-primary/10 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded border border-primary/20 backdrop-blur-sm">Mall</span>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-3 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`} className="block flex-grow group/title">
          <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 min-h-[32px] leading-snug group-hover/title:text-primary transition-colors">
            {product.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{product.brand || 'No Brand'}</span>
            <div className="flex items-center text-yellow-500 ml-auto bg-yellow-50 px-1 rounded">
              <Star size={10} fill="currentColor" />
              <span className="ml-0.5 text-[10px] font-black">{product.rating.toFixed(1)}</span>
              <span className="text-gray-400 text-[9px] ml-0.5 font-medium">({product.ratingCount})</span>
            </div>
          </div>

          <div className="mt-3 flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-primary leading-none">
                {product.priceDeal?.toLocaleString('vi-VN')}₫
              </span>
            </div>
            {product.priceDeal && product.priceRegular > product.priceDeal && (
              <span className="text-[10px] text-gray-300 line-through mt-0.5">
                {product.priceRegular.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>
        </Link>
        
        {/* Action Button - Exact match to user screenshot style */}
        <div className="mt-4">
            <Link to={`/product/${product.id}`}>
               <Button 
                 variant="outline" 
                 size="sm" 
                 fullWidth 
                 className="text-[11px] font-bold h-9 rounded-lg border-primary text-primary hover:bg-primary hover:text-white group-hover:shadow-md shadow-primary/10"
               >
                  Xem chi tiết
               </Button>
            </Link>
        </div>
      </div>
    </div>
  );
};
