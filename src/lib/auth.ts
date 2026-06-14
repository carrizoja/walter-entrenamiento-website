import type { AstroGlobal } from 'astro';
import { adminAuth } from './firebase-admin';

export async function requireAuth(Astro: AstroGlobal) {
  const sessionCookie = Astro.cookies.get('session')?.value;

  if (!sessionCookie) {
    return Astro.redirect('/admin/login');
  }

  try {
    if (adminAuth) {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      return decodedClaims;
    } else {
      return Astro.redirect('/admin/login');
    }
  } catch (error) {
    // Session is invalid or expired
    Astro.cookies.delete('session');
    return Astro.redirect('/admin/login');
  }
}
