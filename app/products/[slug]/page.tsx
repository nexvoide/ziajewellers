import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ChevronRight} from 'lucide-react';
import {business} from '@/data/config';
import {formatPrice,products as fallbackProducts} from '@/data/products';
import {getCatalogProduct,getCatalogProducts} from '@/lib/catalog';
import {ProductGallery} from '@/components/product-gallery';
import {ProductGrid} from '@/components/product-grid';
import {ProductActions} from '@/components/product-actions';

export function generateStaticParams(){return fallbackProducts.map(product=>({slug:product.slug}))}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const {slug}=await params;
  const product=await getCatalogProduct(slug);
  if(!product)return {title:'Piece Not Found | Zia Jewellers'};
  return {title:`${product.name} | Zia Jewellers`,description:product.shortDescription,alternates:{canonical:`/products/${slug}`},openGraph:{title:product.name,description:product.shortDescription,images:[product.images[0]],type:'website'},twitter:{card:'summary_large_image',title:product.name,description:product.shortDescription,images:[product.images[0]]}};
}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const products=await getCatalogProducts();
  const product=products.find(item=>item.slug===slug);
  if(!product)notFound();
  const related=products.filter(item=>item.id!==product.id&&(item.category===product.category||item.collection===product.collection)).slice(0,4);
  const schema={'@context':'https://schema.org','@type':'Product',name:product.name,image:product.images.map(src=>new URL(src,business.siteUrl).toString()),description:product.description,brand:{'@type':'Brand',name:business.brand},...(product.price&&{offers:{'@type':'Offer',price:product.price,priceCurrency:'PKR',availability:'https://schema.org/InStock',url:`${business.siteUrl}/products/${product.slug}`}})};
  const breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:business.siteUrl},{'@type':'ListItem',position:2,name:'Collections',item:`${business.siteUrl}/collections`},{'@type':'ListItem',position:3,name:product.name,item:`${business.siteUrl}/products/${product.slug}`}]};
  return <main className="product-page"><div className="breadcrumb"><Link href="/">Home</Link><ChevronRight/><Link href="/collections">Collections</Link><ChevronRight/><span>{product.name}</span></div><section className="product-detail"><ProductGallery images={product.images} name={product.name}/><article className="detail-copy"><p className="eyebrow">{product.collection}</p><h1>{product.name}</h1><p className="detail-price">{formatPrice(product.price)}</p><p className="detail-description">{product.description}</p><dl><div><dt>Gold purity</dt><dd>{product.goldPurity}</dd></div><div><dt>Weight</dt><dd>{product.weight}</dd></div><div><dt>Availability</dt><dd>{product.availability}</dd></div></dl><ProductActions product={product}/><div className="crafted"><span>CRAFTED WITH PRECISION</span><ul>{product.details.map(item=><li key={item}>{item}</li>)}</ul></div></article></section><section className="related section"><p className="eyebrow">CONTINUE DISCOVERING</p><h2>RELATED <em>PIECES</em></h2><ProductGrid items={related.length?related:products.slice(0,4)}/></section><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(breadcrumb)}}/></main>;
}
