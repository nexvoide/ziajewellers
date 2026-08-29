import {Product} from '@/data/products';
import {ProductCard} from './product-card';
export function ProductGrid({items}:{items:Product[]}){return items.length?<div className="product-grid">{items.map(product=><ProductCard product={product} key={product.id}/>)}</div>:<div className="empty-state"><h2>NO PIECES FOUND</h2><p>Adjust your filters or explore the complete collection.</p></div>}
