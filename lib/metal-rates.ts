import {promises as fs} from 'node:fs';
import path from 'node:path';

export const GRAMS_PER_TROY_OUNCE=31.1034768;
export const GRAMS_PER_TOLA=11.6638038;
const STORE_PATH=path.join(process.cwd(),'data','market-rates.json');

export type LocalMarketRates={gold24PerTola:number|null;gold22PerTola:number|null;silverPerTola:number|null;updatedAt:string|null;note:string};
export type MetalRate={perTola:number;perGram:number};
export type LiveMetalRates={gold24:MetalRate;gold22:MetalRate;silver:MetalRate;updatedAt:string;source:'Gold API + ExchangeRate-API';delayed:boolean};

export async function readLocalRates():Promise<LocalMarketRates>{try{const parsed=JSON.parse(await fs.readFile(STORE_PATH,'utf8')) as Partial<LocalMarketRates>;return {gold24PerTola:validRate(parsed.gold24PerTola),gold22PerTola:validRate(parsed.gold22PerTola),silverPerTola:validRate(parsed.silverPerTola),updatedAt:typeof parsed.updatedAt==='string'?parsed.updatedAt:null,note:typeof parsed.note==='string'?parsed.note.slice(0,180):''}}catch{return {gold24PerTola:null,gold22PerTola:null,silverPerTola:null,updatedAt:null,note:''}}}

export async function writeLocalRates(input:unknown):Promise<LocalMarketRates>{if(!input||typeof input!=='object')throw new Error('Invalid rate data.');const body=input as Record<string,unknown>;const next:LocalMarketRates={gold24PerTola:requiredRate(body.gold24PerTola,'24K gold'),gold22PerTola:requiredRate(body.gold22PerTola,'22K gold'),silverPerTola:requiredRate(body.silverPerTola,'silver'),updatedAt:new Date().toISOString(),note:typeof body.note==='string'?body.note.trim().slice(0,180):''};await fs.writeFile(STORE_PATH,`${JSON.stringify(next,null,2)}\n`,'utf8');return next}

export async function fetchLiveRates():Promise<LiveMetalRates>{const options={next:{revalidate:1800},signal:AbortSignal.timeout(8000)} as const;const[goldResponse,silverResponse,fxResponse]=await Promise.all([fetch('https://api.gold-api.com/price/XAU',options),fetch('https://api.gold-api.com/price/XAG',options),fetch('https://open.er-api.com/v6/latest/USD',options)]);if(!goldResponse.ok||!silverResponse.ok||!fxResponse.ok)throw new Error('A public market-data provider is temporarily unavailable.');const[gold,silver,fx]=await Promise.all([goldResponse.json(),silverResponse.json(),fxResponse.json()]) as [SpotResponse,SpotResponse,FxResponse];const goldUsd=positiveNumber(gold.price);const silverUsd=positiveNumber(silver.price);const pkrPerUsd=positiveNumber(fx.rates?.PKR);if(!goldUsd||!silverUsd||!pkrPerUsd||fx.result!=='success')throw new Error('A public market-data provider returned invalid rates.');const gold24=fromUsdOunce(goldUsd,pkrPerUsd);return {gold24,gold22:applyPurity(gold24,22/24),silver:fromUsdOunce(silverUsd,pkrPerUsd),updatedAt:latestTimestamp(gold.updatedAt,silver.updatedAt,fx.time_last_update_unix),source:'Gold API + ExchangeRate-API',delayed:true}}

type SpotResponse={price?:number;updatedAt?:string};
type FxResponse={result?:string;time_last_update_unix?:number;rates?:Record<string,number>};
function fromUsdOunce(usdPerOunce:number,pkrPerUsd:number):MetalRate{const perGram=usdPerOunce*pkrPerUsd/GRAMS_PER_TROY_OUNCE;return {perGram:round(perGram),perTola:round(perGram*GRAMS_PER_TOLA)}}
function applyPurity(rate:MetalRate,factor:number):MetalRate{return {perTola:round(rate.perTola*factor),perGram:round(rate.perGram*factor)}}
function positiveNumber(value:unknown){return typeof value==='number'&&Number.isFinite(value)&&value>0?value:null}
function latestTimestamp(gold?:string,silver?:string,fxUnix?:number){const values=[gold,silver,fxUnix?new Date(fxUnix*1000).toISOString():undefined].filter((value):value is string=>Boolean(value));return values.sort().at(-1)??new Date().toISOString()}
export function perGram(perTola:number|null){return perTola===null?null:round(perTola/GRAMS_PER_TOLA)}
function round(value:number){return Math.round(value*100)/100}
function validRate(value:unknown){return typeof value==='number'&&Number.isFinite(value)&&value>0?value:null}
function requiredRate(value:unknown,label:string){const number=typeof value==='string'?Number(value):value;if(typeof number!=='number'||!Number.isFinite(number)||number<=0||number>100_000_000)throw new Error(`Enter a valid ${label} rate.`);return Math.round(number)}
