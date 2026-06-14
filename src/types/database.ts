export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  slug: string;
  featured: boolean;
  read_time: string;
  cover_url: string | null;
  accent_from: string;
  accent_to: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  media_type: 'photo' | 'video';
  storage_path: string;
  public_url: string;
  thumbnail_url: string | null;
  duration: string | null;
  featured: boolean;
  sort_order: number;
  created_at: string;
}
