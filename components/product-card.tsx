'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Heart} from 'lucide-react';
import type {Product} from '@/data/products';
import {useWishlist} from './wishlist-provider';

export function ProductCard({product}:{product:Product}){
  const {has,toggle}=useWishlist();
  const saved=has(product.id);
  return <article className="product">
    <Link className="product-visual" href={`/products/${product.slug}`}>
      <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 700px) 100vw, 25vw"/>
      <Image className="secondary" src={product.images[1]} alt={`${product.name}, alternate view`} fill sizes="(max-width: 700px) 100vw, 25vw"/>
      <span>VIEW PIECE</span>
    </Link>
    <button className={`heart ${saved?'saved':''}`} aria-label={`${saved?'Remove':'Add'} ${product.name} ${saved?'from':'to'} wishlist`} onClick={()=>toggle(product.id)}><Heart size={17} fill={saved?'currentColor':'none'}/></button>
    <div className="product-info"><div><small>{product.category} · {product.goldPurity}</small><Link href={`/products/${product.slug}`}><h3>{product.name}</h3></Link></div></div>
  </article>;
}
