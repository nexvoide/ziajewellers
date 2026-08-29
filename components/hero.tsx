'use client';

import Image from 'next/image';
import Link from 'next/link';
import {ArrowDown,ArrowUpRight} from 'lucide-react';
import {useEffect,useRef,useState} from 'react';
import type {WebsiteImage} from '@/lib/site-images';

export function Hero({slides}:{slides:WebsiteImage[]}){
  const[index,setIndex]=useState(0);const[paused,setPaused]=useState(false);const touchStart=useRef<number|null>(null);
  const select=(next:number)=>setIndex((next+slides.length)%slides.length);
  useEffect(()=>{if(paused||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=window.setInterval(()=>setIndex(current=>(current+1)%slides.length),6000);return()=>window.clearInterval(timer)},[paused]);
  return <section id="top" className="hero" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={()=>setPaused(false)} onTouchStart={event=>{touchStart.current=event.touches[0]?.clientX??null}} onTouchEnd={event=>{if(touchStart.current===null)return;const distance=(event.changedTouches[0]?.clientX??touchStart.current)-touchStart.current;if(Math.abs(distance)>45)select(index+(distance<0?1:-1));touchStart.current=null}}>
    <div className="hero-media" aria-live="off">{slides.map((slide,slideIndex)=><div className={`hero-slide ${slideIndex===index?'active':''}`} aria-hidden={slideIndex!==index} key={slide.slot}><picture>{slide.mobileImageUrl&&<source media="(max-width: 640px)" srcSet={slide.mobileImageUrl}/>}<Image src={slide.imageUrl} alt={slideIndex===index?slide.altText:''} fill priority={slideIndex===0} sizes="100vw" style={{objectPosition:slide.objectPosition}}/></picture></div>)}</div>
    <div className="hero-shade"/><div className="hero-copy reveal"><p className="eyebrow">ZIA JEWELLERS <i/></p><h1>TIMELESS GOLD.<br/><em>ETERNAL STORIES.</em></h1><p className="lede">Exceptional craftsmanship, refined design, and timeless pieces created to become part of your story.</p><div className="ctas"><Link className="btn gold magnetic" href="/collections">Explore collection <ArrowUpRight size={15}/></Link><a className="btn ghost" href="#visit">Visit our showroom</a></div></div>
    <a href="#manifesto" className="scroll">SCROLL <ArrowDown size={15}/></a>
  </section>;
}
