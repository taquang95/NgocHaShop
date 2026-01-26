
import React from 'react';
import { Voucher } from '../types';
import { ShoppingBag, Truck, Zap, Star, Tag } from 'lucide-react';

interface VoucherCardProps {
  voucher: Voucher;
}

export const VoucherCard: React.FC<VoucherCardProps> = ({ voucher }) => {
  const isSieuRe = voucher.type === 'Shopee Siêu Rẻ';
  const isShopNoiBat = voucher.type === 'Shop Nổi Bật';
  const isXuLy = voucher.type === 'Xử Lý Bởi Shopee';
  const isVoucherXtra = voucher.type === 'Voucher Xtra';

  const renderIcon = () => {
    let IconComponent = ShoppingBag;
    
    if (isSieuRe) IconComponent = Zap;
    else if (isShopNoiBat) IconComponent = Star;
    else if (isXuLy) IconComponent = Truck;
    else if (isVoucherXtra) IconComponent = Tag;

    return (
      <div className="rounded-full w-9 h-9 flex items-center justify-center border border-white/40 bg-white/10 mb-1">
         <IconComponent size={18} className="text-white" fill={isShopNoiBat || isSieuRe ? "currentColor" : "none"} />
      </div>
    );
  };

  return (
    <div className="flex bg-white rounded-lg shadow-sm overflow-hidden h-[120px] w-full border border-gray-100 relative group transition-all hover:shadow-md">
      
      {/* Left Part: Teal/Green Background */}
      <div className="w-[100px] bg-[#26aa99] flex flex-col items-center justify-center gap-1 relative shrink-0 py-2">
        {/* Semi-circle cutout join points */}
        <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-[#f8f9fa] rounded-full z-10 border border-transparent" />
        <div className="absolute -right-1 -bottom-1 w-2.5 h-2.5 bg-[#f8f9fa] rounded-full z-10 border border-transparent" />
        
        {/* Dotted Line overlay on the edge */}
        <div className="absolute right-0 top-1 bottom-1 w-[1px] border-r border-dashed border-white/50" />

        {/* Icon */}
        <div className="relative z-0 mt-1">
          {renderIcon()}
        </div>

        {/* Title */}
        <span className="text-white text-[9px] font-bold text-center px-1 leading-tight uppercase line-clamp-2">
          {voucher.type}
        </span>
        
        {/* HSD at bottom left */}
        <div className="mt-auto mb-1 flex items-center gap-0.5">
             <span className="text-white/90 text-[8px] font-medium">HSD: {voucher.expiryDate || '31/12'}</span>
        </div>
      </div>

      {/* Right Part: Content */}
      <div className="flex-1 p-3 flex flex-col justify-between min-w-0 bg-white relative">
        {/* Cutout mask for the dashed line connection (Optional visual enhancement) */}
        
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-none">
            {voucher.discountAmount.replace('Giảm ', 'Giảm ')}
          </h3>
          
          <div className="flex flex-col gap-0.5 mt-1.5">
            <p className="text-[11px] text-gray-600">
              ĐH tối thiểu: <span className="font-semibold">{voucher.minSpend}</span>
            </p>
            {voucher.note && (
                <p className="text-[10px] text-gray-500 leading-tight line-clamp-1 mt-0.5">
                  <span className="text-red-500 font-bold">Lưu ý: </span>
                  {voucher.note}
                </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto flex items-end justify-between gap-2">
          <a 
            href={voucher.affiliateUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-[#26aa99] font-medium hover:underline mb-1"
          >
            List áp dụng
          </a>

          <a 
            href={voucher.affiliateUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`
              px-3 py-1 rounded text-[10px] font-bold text-white transition-all shadow-sm mb-0.5
              ${voucher.isAppOnly ? 'bg-[#26aa99]' : 'bg-[#26aa99]'}
              hover:bg-[#1f8c7d]
            `}
          >
            {voucher.isAppOnly ? 'Mở App Ngay' : 'Đến Banner'}
          </a>
        </div>
      </div>
    </div>
  );
};
