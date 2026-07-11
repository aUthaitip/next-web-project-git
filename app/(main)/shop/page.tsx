'use client';

import ShopCatalog from '@/components/shop/ShopCatalog';

export default function ShopPage() {
  return (
    <section className="shop-page" style={{ position: 'relative' }}>
      <div className="shop-page__bg-blob shop-page__bg-blob--1" />
      <div className="shop-page__bg-blob shop-page__bg-blob--2" />
      <ShopCatalog />
    </section>
  );
}