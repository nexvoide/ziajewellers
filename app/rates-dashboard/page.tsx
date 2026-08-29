import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import {RatesDashboard} from '@/components/rates-dashboard';
import {COOKIE_NAME,credentialsConfigured,verifySession} from '@/lib/rates-auth';
import {readLocalRates} from '@/lib/metal-rates';
export const metadata:Metadata={title:'Market Rates Dashboard | Zia Jewellers',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default async function Page(){const store=await cookies();const authenticated=verifySession(store.get(COOKIE_NAME)?.value);const rates=await readLocalRates();return <main className="dashboard-page"><RatesDashboard authenticated={authenticated} configured={credentialsConfigured()} initialRates={rates}/></main>}
