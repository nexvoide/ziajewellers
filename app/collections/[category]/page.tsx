import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {Suspense} from 'react';
import {CatalogClient} from '@/components/catalog-client';
import type {Product} from '@/data/products';
import {getCatalogProducts} from '@/lib/catalog';
const allowed={bridal:{title:'The Bridal Collection',copy:'Ceremonial gold for the moment that changes everything.',filter:(p:Product)=>p.bridal},gold:{title:'Gold, Considered',copy:'Exceptional forms in 18K and 22K gold.',filter:(p:Product)=>p.goldPurity.includes('K')},mens:{title:"The Men’s Edit",copy:'Restrained silhouettes, purposeful weight, enduring character.',filter:(p:Product)=>p.gender==='Men'}};
export function generateStaticParams(){return Object.keys(allowed).map(category=>({category}))}
export async function generateMetadata({params}:{params:Promise<{category:string}>}):Promise<Metadata>{const{category}=await params;const item=allowed[category as keyof typeof allowed];return item?{title:`${item.title} | Zia Jewellers`,description:item.copy,alternates:{canonical:`/collections/${category}`}}:{title:'Collection Not Found'}}
export default async function CollectionPage({params}:{params:Promise<{category:string}>}){const{category}=await params;const item=allowed[category as keyof typeof allowed];if(!item)notFound();const products=await getCatalogProducts();return <main><section className={`editorial-hero ${category}`}><p className="eyebrow">ZIA JEWELLERS</p><h1>{item.title.toUpperCase()}</h1><p>{item.copy}</p></section><section className="catalog section"><Suspense><CatalogClient items={products.filter(item.filter)} lockedFilter={category}/></Suspense></section></main>}
