import type {Metadata} from 'next';
import {Suspense} from 'react';
import {CatalogClient} from '@/components/catalog-client';
import {getCatalogProducts} from '@/lib/catalog';
export const metadata:Metadata={title:'Gold Jewelry Collections | Zia Jewellers',description:'Explore gold rings, necklaces, earrings, bangles, bridal sets, and men’s jewelry from Zia Jewellers.',alternates:{canonical:'/collections'}};
export default async function Collections(){const products=await getCatalogProducts();return <main><section className="editorial-hero"><p className="eyebrow">THE COMPLETE EDIT</p><h1>COLLECTIONS<br/><em>OF CHARACTER</em></h1><p>Gold shaped with purpose, made to carry meaning beyond the moment.</p></section><section className="catalog section"><Suspense><CatalogClient items={products}/></Suspense></section></main>}
