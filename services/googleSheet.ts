
import { Product, Retailer } from '../types';

// Link Google Sheet chính xác định dạng CSV
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQuh7Fs6dkMjnngVul15-wkm_8GHdsxi2mu-MsjgDHmqEr9BTV3eO2TExZMiF7d7tboZiP9q95yrYhS/pub?gid=0&single=true&output=csv';

// Hàm chuẩn hóa key để so sánh dễ hơn (xóa dấu, về chữ thường, xóa khoảng trắng)
const normalizeKey = (key: string) => {
  return key.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
    .replace(/[^a-z0-9]/g, '') // Xóa ký tự đặc biệt và khoảng trắng
    .trim();
};

// Từ điển ánh xạ cột (Mapping) mở rộng - Ưu tiên các từ khóa chính xác
const COLUMN_MAP = {
  id: ['id', 'stt', 'ma', 'masp', 'masanpham', 'sku', 'code'],
  title: ['ten', 'tensanpham', 'tensp', 'tieude', 'name', 'title', 'productname', 'tenhang', 'tenmathang'],
  brand: ['thuonghieu', 'brand', 'hang', 'nsx', 'manufacturer', 'hieu', 'nhanhieu', 'tenbrand'],
  // 'danhmuc' và 'danhmucsanpham' đặt đầu tiên để ưu tiên tìm kiếm
  category: ['danhmucsanpham', 'danhmuc', 'loai', 'loaisanpham', 'nhom', 'nhomhang', 'nganh', 'nganhhang', 'category', 'cat', 'tendanhmuc'],
  priceOriginal: ['giagoc', 'giathitruong', 'gianiye', 'originalprice', 'oldprice', 'marketprice', 'original', 'giabia'],
  priceSale: ['giaban', 'giasale', 'giakhuyenmai', 'saleprice', 'dealprice', 'specialprice', 'sale', 'giamoi'],
  priceGeneric: ['gia', 'price', 'amount', 'giatien', 'dongia', 'cost', 'giabanle'],
  discount: ['giam', 'giamgia', 'khuyenmai', 'discount', 'sale', 'percent', 'phantram'],
  image: ['anh', 'hinhanh', 'hinh', 'linkanh', 'image', 'img', 'thumb', 'thumbnail', 'anhsanpham', 'urlanh', 'hinh_anh', 'link_anh'],
  retailer: ['noiban', 'san', 'shop', 'retailer', 'seller', 'store', 'nguon', 'cuahang'],
  link: ['link', 'lienket', 'muatai', 'url', 'affiliate', 'linkmua', 'linksanpham', 'duongdan', 'muangay'],
  coupon: ['coupon', 'ma', 'code', 'magiamgia', 'voucher', 'uudai', 'giamgia', 'macoupon'],
  isHot: ['ishot', 'hot', 'noibat', 'spnoibat', 'banchay'],
  soldCount: ['daban', 'sold', 'soluongban', 'sales', 'luotban', 'luotmua'],
  description: ['mota', 'description', 'detail', 'motasanpham', 'content', 'chitiet'],
  shortDescription: ['motangan', 'shortdescription', 'mota_ngan', 'tomtat', 'brief', 'summary'],
  status: ['trangthai', 'status', 'tinhtrang', 'state', 'trang_thai', 'tinh_trang', 'hienthi']
};

// Ánh xạ danh mục từ Sheet sang Slug của Web
const CATEGORY_SLUG_MAP: Record<string, string> = {
  'thời trang': 'fashion',
  'thoi trang': 'fashion',
  'quần áo': 'fashion',
  'quan ao': 'fashion',
  'giày': 'footwear',
  'giay': 'footwear',
  'dép': 'footwear',
  'dep': 'footwear',
  'phụ kiện': 'accessories',
  'phu kien': 'accessories',
  'trang sức': 'accessories',
  'mỹ phẩm': 'beauty',
  'my pham': 'beauty',
  'làm đẹp': 'beauty',
  'lam dep': 'beauty',
  'son': 'beauty',
  'kem': 'beauty',
  'mẹ': 'mom-baby-toys',
  'be': 'mom-baby-toys',
  'đồ chơi': 'mom-baby-toys',
  'do choi': 'mom-baby-toys',
  'sức khỏe': 'health',
  'suc khoe': 'health',
  'thực phẩm': 'health',
  'giặt': 'home-care',
  'giat': 'home-care',
  'nhà': 'home-care',
  'nha': 'home-care',
  'gia dụng': 'home-care',
  'đời sống': 'home-care',
  'bách hóa': 'home-care',
  'thiết bị': 'accessories',
  'điện tử': 'accessories',
  'balo': 'accessories',
  'túi': 'accessories',
  'ví': 'accessories'
};

// Hàm tìm giá trị được cập nhật để ưu tiên các từ khóa trong aliases (theo thứ tự)
const findValue = (rowObj: any, aliases: string[]) => {
  const rowKeys = Object.keys(rowObj);
  // Tạo map các key đã chuẩn hóa
  const normalizedKeys = rowKeys.map(k => ({ original: k, normalized: normalizeKey(k) }));

  // 1. Tìm khớp chính xác (Exact Match) - Ưu tiên cao nhất
  for (const alias of aliases) {
    const exactMatch = normalizedKeys.find(k => k.normalized === alias);
    if (exactMatch) return rowObj[exactMatch.original];
  }

  // 2. Tìm khớp một phần (Partial Match) - Ưu tiên thấp hơn
  for (const alias of aliases) {
    const partialMatch = normalizedKeys.find(k => {
       // Bảo vệ: Nếu đang tìm 'danhmuc' hoặc 'ten', tránh các cột bắt đầu bằng 'ma' hoặc 'id'
       if ((alias === 'danhmuc' || alias === 'danhmucsanpham' || alias === 'category') && 
           (k.normalized.startsWith('ma') || k.normalized.startsWith('id') || k.normalized.startsWith('code'))) {
           return false;
       }
       return k.normalized.length > 2 && k.normalized.includes(alias);
    });
    
    if (partialMatch) return rowObj[partialMatch.original];
  }

  return undefined;
};

// Hàm xử lý giá tiền và số lượng
const parseNumber = (str: any): number => {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  // Xóa tất cả ký tự không phải số (giữ lại số nguyên)
  const cleanStr = str.toString().replace(/[^0-9]/g, '');
  return parseFloat(cleanStr) || 0;
};

// Robust CSV Parsing
const parseCSVText = (text: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i+1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; 
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField);
      rows.push(currentRow);
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }
  return rows;
};

// Hàm thông minh để tìm dòng tiêu đề thật sự
const findHeaderRowIndex = (rows: string[][]): number => {
  // Quét 10 dòng đầu tiên
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i];
    const normalizedRow = row.map(cell => normalizeKey(cell));
    
    const hasName = normalizedRow.some(c => COLUMN_MAP.title.some(k => c.includes(k)));
    const hasPrice = normalizedRow.some(c => COLUMN_MAP.priceGeneric.some(k => c.includes(k)) || COLUMN_MAP.priceSale.some(k => c.includes(k)));
    const hasCode = normalizedRow.some(c => COLUMN_MAP.id.some(k => c.includes(k)));
    const hasStatus = normalizedRow.some(c => COLUMN_MAP.status.some(k => c.includes(k)));

    if (hasName && (hasPrice || hasCode || hasStatus)) {
      console.log(`GoogleSheet: Found header at row ${i}:`, row);
      return i;
    }
  }
  // Fallback
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
     if (rows[i].filter(c => c.trim().length > 0).length >= 3) {
       console.log(`GoogleSheet: Fallback header at row ${i}`);
       return i;
     }
  }
  return 0;
};

const parseCSV = (csvText: string): Product[] => {
  const products: Product[] = [];
  const rows = parseCSVText(csvText);
  
  if (rows.length < 2) return [];

  const headerRowIndex = findHeaderRowIndex(rows);
  const headers = rows[headerRowIndex].map(h => h.trim());

  console.log('GoogleSheet Headers Detected:', headers);

  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const rowValues = rows[i];
    
    if (rowValues.length === 0 || rowValues.every(val => !val.trim())) continue;

    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      if (idx < rowValues.length) {
         obj[h] = rowValues[idx] || '';
      }
    });

    // --- LOGIC LỌC SẢN PHẨM ---
    const status = findValue(obj, COLUMN_MAP.status);
    const isDone = status && status.toString().trim().toLowerCase() === 'done';
    
    if (!isDone) continue;

    const title = findValue(obj, COLUMN_MAP.title);
    if (!title) continue;

    let productId = findValue(obj, COLUMN_MAP.id);
    if (!productId) {
      productId = normalizeKey(title).substring(0, 10) + `-${i}`;
    }

    const description = findValue(obj, COLUMN_MAP.description);
    const shortDescription = findValue(obj, COLUMN_MAP.shortDescription);

    // Randoms
    const seedStr = title + productId;
    let hash = 0x811c9dc5;
    for (let j = 0; j < seedStr.length; j++) {
        hash ^= seedStr.charCodeAt(j);
        hash = Math.imul(hash, 0x01000193);
    }
    const seed1 = (hash >>> 0) / 4294967296;
    const seed2 = ((hash ^ 0x55555555) >>> 0) / 4294967296;
    const seed3 = ((hash ^ 0xAAAAAAAA) >>> 0) / 4294967296;

    const randomRating = 4.8 + (seed1 * 0.2);
    const randomReviewCount = 1000 + Math.floor(seed2 * 4001);
    
    const sheetSoldCount = parseNumber(findValue(obj, COLUMN_MAP.soldCount));
    const finalSoldCount = sheetSoldCount > 0 ? sheetSoldCount : 1000 + Math.floor(seed3 * 8001);

    // PRICE LOGIC
    const rawValOriginal = findValue(obj, COLUMN_MAP.priceOriginal);
    const rawValSale = findValue(obj, COLUMN_MAP.priceSale);
    const rawValGeneric = findValue(obj, COLUMN_MAP.priceGeneric);
    const rawDiscount = findValue(obj, COLUMN_MAP.discount);

    let valOriginal = parseNumber(rawValOriginal);
    let valSale = parseNumber(rawValSale);
    let valGeneric = parseNumber(rawValGeneric);
    let valDiscount = parseNumber(rawDiscount);

    let priceRegular = 0, priceDeal = 0;

    if (valOriginal > 0 && valSale > 0) {
        priceRegular = valOriginal;
        priceDeal = valSale;
    } else if (valOriginal > 0 && valGeneric > 0) {
        priceRegular = valOriginal;
        priceDeal = valGeneric;
    } else if (valSale > 0) {
        priceDeal = valSale;
        priceRegular = valDiscount > 0 
           ? (valDiscount <= 100 ? priceDeal / (1 - valDiscount/100) : priceDeal + valDiscount) 
           : priceDeal * 1.2;
    } else if (valGeneric > 0) {
        priceDeal = valGeneric;
        priceRegular = valDiscount > 0 
           ? (valDiscount <= 100 ? priceDeal / (1 - valDiscount/100) : priceDeal + valDiscount) 
           : priceDeal;
    }

    if (priceDeal > priceRegular && priceRegular > 0) {
        priceRegular = priceDeal * 1.1; 
    }

    let discountPercent = (priceRegular > 0 && priceDeal > 0 && priceRegular > priceDeal)
        ? Math.round(((priceRegular - priceDeal) / priceRegular) * 100)
        : 0;

    if (priceDeal === 0) priceDeal = priceRegular;
    if (priceRegular === 0) priceRegular = priceDeal;

    // RETAILER
    let retailerEnum = Retailer.SHOPEE;
    const rInput = (findValue(obj, COLUMN_MAP.retailer) || '').toLowerCase();
    if (rInput.includes('lazada')) retailerEnum = Retailer.LAZADA;
    else if (rInput.includes('tiki')) retailerEnum = Retailer.TIKI;
    else if (rInput.includes('tiktok')) retailerEnum = Retailer.TIKTOK;
    else if (rInput.includes('amazon')) retailerEnum = Retailer.AMAZON;

    // IMAGES
    const rawImages = findValue(obj, COLUMN_MAP.image) || '';
    const imageUrls = rawImages.split('|').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
    const mainImage = imageUrls.length > 0 ? imageUrls[0] : 'https://via.placeholder.com/400?text=No+Image';

    // BRAND & CATEGORY
    const brandFromSheet = findValue(obj, COLUMN_MAP.brand) || 'Đang cập nhật';
    
    // Tìm category - Ưu tiên cột "danhmuc"
    const categoryFromSheet = findValue(obj, COLUMN_MAP.category) || '';
    
    let mappedCategory = 'others';
    const catLower = categoryFromSheet.toLowerCase();
    
    let foundCat = false;
    for (const [key, slug] of Object.entries(CATEGORY_SLUG_MAP)) {
      if (catLower.includes(key)) {
        mappedCategory = slug;
        foundCat = true;
        break;
      }
    }
    
    products.push({
      id: productId,
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId: mappedCategory, 
      brand: brandFromSheet,
      imageUrl: mainImage,
      imageUrls: imageUrls,
      priceRegular,
      priceDeal,
      discountPercent,
      rating: randomRating,
      ratingCount: randomReviewCount,
      soldCount: finalSoldCount,
      retailer: retailerEnum,
      affiliateUrl: findValue(obj, COLUMN_MAP.link) || '#',
      isHot: !!findValue(obj, COLUMN_MAP.isHot),
      isDeal: discountPercent > 0,
      tags: [],
      specs: {},
      couponCode: findValue(obj, COLUMN_MAP.coupon),
      description: description,
      shortDescription: shortDescription
    });
  }
  
  console.log(`GoogleSheet: Parsed ${products.length} products.`);
  return products;
};

export const fetchProductsFromSheet = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${SHEET_CSV_URL}&t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch sheet');
    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error("fetchProductsFromSheet Error:", error);
    return [];
  }
};
