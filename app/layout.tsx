import type { Metadata } from 'next';
import './globals.css';
import {SiteShell} from '@/components/site-shell';
import {business} from '@/data/config';
import {getCatalogProducts} from '@/lib/catalog';

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: 'Zia Jewellers | Timeless Gold Jewelry',
  description: 'Discover timeless gold jewelry from Zia Jewellers — crafted with precision, designed for generations.',
  alternates:{canonical:'/'},
  openGraph: { title: 'Zia Jewellers', description: 'Timeless pieces. Exceptional craftsmanship.', type:'website',images:['/opengraph-image'] },
  twitter:{card:'summary_large_image',title:'Zia Jewellers',description:'Timeless gold. Eternal stories.',images:['/opengraph-image']},
};

const schema = { '@context':'https://schema.org', '@type':['Organization','JewelryStore'], name:business.brand, description:'Fine gold jewellery crafted for generations.', url:business.siteUrl,...(business.phone&&{telephone:business.phone}),...(business.address&&{address:business.address}),...(business.openingHours&&{openingHours:business.openingHours}),...((business.instagram||business.facebook)&&{sameAs:[business.instagram,business.facebook].filter(Boolean)}) };

export default async function RootLayout({children}:{children:React.ReactNode}) {
  const products=await getCatalogProducts();
  return <html lang="en"><body><SiteShell products={products}>{children}</SiteShell><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} /></body></html>;
}
