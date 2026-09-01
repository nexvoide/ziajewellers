'use client';

import {Clock3, RefreshCw, TrendingUp} from 'lucide-react';
import {useCallback, useEffect, useRef, useState} from 'react';

type Rate = {perTola: number; perGram: number};
type RatesResponse = {
  live: {gold24: Rate; gold22: Rate; silver: Rate; updatedAt: string; source: string; delayed: boolean} | null;
  liveError: string | null;
};

const REFRESH_INTERVAL_MS = 15 * 60 * 1000;
const money = (value: number) => new Intl.NumberFormat('en-PK', {
  style: 'currency', currency: 'PKR', maximumFractionDigits: 0,
}).format(value);

export function MarketRates() {
  const [data, setData] = useState<RatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const lastRequestAt = useRef(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/metal-rates', {cache: 'no-store'});
      if (!response.ok) throw new Error('Unable to load market rates.');
      setData((await response.json()) as RatesResponse);
      lastRequestAt.current = Date.now();
    } catch {
      setData((current) => current ?? {live: null, liveError: 'Live rates are temporarily unavailable.'});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = window.setInterval(() => void load(), REFRESH_INTERVAL_MS);
    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastRequestAt.current >= REFRESH_INTERVAL_MS) void load();
    };
    document.addEventListener('visibilitychange', refreshWhenVisible);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [load]);

  const rates: [string, string, Rate | null][] = [
    ['24K', 'Pure Gold', data?.live?.gold24 ?? null],
    ['22K', 'Jewellery Gold', data?.live?.gold22 ?? null],
    ['Silver', 'Fine Silver', data?.live?.silver ?? null],
  ];

  return (
    <section className="rates section" id="rates" aria-labelledby="rates-title">
      <div className="rates-heading">
        <div>
          <p className="eyebrow">PAKISTAN GOLD PRICE</p>
          <h2 id="rates-title">TODAY&apos;S <em>MARKET RATES</em></h2>
          <p className="rates-intro">Live gold and silver reference prices converted to Pakistani rupees.</p>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading}>
          <RefreshCw className={loading ? 'spinning' : ''} size={16} />
          {loading ? 'Updating…' : 'Refresh rates'}
        </button>
      </div>

      <article className="rate-board">
        <header className="rate-board-header">
          <div className="rate-board-title">
            <span className="rate-icon"><TrendingUp size={18} /></span>
            <div><h3>Pakistan Live Reference</h3><p>Indicative open-market pricing</p></div>
          </div>
          <div className={`rate-status ${data?.live ? 'is-live' : ''}`}><i aria-hidden="true" />{data?.live ? 'Live feed' : 'Feed unavailable'}</div>
        </header>

        <div className="rate-column-labels" aria-hidden="true">
          <span>Metal &amp; purity</span><span>Price per tola</span><span>Price per gram</span>
        </div>
        <div className="rate-rows">
          {rates.map(([symbol, name, rate]) => (
            <div className="rate-row" key={symbol}>
              <div className="rate-metal"><strong>{symbol}</strong><span>{name}</span></div>
              {rate ? <>
                <div className="rate-value"><small>Per tola</small><strong>{money(rate.perTola)}</strong></div>
                <div className="rate-value"><small>Per gram</small><strong>{money(rate.perGram)}</strong></div>
              </> : <p className="rate-unavailable">Rate temporarily unavailable</p>}
            </div>
          ))}
        </div>
        <footer className="rate-board-footer">
          <span><Clock3 size={14} />{data?.live ? `Updated ${new Date(data.live.updatedAt).toLocaleString('en-PK', {dateStyle: 'medium', timeStyle: 'short'})}` : 'Waiting for the live feed'}</span>
          <span>Automatically refreshes every 15 minutes</span>
        </footer>
      </article>

      <div className="rates-foot"><p>
        Prices are shown in Pakistani rupees. One tola equals 11.6638038 grams. The 22K reference is calculated at 22/24 of the pure-gold spot price. These indicative international spot rates are not a purchase or sale quotation. Data: <a href="https://gold-api.com" target="_blank" rel="noreferrer">Gold API</a> and <a href="https://www.exchangerate-api.com" target="_blank" rel="noreferrer">ExchangeRate-API</a>.
      </p></div>
    </section>
  );
}
