'use client';

import {useEffect,useState} from 'react';

export function PageLoader(){
  const[loaded,setLoaded]=useState(false);

  useEffect(()=>{
    let minimumTimer:number|undefined;
    const started=performance.now();
    const finish=()=>{
      const remaining=Math.max(0,550-(performance.now()-started));
      minimumTimer=window.setTimeout(()=>setLoaded(true),remaining);
    };
    if(document.readyState==='complete')finish();
    else window.addEventListener('load',finish,{once:true});
    const safetyTimer=window.setTimeout(()=>setLoaded(true),10000);
    return()=>{
      window.removeEventListener('load',finish);
      window.clearTimeout(safetyTimer);
      if(minimumTimer!==undefined)window.clearTimeout(minimumTimer);
    };
  },[]);

  return <div className={`loader ${loaded?'loaded':''}`} role="status" aria-live="polite" aria-label="Loading Zia Jewellers" aria-hidden={loaded}><div>ZIA<span>JEWELLERS</span><i/></div></div>;
}
