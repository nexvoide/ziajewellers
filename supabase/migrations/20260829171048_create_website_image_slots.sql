create table public.website_images (
  slot text primary key check (slot ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  label text not null check (char_length(label) between 2 and 80),
  section text not null check (char_length(section) between 2 and 50),
  image_url text not null,
  mobile_image_url text,
  alt_text text not null check (char_length(alt_text) between 2 and 180),
  object_position text not null default 'center center' check (char_length(object_position) between 3 and 40),
  sort_order smallint not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.website_images enable row level security;
revoke all on table public.website_images from anon, authenticated;
grant select on table public.website_images to anon, authenticated;
create policy "Website images are publicly readable"
on public.website_images for select to anon, authenticated using (true);

insert into public.website_images (slot,label,section,image_url,alt_text,object_position,sort_order) values
('hero-1','Hero slide 1','Hero','/images/campaigns/hero-user-v1.jpg','Three women presenting distinct Zia Jewellers gold collections','right top',1),
('hero-2','Hero slide 2','Hero','/images/zia-hero.jpg','Zia Jewellers gold campaign portrait','right center',2),
('hero-3','Hero slide 3','Hero','/images/campaigns/bridal-campaign-brand-v2.jpg','Zia bridal gold collection campaign','center center',3),
('royal-heritage','Royal Heritage feature','Collections','/images/campaigns/velvet-gold-set-brand-v2.jpg','Royal Heritage gold collection','center center',1),
('jewel-focus','Jewel in Focus','Features','/images/campaigns/heritage-stone-set-brand-v2.jpg','Meher Choker details','75% center',1),
('heritage-story','Our Heritage portrait','Features','/images/campaigns/necklace-portrait-brand-v2.jpg','Zia craftsmanship and heritage','70% center',2),
('bridal-banner','Bridal campaign banner','Bridal','/images/campaigns/bridal-campaign-brand-v2.jpg','Zia bridal gold collection','center center',1),
('gallery-1','Gallery image 1','Gallery','/images/campaigns/necklace-portrait-brand-v2.jpg','Gold necklace portrait','center 35%',1),
('gallery-2','Gallery image 2','Gallery','/images/campaigns/earrings-portrait-brand-v2.jpg','Gold earrings portrait','center 35%',2),
('gallery-3','Gallery image 3','Gallery','/images/campaigns/velvet-gold-set-brand-v2.jpg','Gold set composition','center center',3),
('gallery-4','Gallery image 4','Gallery','/images/campaigns/bangles-portrait-brand-v2.jpg','Gold bangles composition','center center',4),
('gallery-5','Gallery image 5','Gallery','/images/campaigns/ring-square-brand-v2.jpg','Gold ring composition','center center',5);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('website-images','website-images',true,10485760,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=excluded.public,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
