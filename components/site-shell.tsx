'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {ArrowUpRight, X} from 'lucide-react';
import type {Product} from '@/data/products';
import {Navbar} from './navbar';
import {SearchOverlay} from './search-overlay';
import {WhatsappButton} from './whatsapp-button';
import {WishlistProvider} from './wishlist-provider';

const DISMISS_KEY = 'zia-product-spotlight-dismissed';
export function SiteShell({children,products}: {children: React.ReactNode;products:Product[]}) {
  const spotlightProducts=products.filter(product=>product.trending);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [search, setSearch] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === '1') return;

    const hero = document.getElementById('top');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && window.scrollY > 0) {
          setShowSpotlight(true);
          observer.disconnect();
        }
      },
      {threshold: 0.05},
    );
    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const rotation = window.setInterval(() => {
      setSpotlightIndex((current) => spotlightProducts.length?(current + 1) % spotlightProducts.length:0);
    }, 7000);
    return () => window.clearInterval(rotation);
  }, [spotlightProducts.length]);

  function dismissSpotlight() {
    sessionStorage.setItem(DISMISS_KEY, '1');
    setShowSpotlight(false);
  }

  const spotlight = spotlightProducts[spotlightIndex];

  return (
    <WishlistProvider>
      <Navbar onSearch={() => setSearch(true)} />
      <SearchOverlay products={products} open={search} onClose={() => setSearch(false)} />
      <div className="page-enter">{children}</div>
      <WhatsappButton />
      {showSpotlight && spotlight && (
        <aside className="product-spotlight" aria-live="polite" aria-label="Featured Zia collection piece">
          <a className="spotlight-image" href={`/products/${spotlight.slug}`} tabIndex={-1} aria-hidden="true">
            <Image src={spotlight.images[0]} alt="" fill sizes="64px" />
          </a>
          <div className="spotlight-copy">
            <span>✦ CURATED AT ZIA · NAWABSHAH</span>
            <strong>{spotlight.name}</strong>
            <small>{spotlight.goldPurity} gold · {spotlight.availability}</small>
          </div>
          <a className="spotlight-link" href={`/products/${spotlight.slug}`} aria-label={`View ${spotlight.name}`}>
            View piece <ArrowUpRight size={14} />
          </a>
          <button className="spotlight-close" type="button" aria-label="Dismiss featured piece" onClick={dismissSpotlight}><X size={15} /></button>
        </aside>
      )}
    </WishlistProvider>
  );
}
