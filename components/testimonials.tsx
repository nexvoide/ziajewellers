import {Sparkles} from 'lucide-react';import {testimonials} from '@/data/testimonials';
export function Testimonials(){const item=testimonials.find(x=>x.featured)??testimonials[0];return <section className="quote section reveal"><Sparkles size={18}/><blockquote>“{item.quote}”</blockquote><p>{item.customerName} · {item.customerRoleOrContext}</p></section>}
