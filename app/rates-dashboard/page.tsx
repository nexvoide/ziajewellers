import {cookies} from 'next/headers';
import {RatesDashboard} from '@/components/rates-dashboard';
import {COOKIE_NAME,credentialsConfigured,verifySession} from '@/lib/rates-auth';
export const dynamic='force-dynamic';
export default async function Page(){const store=await cookies();const authenticated=verifySession(store.get(COOKIE_NAME)?.value);return <main className="dashboard-page"><RatesDashboard authenticated={authenticated} configured={credentialsConfigured()}/></main>}
