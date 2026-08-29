import {unstable_noStore as noStore} from 'next/cache';
import {createClient} from '@supabase/supabase-js';

export type WebsiteImage={slot:string;label:string;section:string;imageUrl:string;mobileImageUrl:string|null;altText:string;objectPosition:string;sortOrder:number};
const defaults:WebsiteImage[]=[
  {slot:'hero-1',label:'Hero slide 1',section:'Hero',imageUrl:'/images/campaigns/hero-user-v1.jpg',mobileImageUrl:null,altText:'Three women presenting distinct Zia Jewellers gold collections',objectPosition:'right top',sortOrder:1},
  {slot:'hero-2',label:'Hero slide 2',section:'Hero',imageUrl:'/images/zia-hero.jpg',mobileImageUrl:null,altText:'Zia Jewellers gold campaign portrait',objectPosition:'right center',sortOrder:2},
  {slot:'hero-3',label:'Hero slide 3',section:'Hero',imageUrl:'/images/campaigns/bridal-campaign-brand-v2.jpg',mobileImageUrl:null,altText:'Zia bridal gold collection campaign',objectPosition:'center center',sortOrder:3},
  {slot:'royal-heritage',label:'Royal Heritage feature',section:'Collections',imageUrl:'/images/campaigns/velvet-gold-set-brand-v2.jpg',mobileImageUrl:null,altText:'Royal Heritage gold collection',objectPosition:'center center',sortOrder:1},
  {slot:'jewel-focus',label:'Jewel in Focus',section:'Features',imageUrl:'/images/campaigns/heritage-stone-set-brand-v2.jpg',mobileImageUrl:null,altText:'Meher Choker details',objectPosition:'75% center',sortOrder:1},
  {slot:'heritage-story',label:'Our Heritage portrait',section:'Features',imageUrl:'/images/campaigns/necklace-portrait-brand-v2.jpg',mobileImageUrl:null,altText:'Zia craftsmanship and heritage',objectPosition:'70% center',sortOrder:2},
  {slot:'bridal-banner',label:'Bridal campaign banner',section:'Bridal',imageUrl:'/images/campaigns/bridal-campaign-brand-v2.jpg',mobileImageUrl:null,altText:'Zia bridal gold collection',objectPosition:'center center',sortOrder:1},
  ...['necklace-portrait-brand-v2.jpg','earrings-portrait-brand-v2.jpg','velvet-gold-set-brand-v2.jpg','bangles-portrait-brand-v2.jpg','ring-square-brand-v2.jpg'].map((file,index)=>({slot:`gallery-${index+1}`,label:`Gallery image ${index+1}`,section:'Gallery',imageUrl:`/images/campaigns/${file}`,mobileImageUrl:null,altText:`Zia jewellery gallery image ${index+1}`,objectPosition:index<2?'center 35%':'center center',sortOrder:index+1})),
];
type Row={slot:string;label:string;section:string;image_url:string;mobile_image_url:string|null;alt_text:string;object_position:string;sort_order:number};
const mapRow=(row:Row):WebsiteImage=>({slot:row.slot,label:row.label,section:row.section,imageUrl:row.image_url,mobileImageUrl:row.mobile_image_url,altText:row.alt_text,objectPosition:row.object_position,sortOrder:row.sort_order});
export async function getWebsiteImages(){noStore();const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;if(!url||!key)return defaults;try{const{data,error}=await createClient(url,key,{auth:{persistSession:false}}).from('website_images').select('*').order('section').order('sort_order');return error||!data?.length?defaults:(data as Row[]).map(mapRow)}catch{return defaults}}
export function imageSlot(images:WebsiteImage[],slot:string){return images.find(image=>image.slot===slot)??defaults.find(image=>image.slot===slot)!}
