-- ============================================================
-- Walter Entrenamiento — Supabase Database Setup
-- Run this in your Supabase project's SQL Editor
-- ============================================================

-- ── ARTICLES TABLE ──────────────────────────────────────────
create table public.articles (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  excerpt     text not null default '',
  content     text not null default '',
  category    text not null default 'Entrenamiento',
  slug        text not null unique,
  featured    boolean not null default false,
  read_time   text not null default '5 min',
  cover_url   text,
  accent_from text not null default '#FF6B35',
  accent_to   text not null default '#C83B08',
  published   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── GALLERY ITEMS TABLE ─────────────────────────────────────
create table public.gallery_items (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  description   text not null default '',
  category      text not null default 'Entrenamientos',
  media_type    text not null check (media_type in ('photo', 'video')),
  storage_path  text not null,
  public_url    text not null,
  thumbnail_url text,
  duration      text,
  featured      boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ── ROW LEVEL SECURITY ──────────────────────────────────────

-- Enable RLS on both tables
alter table public.articles enable row level security;
alter table public.gallery_items enable row level security;

-- Articles: anyone can read published ones
create policy "Public can read published articles"
  on public.articles for select
  using (published = true);

-- Articles: authenticated users (Walter) can do everything
create policy "Authenticated users have full access to articles"
  on public.articles for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Gallery: public read
create policy "Public can read gallery items"
  on public.gallery_items for select
  using (true);

-- Gallery: authenticated users (Walter) can do everything
create policy "Authenticated users have full access to gallery"
  on public.gallery_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- ============================================================
-- STORAGE BUCKETS
-- Create these manually in Supabase Dashboard > Storage:
--
--   1. Bucket name: "gallery"
--      Public: YES
--
--   2. Bucket name: "article-covers"
--      Public: YES
--
-- Then add these storage policies for each bucket:
--   - SELECT (read): allow everyone (policy: true)
--   - INSERT/UPDATE/DELETE: only authenticated users
-- ============================================================


-- ── OPTIONAL: SEED DATA ─────────────────────────────────────
-- Uncomment and edit these to pre-load the existing hardcoded content

/*
insert into public.articles (title, slug, excerpt, content, category, read_time, accent_from, accent_to, featured, published)
values
  (
    'Beneficios del Entrenamiento Funcional para Adultos Mayores',
    'beneficios-entrenamiento-funcional-adultos-mayores',
    'Descubrí cómo el entrenamiento funcional puede mejorar tu calidad de vida, movilidad y autonomía en la edad adulta.',
    '<p>Escribí el contenido completo del artículo acá...</p>',
    'Entrenamiento',
    '5 min',
    '#FF6B35',
    '#C83B08',
    true,
    true
  ),
  (
    'La Importancia de la Respiración en el Ejercicio',
    'importancia-respiracion-ejercicio',
    'Aprendé técnicas de respiración correctas que potenciarán tus entrenamientos y reducirán el riesgo de lesiones.',
    '<p>Escribí el contenido completo del artículo acá...</p>',
    'Consejos',
    '4 min',
    '#701D2A',
    '#8C2A3B',
    false,
    true
  );
*/
