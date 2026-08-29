import {unstable_noStore as noStore} from 'next/cache';
import {createClient} from '@supabase/supabase-js';
import {products as fallbackProducts, type Product} from '@/data/products';

type ProductRow = {
  id:number; name:string; slug:string; category:Product['category']; collection:string; price:number|null;
  gold_purity:string; weight:string; description:string; short_description:string; images:string[];
  featured:boolean; trending:boolean; new_arrival:boolean; bridal:boolean; gender:Product['gender'];
  availability:Product['availability']; details:string[]; published:boolean;
};

export function rowToProduct(row: ProductRow): Product {
  return {id:row.id,name:row.name,slug:row.slug,category:row.category,collection:row.collection,price:row.price,goldPurity:row.gold_purity,weight:row.weight,description:row.description,shortDescription:row.short_description,images:row.images,featured:row.featured,trending:row.trending,newArrival:row.new_arrival,bridal:row.bridal,gender:row.gender,availability:row.availability,details:row.details};
}

export async function getCatalogProducts(): Promise<Product[]> {
  noStore();
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)return fallbackProducts;
  try{
    const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data,error}=await client.from('products').select('*').eq('published',true).order('id');
    if(error||!data?.length)return fallbackProducts;
    return (data as ProductRow[]).map(rowToProduct);
  }catch{return fallbackProducts}
}

export async function getCatalogProduct(slug:string){return (await getCatalogProducts()).find(product=>product.slug===slug)}
