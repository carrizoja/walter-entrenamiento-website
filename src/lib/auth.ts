import type { AstroGlobal } from 'astro';
import { adminAuth } from './firebase-admin';
import { isAdminEmail } from './admin-access';

export async function requireAuth(Astro: AstroGlobal) {
  const sessionCookie = Astro.cookies.get('session')?.value;

  if (!sessionCookie) {
    return Astro.redirect('/admin/login');
  }

  try {
    if (adminAuth) {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      if (!isAdminEmail(decodedClaims.email)) {
        console.warn('[auth] Non-admin user attempted to access admin routes:', decodedClaims.email);
        Astro.cookies.delete('session', { path: '/' });
        return Astro.redirect('/admin/login');
      }
      return decodedClaims;
    } else {
      console.error('[auth] Firebase Admin auth is unavailable during protected route check.');
      return Astro.redirect('/admin/login?error=config');
    }
  } catch (error) {
    console.error('[auth] Session verification failed:', error);
    Astro.cookies.delete('session', { path: '/' });
    return Astro.redirect('/admin/login');
  }
}
