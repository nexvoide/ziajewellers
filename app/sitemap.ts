import type { MetadataRoute } from 'next';
import {business} from '@/data/config';
import {products} from '@/data/products';
export default function sitemap():MetadataRoute.Sitemap{const routes=['','/collections','/collections/bridal','/collections/gold','/collections/mens','/bridal','/wishlist'];return [...routes.map((route,index)=>({url:`${business.siteUrl}${route}`,lastModified:new Date(),changeFrequency:'weekly' as const,priority:index===0?1:.8})),...products.map(product=>({url:`${business.siteUrl}/products/${product.slug}`,lastModified:new Date(),changeFrequency:'monthly' as const,priority:.7}))]}
