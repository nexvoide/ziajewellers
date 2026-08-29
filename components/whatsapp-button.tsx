import {MessageCircle} from 'lucide-react';
import {business,messages,whatsappUrl} from '@/data/config';
export function WhatsappButton(){if(!business.whatsapp)return null;return <a className="whatsapp" href={whatsappUrl(messages.general)} aria-label="Chat with Zia on WhatsApp"><MessageCircle size={19}/><span>Chat with Zia</span></a>}
