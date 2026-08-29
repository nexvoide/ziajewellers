'use client';

import Image from 'next/image';
import {FormEvent,useCallback,useEffect,useState} from 'react';
import {CheckCircle2,Edit3,ImagePlus,PackagePlus,Trash2,X} from 'lucide-react';

type ArticleRow={id:number;name:string;slug:string;category:string;collection:string;price:number|null;gold_purity:string;weight:string;description:string;short_description:string;images:string[];featured:boolean;trending:boolean;new_arrival:boolean;bridal:boolean;gender:'Women'|'Men'|'Unisex';availability:'Available to enquire'|'Made to order'|'Showroom exclusive';details:string[];published:boolean};
const categories=['Gold Rings','Gold Necklaces','Gold Earrings','Gold Bangles','Gold Bracelets','Gold Sets','Bridal',"Men's"];
const empty={name:'',slug:'',category:'Gold Necklaces',collection:'',price:'',goldPurity:'22K',weight:'',description:'',shortDescription:'',details:'',gender:'Women',availability:'Available to enquire'};

function ImageAttachment({name,label,current,required}:{name:'primaryImage'|'secondaryImage';label:string;current?:string;required:boolean}){
  const[preview,setPreview]=useState(current??'');
  useEffect(()=>setPreview(current??''),[current]);
  function select(file?:File){
    setPreview(previous=>{if(previous.startsWith('blob:'))URL.revokeObjectURL(previous);return file?URL.createObjectURL(file):(current??'')});
  }
  useEffect(()=>()=>{if(preview.startsWith('blob:'))URL.revokeObjectURL(preview)},[preview]);
  return <label className="image-upload image-attachment"><span className="attachment-title"><ImagePlus size={18}/>{label}</span><span className="attachment-preview">{preview?<><Image src={preview} alt={`${label} thumbnail`} fill sizes="160px" unoptimized={preview.startsWith('blob:')}/><i><CheckCircle2 size={15}/> Ready</i></>:<b>No image selected</b>}</span><input name={name} type="file" accept="image/jpeg,image/png,image/webp" required={required} onChange={event=>select(event.target.files?.[0])}/><small>{current?'Choose a file only to replace this image.':'JPG, PNG, or WebP · maximum 6MB.'}</small></label>;
}

export function ArticleManager(){
  const[articles,setArticles]=useState<ArticleRow[]>([]);
  const[editing,setEditing]=useState<ArticleRow|null>(null);
  const[creating,setCreating]=useState(false);
  const[loading,setLoading]=useState(true);
  const[busy,setBusy]=useState(false);
  const[message,setMessage]=useState('');
  const load=useCallback(async()=>{setLoading(true);const response=await fetch('/api/admin/products',{cache:'no-store'});const body=await response.json();setLoading(false);if(response.ok)setArticles(body.products);else setMessage(body.error||'Unable to load articles.')},[]);
  useEffect(()=>{load()},[load]);
  async function importCatalogue(){setBusy(true);setMessage('');const response=await fetch('/api/admin/products',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'import'})});const body=await response.json();setBusy(false);setMessage(response.ok?`${body.count} existing articles imported.`:body.error);if(response.ok)load()}
  async function remove(article:ArticleRow){if(!confirm(`Delete “${article.name}”? This cannot be undone.`))return;setBusy(true);const response=await fetch(`/api/admin/products/${article.id}`,{method:'DELETE'});const body=await response.json();setBusy(false);setMessage(response.ok?'Article deleted.':body.error);if(response.ok)load()}
  async function save(event:FormEvent<HTMLFormElement>){event.preventDefault();setBusy(true);setMessage('');const form=new FormData(event.currentTarget);for(const key of ['featured','trending','newArrival','bridal','published'])form.set(key,form.get(key)?'true':'false');const response=await fetch(editing?`/api/admin/products/${editing.id}`:'/api/admin/products',{method:editing?'PATCH':'POST',body:form});const body=await response.json();setBusy(false);setMessage(response.ok?`Article ${editing?'updated':'created'} and both image positions are saved.`:body.error);if(response.ok){setEditing(null);setCreating(false);load()}}
  if(loading)return <div className="dashboard-message"><p>Loading catalogue…</p></div>;
  const active=editing;
  return <section className="articles-admin">
    <div className="articles-actions"><div><p>{articles.length} catalogue articles</p><small>Add, update, hide, or remove pieces shown on the website.</small></div><button className="btn gold" onClick={()=>{setEditing(null);setCreating(true);setMessage('')}}><PackagePlus size={16}/> Add article</button></div>
    {message&&<p className="dashboard-notice" role="status">{message}</p>}
    {articles.length===0&&!creating?<div className="dashboard-message"><h2>Import the current catalogue</h2><p>Move the existing website articles into Supabase so they can be edited here.</p><button className="btn gold" disabled={busy} onClick={importCatalogue}>Import existing articles</button></div>:null}
    {(creating||active)&&<form className="article-form" onSubmit={save} key={active?.id??'new'}><header><div><p className="eyebrow">{active?'EDIT ARTICLE':'NEW ARTICLE'}</p><h2>{active?.name||'Create a catalogue piece'}</h2></div><button type="button" aria-label="Close article form" onClick={()=>{setCreating(false);setEditing(null)}}><X/></button></header><div className="article-fields">
      <label>Article name<input name="name" required maxLength={100} defaultValue={active?.name||empty.name} onBlur={event=>{const slug=event.currentTarget.form?.elements.namedItem('slug') as HTMLInputElement|null;if(slug&&!slug.value)slug.value=event.currentTarget.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}}/></label>
      <label>URL slug<input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" defaultValue={active?.slug||empty.slug}/></label>
      <label>Category<select name="category" defaultValue={active?.category||empty.category}>{categories.map(value=><option key={value}>{value}</option>)}</select></label>
      <label>Collection<input name="collection" required defaultValue={active?.collection||empty.collection}/></label>
      <label>Price in PKR <small>(optional)</small><input name="price" type="number" min="1" defaultValue={active?.price??empty.price}/></label>
      <label>Gold purity<input name="goldPurity" required defaultValue={active?.gold_purity||empty.goldPurity}/></label>
      <label>Weight<input name="weight" required defaultValue={active?.weight||empty.weight}/></label>
      <label>Gender<select name="gender" defaultValue={active?.gender||empty.gender}><option>Women</option><option>Men</option><option>Unisex</option></select></label>
      <label>Availability<select name="availability" defaultValue={active?.availability||empty.availability}><option>Available to enquire</option><option>Made to order</option><option>Showroom exclusive</option></select></label>
      <label className="wide">Short description<textarea name="shortDescription" required maxLength={240} defaultValue={active?.short_description||empty.shortDescription}/></label>
      <label className="wide">Full description<textarea name="description" required maxLength={1000} defaultValue={active?.description||empty.description}/></label>
      <label className="wide">Details <small>(one per line)</small><textarea name="details" required maxLength={500} defaultValue={active?.details.join('\n')||empty.details}/></label>
      <div className="wide image-attachments"><ImageAttachment name="primaryImage" label="Primary card image" current={active?.images[0]} required={!active}/><ImageAttachment name="secondaryImage" label="Secondary detail image" current={active?.images[1]} required={!active}/></div>
      <fieldset className="wide article-flags"><label><input name="published" type="checkbox" defaultChecked={active?.published??true}/> Published</label><label><input name="featured" type="checkbox" defaultChecked={active?.featured}/> Featured</label><label><input name="trending" type="checkbox" defaultChecked={active?.trending}/> Spotlight</label><label><input name="newArrival" type="checkbox" defaultChecked={active?.new_arrival}/> New arrival</label><label><input name="bridal" type="checkbox" defaultChecked={active?.bridal}/> Bridal</label></fieldset>
    </div><button className="btn gold" disabled={busy}>{busy?'Saving…':active?'Save changes':'Create article'}</button></form>}
    <div className="article-list">{articles.map(article=><article key={article.id}><Image src={article.images[0]} alt="" width={90} height={105}/><div><small>{article.category} · {article.gold_purity}</small><h3>{article.name}</h3><p>{article.published?'Published':'Hidden'} · {article.availability}</p></div><div className="article-row-actions"><button onClick={()=>{setCreating(false);setEditing(article);scrollTo({top:0,behavior:'smooth'})}}><Edit3 size={15}/> Edit</button><button className="danger" disabled={busy} onClick={()=>remove(article)}><Trash2 size={15}/> Delete</button></div></article>)}</div>
  </section>;
}
