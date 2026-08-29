import {randomUUID} from 'node:crypto';
import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {COOKIE_NAME,verifySession} from '@/lib/rates-auth';
import {createAdminClient} from '@/lib/supabase/admin';

export const runtime='nodejs';
const allowedTypes=new Map([['image/jpeg','jpg'],['image/png','png'],['image/webp','webp']]);
async function authorized(){const store=await cookies();return verifySession(store.get(COOKIE_NAME)?.value)}
function unauthorized(){return NextResponse.json({error:'Unauthorized.'},{status:401})}
function productId(value:string){const id=Number(value);if(!Number.isSafeInteger(id)||id<=0)throw new Error('Invalid article ID.');return id}
function required(form:FormData,key:string,max:number){const value=form.get(key);if(typeof value!=='string'||!value.trim()||value.trim().length>max)throw new Error(`Enter a valid ${key}.`);return value.trim()}
async function upload(file:File){if(!allowedTypes.has(file.type)||file.size<=0||file.size>6*1024*1024)throw new Error('Each image must be JPG, PNG, or WebP and no larger than 6MB.');const path=`articles/${randomUUID()}.${allowedTypes.get(file.type)}`;const supabase=createAdminClient();const {error}=await supabase.storage.from('product-images').upload(path,file,{contentType:file.type,upsert:false});if(error)throw error;return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl}
async function removeStoredImages(images:string[]){const prefix='/storage/v1/object/public/product-images/';const paths=images.map(url=>{const index=url.indexOf(prefix);return index<0?null:decodeURIComponent(url.slice(index+prefix.length))}).filter((path):path is string=>Boolean(path));if(paths.length)await createAdminClient().storage.from('product-images').remove(paths)}

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){
  if(!await authorized())return unauthorized();
  try{
    const id=productId((await params).id);const form=await request.formData();const supabase=createAdminClient();
    const {data:current,error:readError}=await supabase.from('products').select('images,trending,new_arrival').eq('id',id).single();if(readError)throw readError;
    const files=form.getAll('images').filter((item):item is File=>item instanceof File&&item.size>0);
    if(files.length!==0&&files.length!==2)throw new Error('Choose both replacement images, or leave both unchanged.');
    const priceValue=form.get('price');const price=typeof priceValue==='string'&&priceValue.trim()?Number(priceValue):null;if(price!==null&&(!Number.isFinite(price)||price<=0))throw new Error('Enter a valid price or leave it empty.');
    const replacementImages=files.length===2?await Promise.all(files.map(upload)):null;
    const category=required(form,'category',40);const update={name:required(form,'name',100),slug:required(form,'slug',100).toLowerCase(),category,collection:required(form,'collection',60),price,gold_purity:required(form,'goldPurity',20),weight:required(form,'weight',80),description:required(form,'description',1000),short_description:required(form,'shortDescription',240),...(replacementImages&&{images:replacementImages}),featured:true,trending:Boolean(current?.trending),new_arrival:Boolean(current?.new_arrival),bridal:category==='Bridal',gender:required(form,'gender',20),availability:required(form,'availability',40),details:required(form,'details',500).split('\n').map(item=>item.trim()).filter(Boolean).slice(0,8),published:true,updated_at:new Date().toISOString()};
    const {data,error}=await supabase.from('products').update(update).eq('id',id).select().single();if(error){if(replacementImages)await removeStoredImages(replacementImages);throw error}if(replacementImages)await removeStoredImages((current?.images??[]) as string[]);return NextResponse.json({product:data});
  }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Unable to update article.'},{status:400})}
}

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){if(!await authorized())return unauthorized();try{const id=productId((await params).id);const supabase=createAdminClient();const {data,error:readError}=await supabase.from('products').select('images').eq('id',id).single();if(readError)throw readError;const {error}=await supabase.from('products').delete().eq('id',id);if(error)throw error;await removeStoredImages((data?.images??[]) as string[]);return NextResponse.json({success:true})}catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Unable to delete article.'},{status:400})}}
