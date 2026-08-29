import {createHmac,timingSafeEqual} from 'node:crypto';
export const COOKIE_NAME='zia-rates-session';
function secret(){return process.env.RATES_SESSION_SECRET?.trim()||''}
export function credentialsConfigured(){return Boolean(process.env.RATES_ADMIN_PASSWORD?.trim()&&secret())}
export function verifyPassword(value:string){const expected=process.env.RATES_ADMIN_PASSWORD?.trim()||'';return safeEqual(value.trim(),expected)}
export function sessionToken(){return createHmac('sha256',secret()).update('zia-rates-admin-v1').digest('hex')}
export function verifySession(value?:string){return Boolean(value&&secret()&&safeEqual(value,sessionToken()))}
function safeEqual(a:string,b:string){const left=Buffer.from(a);const right=Buffer.from(b);return left.length===right.length&&timingSafeEqual(left,right)}
