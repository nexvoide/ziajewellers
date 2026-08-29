import {ImageResponse} from 'next/og';
export const runtime='edge';
export const alt='Zia Jewellers — Timeless Gold. Eternal Stories.';
export const size={width:1200,height:630};
export const contentType='image/png';
export default function Image(){return new ImageResponse(<div style={{width:'100%',height:'100%',display:'flex',flexDirection:'column',justifyContent:'center',padding:'90px',background:'radial-gradient(circle at 75% 50%, #3a2a12 0%, #151210 28%, #080706 65%)',color:'#F6F1E8'}}><div style={{display:'flex',fontSize:26,letterSpacing:14,color:'#C9A45C'}}>ZIA JEWELLERS</div><div style={{display:'flex',width:100,height:2,background:'#C9A45C',margin:'36px 0'}}/><div style={{display:'flex',flexDirection:'column',fontFamily:'serif',fontSize:88,lineHeight:.95}}><span>TIMELESS GOLD.</span><span style={{color:'#E3C98A',fontStyle:'italic'}}>ETERNAL STORIES.</span></div></div>,size)}
