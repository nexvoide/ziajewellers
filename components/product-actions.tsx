'use client';
import {Heart,MessageCircle} from 'lucide-react';
import {Product} from '@/data/products';
import {business,messages,whatsappUrl} from '@/data/config';
import {useWishlist} from './wishlist-provider';
export function ProductActions({product}:{product:Product}){const{has,toggle}=useWishlist();return <div className="detail-actions">{business.whatsapp?<a className="btn gold" href={whatsappUrl(messages.product(product.name))}><MessageCircle size={16}/> Enquire on WhatsApp</a>:<div className="config-note">WhatsApp number is not configured. Add it in the environment before launch.</div>}<button className="btn ghost" onClick={()=>toggle(product.id)}><Heart size={16} fill={has(product.id)?'currentColor':'none'}/>{has(product.id)?'Remove from':'Add to'} wishlist</button></div>}
