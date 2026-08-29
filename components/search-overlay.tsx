'use client';

import Image from 'next/image';
import Link from 'next/link';
import {Search, X} from 'lucide-react';
import {useEffect, useMemo, useRef, useState} from 'react';
import {formatPrice, type Product} from '@/data/products';

export function SearchOverlay({open,onClose,products}:{open:boolean;onClose:()=>void;products:Product[]}) {
  const [query,setQuery]=useState('');
  const input=useRef<HTMLInputElement>(null);
  useEffect(()=>{document.body.classList.toggle('locked',open);if(open)setTimeout(()=>input.current?.focus(),50);const key=(event:KeyboardEvent)=>event.key==='Escape'&&onClose();addEventListener('keydown',key);return()=>{removeEventListener('keydown',key);document.body.classList.remove('locked')}},[open,onClose]);
  const results=useMemo(()=>{const term=query.toLowerCase().trim();if(!term)return products.filter(product=>product.featured).slice(0,4);return products.filter(product=>[product.name,product.category,product.collection,product.goldPurity,...product.details].join(' ').toLowerCase().includes(term))},[query,products]);
  if(!open)return null;
  return <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Product search" onMouseDown={event=>event.target===event.currentTarget&&onClose()}><button className="overlay-close" onClick={onClose} aria-label="Close search"><X/></button><div className="search-inner"><p className="eyebrow">DISCOVER ZIA</p><label><Search/><input ref={input} value={query} onChange={event=>setQuery(event.target.value)} placeholder="Search pieces, collections, purity…" aria-label="Search products"/></label><p className="result-label">{query?`${results.length} RESULTS`:'FEATURED PIECES'}</p>{results.length?<div className="search-results">{results.map(product=><Link href={`/products/${product.slug}`} onClick={onClose} key={product.id}><Image src={product.images[0]} alt="" width={90} height={110}/><span><b>{product.name}</b><small>{product.category} · {product.goldPurity}</small><em>{formatPrice(product.price)}</em></span></Link>)}</div>:<div className="empty-state"><h2>NOTHING FOUND</h2><p>Try a product name, collection, category, or gold purity.</p></div>}</div></div>;
}
