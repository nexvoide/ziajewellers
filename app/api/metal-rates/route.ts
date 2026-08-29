import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {fetchLiveRates,perGram,readLocalRates,writeLocalRates} from '@/lib/metal-rates';
import {COOKIE_NAME,verifySession} from '@/lib/rates-auth';
export const runtime='nodejs';
export async function GET(){const local=await readLocalRates();let live=null;let liveError:string|null=null;try{live=await fetchLiveRates()}catch(error){liveError=error instanceof Error?error.message:'Live rates are temporarily unavailable.'}return NextResponse.json({local:{gold24:local.gold24PerTola?{perTola:local.gold24PerTola,perGram:perGram(local.gold24PerTola)}:null,gold22:local.gold22PerTola?{perTola:local.gold22PerTola,perGram:perGram(local.gold22PerTola)}:null,silver:local.silverPerTola?{perTola:local.silverPerTola,perGram:perGram(local.silverPerTola)}:null,updatedAt:local.updatedAt,note:local.note},live,liveError,units:{tolaGrams:11.6638038,troyOunceGrams:31.1034768}})}
export async function POST(request:Request){const cookieStore=await cookies();if(!verifySession(cookieStore.get(COOKIE_NAME)?.value))return NextResponse.json({error:'Unauthorized.'},{status:401});try{return NextResponse.json({rates:await writeLocalRates(await request.json())})}catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Unable to save rates.'},{status:400})}}
