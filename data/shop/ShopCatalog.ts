export interface CategoryData {
  id: string;
  label: string;
}

export interface FeatureData {
  title: string;
  desc: string;
}

export interface ShopData {
  label: string;
  title: string;
  subtitle: string;
  desc1: string;
  desc2: string;
  qrAlt: string;
  scanText: string;
  feat1: string;
  feat2: string;
  feat3: string;
  note: string;
  searchLabel: string;
  searchPlaceholder: string;
  categoriesTitle: string;
  noItemsText: string;
  moreDetailsBtn: string;
  lineChatBtn: string;
  adLabel: string;
  qrImage: string;
  categories: CategoryData[];
  features: FeatureData[];
}

export const shopData: Record<'th' | 'en', ShopData> = {
  th: {
    label: "🛒 Online Store",
    title: "Pawplan Shop",
    subtitle: "ดูสินค้าและสั่งซื้อผ่าน LINE Official Account",
    desc1: "ผลิตภัณฑ์ทั้งหมดคัดสรรและแนะนำโดยทีมสัตวแพทย์ของเรา",
    desc2: "สแกน QR Code หรือกดปุ่มเพื่อเพิ่มเพื่อนและเลือกชมสินค้า",
    qrAlt: "QR Code LINE Official Account Pawplan",
    scanText: "สแกนเพื่อเข้าสู่ร้านค้าออนไลน์",
    feat1: "คัดสรรโดยสัตวแพทย์",
    feat2: "มีเจ้าหน้าที่ให้คำแนะนำ",
    feat3: "จัดส่งทั่วประเทศ",
    note: "มีเจ้าหน้าที่พร้อมให้คำแนะนำสินค้าที่เหมาะสมกับสัตว์เลี้ยงของคุณ ทุกวัน 9:00–18:00 น.",
    searchLabel: 'ค้นหาสินค้า',
    searchPlaceholder: 'พิมพ์ชื่อสินค้า...',
    categoriesTitle: 'หมวดหมู่สินค้า',
    noItemsText: 'ไม่พบข้อมูลที่ตรงกับการค้นหา',
    moreDetailsBtn: 'ดูรายละเอียดเพิ่มเติม',
    lineChatBtn: 'พูดคุยทาง LINE Official',
    adLabel: 'โฆษณา',
    qrImage: "/assets/line.png",
    categories: [
      { id: 'all', label: 'ทั้งหมด' },
      { id: 'food', label: 'อาหารและขนม' },
      { id: 'grooming', label: 'กรูมมิ่ง & แชมพู' },
      { id: 'health', label: 'วิตามินและยา' },
      { id: 'toys', label: 'ของเล่นสัตว์เลี้ยง' }
    ],
    features: [
      { title: 'คัดสรรโดยสัตวแพทย์', desc: 'ปลอดภัย มีคุณภาพสูง' },
      { title: 'มีเจ้าหน้าที่ให้คำแนะนำ', desc: 'แนะนำสินค้าที่ตรงจุด' },
      { title: 'จัดส่งทั่วประเทศ', desc: 'จัดส่งไว ทั่วประเทศไทย' },
    ]
  },
  en: {
    label: "🛒 Online Store",
    title: "Pawplan Shop",
    subtitle: "Browse and order via LINE Official Account",
    desc1: "All products are curated and recommended by our veterinary team.",
    desc2: "Scan the QR Code or tap the button to add us as a friend and browse products.",
    qrAlt: "Pawplan LINE Official Account QR code",
    scanText: "Scan to enter the online store",
    feat1: "Vet-curated products",
    feat2: "Staff available for advice",
    feat3: "Nationwide delivery",
    note: "Our staff is ready to recommend the right products for your pet, every day 9:00–18:00.",
    searchLabel: 'Search Products',
    searchPlaceholder: 'Product name...',
    categoriesTitle: 'Categories',
    noItemsText: 'No items match your search',
    moreDetailsBtn: 'More Details',
    lineChatBtn: 'Chat via LINE Official',
    adLabel: 'Ad',
    qrImage: "/assets/line.png",
    categories: [
      { id: 'all', label: 'All Products' },
      { id: 'food', label: 'Food & Treats' },
      { id: 'grooming', label: 'Grooming & Shampoo' },
      { id: 'health', label: 'Health & Vitamins' },
      { id: 'toys', label: 'Toys & Accessories' }
    ],
    features: [
      { title: 'Vet-curated products', desc: 'Safe & high quality' },
      { title: 'Staff available for advice', desc: 'Targeted recommendations' },
      { title: 'Nationwide delivery', desc: 'Fast delivery across Thailand' },
    ]
  }
};
