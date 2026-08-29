'use client';

import Link from 'next/link';
import {FormEvent,useState} from 'react';
import {ArrowLeft,Gem,Images,LineChart,Lock,LogOut,Save} from 'lucide-react';
import type {LocalMarketRates} from '@/lib/metal-rates';
import {ArticleManager} from './article-manager';
import {WebsiteImageManager} from './website-image-manager';

export function RatesDashboard({authenticated:initialAuth,configured,initialRates}:{authenticated:boolean;configured:boolean;initialRates:LocalMarketRates}){
  const[authenticated,setAuthenticated]=useState(initialAuth);const[error,setError]=useState('');
  if(!configured)return <DashboardFrame><div className="dashboard-message"><Lock/><h1>Dashboard setup required</h1><p>Add <code>RATES_ADMIN_PASSWORD</code> and <code>RATES_SESSION_SECRET</code> to the server environment before using this dashboard.</p></div></DashboardFrame>;
  if(!authenticated)return <Login onSuccess={()=>setAuthenticated(true)} error={error} setError={setError}/>;
  return <Editor initialRates={initialRates} onLogout={async()=>{await fetch('/api/rates-auth',{method:'DELETE'});setAuthenticated(false)}}/>;
}

function Login({onSuccess,error,setError}:{onSuccess:()=>void;error:string;setError:(value:string)=>void}){
  const[loading,setLoading]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setLoading(true);setError('');const form=new FormData(event.currentTarget);const response=await fetch('/api/rates-auth',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:form.get('password')})});const body=await response.json();setLoading(false);if(!response.ok)return setError(body.error||'Unable to sign in.');onSuccess()}
  return <DashboardFrame><form className="dashboard-login" onSubmit={submit}><Lock/><p className="eyebrow">AUTHORIZED ACCESS</p><h1>OWNER<br/><em>DASHBOARD</em></h1><label>Password<input name="password" type="password" autoComplete="current-password" required autoFocus/></label>{error&&<p className="form-error" role="alert">{error}</p>}<button className="btn gold" disabled={loading}>{loading?'Signing in…':'Sign in'}</button></form></DashboardFrame>;
}

function Editor({initialRates,onLogout}:{initialRates:LocalMarketRates;onLogout:()=>void}){
  const[tab,setTab]=useState<'rates'|'articles'|'images'>('rates');
  return <DashboardFrame><div className="dashboard-toolbar"><div><p className="eyebrow">ZIA JEWELLERS</p><h1>OWNER DASHBOARD</h1></div><button onClick={onLogout}><LogOut size={16}/> Sign out</button></div><nav className="dashboard-tabs" aria-label="Dashboard sections"><button className={tab==='rates'?'active':''} onClick={()=>setTab('rates')}><LineChart size={17}/> Market rates</button><button className={tab==='articles'?'active':''} onClick={()=>setTab('articles')}><Gem size={17}/> Articles</button><button className={tab==='images'?'active':''} onClick={()=>setTab('images')}><Images size={17}/> Website images</button></nav>{tab==='rates'?<RatesEditor initialRates={initialRates}/>:tab==='articles'?<ArticleManager/>:<WebsiteImageManager/>}</DashboardFrame>;
}

function RatesEditor({initialRates}:{initialRates:LocalMarketRates}){
  const[rates,setRates]=useState(initialRates);const[status,setStatus]=useState('');const[saving,setSaving]=useState(false);
  async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setSaving(true);setStatus('');const form=new FormData(event.currentTarget);const payload={gold24PerTola:form.get('gold24PerTola'),gold22PerTola:form.get('gold22PerTola'),silverPerTola:form.get('silverPerTola'),note:form.get('note')};const response=await fetch('/api/metal-rates',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const body=await response.json();setSaving(false);if(!response.ok)return setStatus(body.error||'Unable to save rates.');setRates(body.rates);setStatus('Rates saved and published to the website.')}
  return <form className="rates-form" onSubmit={submit}><p>Enter current Nawabshah market prices in Pakistani rupees per tola. Gram prices are calculated automatically.</p><div className="rate-inputs"><label>24K gold — PKR per tola<input name="gold24PerTola" type="number" min="1" max="100000000" step="1" required defaultValue={rates.gold24PerTola??''}/></label><label>22K gold — PKR per tola<input name="gold22PerTola" type="number" min="1" max="100000000" step="1" required defaultValue={rates.gold22PerTola??''}/></label><label>Silver — PKR per tola<input name="silverPerTola" type="number" min="1" max="100000000" step="1" required defaultValue={rates.silverPerTola??''}/></label></div><label>Optional market note<textarea name="note" maxLength={180} defaultValue={rates.note} placeholder="Example: Rates may change during the day."/></label>{status&&<p className={status.startsWith('Rates saved')?'form-success':'form-error'} role="status">{status}</p>}<button className="btn gold" disabled={saving}><Save size={16}/>{saving?'Saving…':'Save and publish'}</button></form>;
}

function DashboardFrame({children}:{children:React.ReactNode}){return <section className="dashboard-shell"><Link className="dashboard-back" href="/"><ArrowLeft size={15}/> Return to website</Link>{children}</section>}
