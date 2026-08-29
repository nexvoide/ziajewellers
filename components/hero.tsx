'use client';

import Image from 'next/image';
import Link from 'next/link';
import {ArrowDown,ArrowUpRight,ChevronLeft,ChevronRight} from 'lucide-react';
import {useEffect,useRef,useState} from 'react';

const slides=[
  {src:'/images/campaigns/hero-user-v1.jpg',alt:'Three women presenting distinct Zia Jewellers gold collections',position:'right top'},
  {src:'/images/zia-hero.jpg',alt:'Zia Jewellers gold campaign portrait',position:'right center'},
  {src:'/images/campaigns/bridal-campaign-brand-v2.jpg',alt:'Zia bridal gold collection campaign',position:'center center'},
] as const;

export function Hero(){
  const[index,setIndex]=useState(0);const[paused,setPaused]=useState(false);const touchStart=useRef<number|null>(null);
  const select=(next:number)=>setIndex((next+slides.length)%slides.length);
  useEffect(()=>{if(paused||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const timer=window.setInterval(()=>setIndex(current=>(current+1)%slides.length),6000);return()=>window.clearInterval(timer)},[paused]);
  return <section id="top" className="hero" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={()=>setPaused(false)} onTouchStart={event=>{touchStart.current=event.touches[0]?.clientX??null}} onTouchEnd={event=>{if(touchStart.current===null)return;const distance=(event.changedTouches[0]?.clientX??touchStart.current)-touchStart.current;if(Math.abs(distance)>45)select(index+(distance<0?1:-1));touchStart.current=null}}>
    <div className="hero-media" aria-live="off">{slides.map((slide,slideIndex)=><div className={`hero-slide ${slideIndex===index?'active':''}`} aria-hidden={slideIndex!==index} key={slide.src}><Image src={slide.src} alt={slideIndex===index?slide.alt:''} fill priority={slideIndex===0} sizes="100vw" style={{objectPosition:slide.position}}/></div>)}</div>
    <div className="hero-shade"/><div className="hero-copy reveal"><p className="eyebrow">ZIA JEWELLERS <i/></p><h1>TIMELESS GOLD.<br/><em>ETERNAL STORIES.</em></h1><p className="lede">Exceptional craftsmanship, refined design, and timeless pieces created to become part of your story.</p><div className="ctas"><Link className="btn gold magnetic" href="/collections">Explore collection <ArrowUpRight size={15}/></Link><a className="btn ghost" href="#visit">Visit our showroom</a></div></div>
    <div className="hero-slider-controls"><button type="button" onClick={()=>select(index-1)} aria-label="Previous hero image"><ChevronLeft/></button><div className="hero-dots" role="tablist" aria-label="Hero images">{slides.map((slide,slideIndex)=><button type="button" role="tab" aria-label={`Show image ${slideIndex+1}`} aria-selected={slideIndex===index} onClick={()=>select(slideIndex)} key={slide.src}><span/></button>)}</div><button type="button" onClick={()=>select(index+1)} aria-label="Next hero image"><ChevronRight/></button></div>
    <a href="#manifesto" className="scroll">SCROLL <ArrowDown size={15}/></a>
  </section>;
}
