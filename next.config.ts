import type {NextConfig} from 'next';

const remotePatterns:NonNullable<NextConfig['images']>['remotePatterns']=[];
if(process.env.NEXT_PUBLIC_SUPABASE_URL){
  const url=new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
  remotePatterns.push({protocol:'https',hostname:url.hostname,pathname:'/storage/v1/object/public/product-images/**'});
  remotePatterns.push({protocol:'https',hostname:url.hostname,pathname:'/storage/v1/object/public/website-images/**'});
}

const config:NextConfig={images:{remotePatterns}};
export default config;
