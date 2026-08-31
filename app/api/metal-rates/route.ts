import {NextResponse} from 'next/server';
import {fetchLiveRates} from '@/lib/metal-rates';
export const runtime='nodejs';
export async function GET(){try{return NextResponse.json({live:await fetchLiveRates(),liveError:null})}catch(error){return NextResponse.json({live:null,liveError:error instanceof Error?error.message:'Live rates are temporarily unavailable.'})}}
