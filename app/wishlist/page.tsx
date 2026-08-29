'use client';
import Link from 'next/link';
import {ProductGrid} from '@/components/product-grid';
import {useWishlist} from '@/components/wishlist-provider';
import {products} from '@/data/products';
export default function Wishlist(){const{ids,ready,clear}=useWishlist();const items=products.filter(p=>ids.includes(p.id));return <main><section className="editorial-hero"><p className="eyebrow">YOUR SELECTION</p><h1>WISHLIST</h1><p>Pieces held here remain on this device for your return.</p></section><section className="catalog section">{!ready?<p>Loading your selection…</p>:items.length?<><button className="clear-wishlist" onClick={clear}>Clear wishlist</button><ProductGrid items={items}/></>:<div className="empty-state"><h2>YOUR WISHLIST IS EMPTY</h2><p>Save pieces as you explore and return to them here.</p><Link className="btn gold" href="/collections">Explore the collection</Link></div>}</section></main>}
