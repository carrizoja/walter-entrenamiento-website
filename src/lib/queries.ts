import { adminDb as db } from './firebase-admin';
import type { Article, GalleryItem } from '../types/database';

function logContentQueryError(scope: string, error: unknown) {
  console.error(`[queries] ${scope} failed:`, error);
}

// ─── Articles ───────────────────────────────────────────────────────────────

export async function getPublishedArticles(): Promise<Article[]> {
  if (!db) return [];
  try {
    const snapshot = await db.collection('articles')
      .get();
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Article))
      .filter(article => article.published)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  } catch (error) {
    logContentQueryError('getPublishedArticles', error);
    return [];
  }
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles.filter(article => article.featured).slice(0, 2);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  if (!db) return null;
  try {
    const snapshot = await db.collection('articles')
      .where('slug', '==', slug)
      .limit(1)
      .get();
    if (snapshot.empty) return null;
    const article = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Article;
    return article.published ? article : null;
  } catch (error) {
    logContentQueryError(`getArticleBySlug(${slug})`, error);
    return null;
  }
}

export async function getAllArticles(): Promise<Article[]> {
  if (!db) return [];
  const snapshot = await db.collection('articles')
    .orderBy('created_at', 'desc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
}

export async function getArticleById(id: string): Promise<Article | null> {
  if (!db) return null;
  const doc = await db.collection('articles').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Article;
}

export async function upsertArticle(article: Partial<Article> & { id?: string }): Promise<Article> {
  if (!db) throw new Error("DB not initialized");
  const payload = { ...article, updated_at: new Date().toISOString() };
  if (payload.id) {
    await db.collection('articles').doc(payload.id).set(payload, { merge: true });
    return payload as Article;
  } else {
    const docRef = await db.collection('articles').add(payload);
    return { ...payload, id: docRef.id } as Article;
  }
}

export async function deleteArticle(id: string): Promise<void> {
  if (!db) throw new Error("DB not initialized");
  await db.collection('articles').doc(id).delete();
}

export async function toggleArticlePublished(id: string, published: boolean): Promise<void> {
  if (!db) throw new Error("DB not initialized");
  await db.collection('articles').doc(id).update({ 
    published, 
    updated_at: new Date().toISOString() 
  });
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export async function getGalleryItems(): Promise<GalleryItem[]> {
  if (!db) return [];
  try {
    const snapshot = await db.collection('gallery_items')
      .get();
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem))
      .sort((a, b) => {
        if (a.sort_order !== b.sort_order) {
          return a.sort_order - b.sort_order;
        }
        return b.created_at.localeCompare(a.created_at);
      });
  } catch (error) {
    logContentQueryError('getGalleryItems', error);
    return [];
  }
}

export async function getFeaturedVideos(): Promise<GalleryItem[]> {
  const items = await getGalleryItems();
  return items.filter(item => item.media_type === 'video' && item.featured).slice(0, 2);
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  if (!db) return null;
  const doc = await db.collection('gallery_items').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as GalleryItem;
}

export async function upsertGalleryItem(item: Partial<GalleryItem> & { id?: string }): Promise<GalleryItem> {
  if (!db) throw new Error("DB not initialized");
  if (item.id) {
    await db.collection('gallery_items').doc(item.id).set(item, { merge: true });
    return item as GalleryItem;
  } else {
    const docRef = await db.collection('gallery_items').add(item);
    return { ...item, id: docRef.id } as GalleryItem;
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (!db) throw new Error("DB not initialized");
  await db.collection('gallery_items').doc(id).delete();
}

export async function swapGalleryOrder(
  a: { id: string; sort_order: number },
  b: { id: string; sort_order: number }
): Promise<void> {
  if (!db) throw new Error("DB not initialized");
  const batch = db.batch();
  batch.update(db.collection('gallery_items').doc(a.id), { sort_order: b.sort_order });
  batch.update(db.collection('gallery_items').doc(b.id), { sort_order: a.sort_order });
  await batch.commit();
}
