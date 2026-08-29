'use client';
import {createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
type WishlistContextValue={ids:number[];ready:boolean;toggle:(id:number)=>void;has:(id:number)=>boolean;clear:()=>void};
const WishlistContext=createContext<WishlistContextValue|null>(null);
const KEY='zia-wishlist';
export function WishlistProvider({children}:{children:React.ReactNode}){const[ids,setIds]=useState<number[]>([]);const[ready,setReady]=useState(false);useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(saved))setIds(saved.filter(Number.isInteger))}catch{}setReady(true)},[]);useEffect(()=>{if(ready)localStorage.setItem(KEY,JSON.stringify(ids))},[ids,ready]);const toggle=useCallback((id:number)=>setIds(x=>x.includes(id)?x.filter(i=>i!==id):[...x,id]),[]);const value=useMemo(()=>({ids,ready,toggle,has:(id:number)=>ids.includes(id),clear:()=>setIds([])}),[ids,ready,toggle]);return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>}
export function useWishlist(){const context=useContext(WishlistContext);if(!context)throw new Error('useWishlist must be used within WishlistProvider');return context}
